const fs = require('fs');

// Configuration
const CONFIG = {
    TITLE_MIN: 40,
    TITLE_MAX: 70, // 60 is optimal, but 70 is okay
    DESC_MIN: 140,
    DESC_MAX: 170, // 160 optimal
    CONTENT_MIN_WORDS: 300,
    KEYWORD_DENSITY_MAX: 0.04, // 4%
};

// Helper: Strip HTML
function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, ' ');
}

// Helper: Count words
function countWords(text) {
    if (!text) return 0;
    return text.trim().split(/\s+/).length;
}

// Helper: Check headings
function checkHeadings(html) {
    const h1Count = (html.match(/<h1[^>]*>/g) || []).length;
    const h2Count = (html.match(/<h2[^>]*>/g) || []).length;
    const h3Count = (html.match(/<h3[^>]*>/g) || []).length;
    return { h1: h1Count, h2: h2Count, h3: h3Count };
}

// Helper: Check images for Alt
function checkImages(html) {
    const imgTags = html.match(/<img[^>]*>/g) || [];
    let missingAlt = 0;
    imgTags.forEach(tag => {
        if (!tag.includes('alt=') || tag.includes('alt=""') || tag.includes("alt=''")) {
            missingAlt++;
        }
    });
    return { total: imgTags.length, missingAlt };
}

// Helper: Parse safely
function safeParse(jsonStr) {
    try {
        if (typeof jsonStr === 'object') return jsonStr;
        return JSON.parse(jsonStr);
    } catch (e) {
        return null;
    }
}

// Main Analysis
function runAudit() {
    console.log("🔍 Starting SEO & Content Audit...\n");

    const blogs = JSON.parse(fs.readFileSync('blogs-data.json', 'utf8'));
    const report = [];

    // Counters
    let criticalIssues = 0;
    let warnings = 0;
    let passed = 0;

    blogs.forEach((blog, index) => {
        const issues = [];
        const warn = [];

        // 1. Data Parsing
        const titleObj = safeParse(blog.title) || { EN: blog.title || '' };
        const descObj = safeParse(blog.description) || { EN: blog.description || '' };

        const title = titleObj.EN || titleObj.en || '';
        const contentHTML = descObj.EN || descObj.en || '';
        const contentText = stripHtml(contentHTML);
        const metaTitle = blog.metaTitle || '';
        const metaDesc = blog.metaDescription || '';
        const keywords = blog.metaKeywords || []; // backend might return array or string? assume array based on previous files

        // 2. SEO Checks
        // Title
        if (!title) {
            issues.push("Missing Blog Title");
        } else if (title.length < CONFIG.TITLE_MIN) {
            warn.push(`Title too short (${title.length} chars)`);
        } else if (title.length > CONFIG.TITLE_MAX) {
            warn.push(`Title too long (${title.length} chars)`);
        }

        // Meta Title
        if (!metaTitle) {
            issues.push("Missing Meta Title");
        } else if (metaTitle.length > 70) {
            warn.push(`Meta Title too long (${metaTitle.length} chars)`);
        }

        // Meta Descriptions
        if (!metaDesc) {
            issues.push("Missing Meta Description");
        } else if (metaDesc.length < CONFIG.DESC_MIN) {
            warn.push(`Meta Description too short (${metaDesc.length} chars)`);
        } else if (metaDesc.length > CONFIG.DESC_MAX) {
            warn.push(`Meta Description too long (${metaDesc.length} chars)`);
        }

        // 3. Content Quality
        const wordCount = countWords(contentText);
        if (wordCount < 10) {
            issues.push(`Empty or meaningless content (${wordCount} words)`);
        } else if (wordCount < CONFIG.CONTENT_MIN_WORDS) {
            warn.push(`Content too short/thin (${wordCount} words)`);
        }

        // Headings
        const headings = checkHeadings(contentHTML);
        if (headings.h1 > 0) {
            warn.push(`Use of H1 in content (should be reserved for Title only)`);
        }
        if (headings.h2 === 0 && wordCount > 300) {
            warn.push(`No H2 tags found in long content (Structure issue)`);
        }

        // Images
        const imgCheck = checkImages(contentHTML);
        if (imgCheck.missingAlt > 0) {
            warn.push(`${imgCheck.missingAlt} images missing Alt text`);
        }

        // Keyword Stuffing (Basic)
        if (keywords.length > 0) {
            const mainKw = keywords[0];
            const regex = new RegExp(mainKw, "gi");
            const kwCount = (contentText.match(regex) || []).length;
            const density = kwCount / (wordCount || 1);

            if (density > CONFIG.KEYWORD_DENSITY_MAX) {
                warn.push(`Possible keyword stuffing for "${mainKw}" (${(density * 100).toFixed(1)}%)`);
            }
        } else {
            warn.push("No Keywords defined");
        }

        // 4. Broken Images (URL check)
        if (contentHTML.includes('undefined') || contentHTML.includes('null')) {
            issues.push("Content contains broken image links (undefined/null)");
        }
        if (!blog.image || !blog.image.url || blog.image.url.includes('undefined')) {
            issues.push("Missing or broken Featured Image");
        }

        // Aggregate Report
        if (issues.length > 0 || warn.length > 0) {
            report.push({
                id: blog._id,
                title: title,
                slug: blog.url || blog.slug,
                issues: issues,
                warnings: warn
            });
            if (issues.length > 0) criticalIssues++;
            else warnings++;
        } else {
            passed++;
        }
    });

    console.log(`✅ Audit Complete!`);
    console.log(`- Total Blogs: ${blogs.length}`);
    console.log(`- Good: ${passed}`);
    console.log(`- With Warnings: ${warnings}`);
    console.log(`- Critical Issues: ${criticalIssues}\n`);

    // Generate Markdown Report
    let md = `# SEO & Content Audit Report\n\n`;
    md += `**Date**: ${new Date().toLocaleString()}\n`;
    md += `**Total Blogs Reviewed**: ${blogs.length}\n\n`;

    md += `## 📊 Summary\n`;
    md += `- 🟢 **Passed**: ${passed}\n`;
    md += `- 🟡 **Passed with Warnings**: ${warnings}\n`;
    md += `- 🔴 **Critical Issues**: ${criticalIssues}\n\n`;

    md += `## 🔍 Detailed Analysis\n`;

    if (report.length === 0) {
        md += "No issues found! 🎉\n";
    }

    report.forEach(item => {
        md += `### [${item.title || '(No Title)'}](https://digitalstudyschool.com/blog/${item.slug})\n`;
        md += `**ID**: \`${item.id}\`\n\n`;

        if (item.issues.length > 0) {
            md += `**🛑 Critical Issues**:\n`;
            item.issues.forEach(i => md += `- ${i}\n`);
            md += `\n`;
        }

        if (item.warnings.length > 0) {
            md += `**⚠️ Warnings**:\n`;
            item.warnings.forEach(w => md += `- ${w}\n`);
            md += `\n`;
        }
        md += `---\n`;
    });

    fs.writeFileSync('SEO_AUDIT_REPORT.md', md);
    console.log("📄 Report saved to SEO_AUDIT_REPORT.md");
}

runAudit();
