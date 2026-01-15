const fs = require('fs');

// Read the blog data
const blogsData = JSON.parse(fs.readFileSync('final_fixed_blogs.json', 'utf8'));
const blogs = Array.isArray(blogsData) ? blogsData : (blogsData.data || blogsData.blogs || []);

console.log(`\n========== BLOG SEO & STRUCTURE ANALYSIS ==========\n`);
console.log(`Total Blogs: ${blogs.length}\n`);

const issues = {
    missingMetaKeywords: [],
    shortMetaDescriptions: [],
    missingImages: [],
    brokenImages: [],
    noMetaTitle: [],
    shortTitles: [],
    longTitles: [],
    duplicateKeywords: [],
    needsTopicKeywords: []
};

blogs.forEach((blog, index) => {
    const blogNum = index + 1;
    const title = typeof blog.title === 'string' ? JSON.parse(blog.title).EN : blog.title?.EN || 'No Title';
    const url = blog.url || 'no-url';

    console.log(`\n[${blogNum}/${blogs.length}] ${title}`);
    console.log(`URL: ${url}`);

    // Check Meta Title
    if (!blog.metaTitle || blog.metaTitle.trim() === '') {
        console.log(`  ⚠️  Missing Meta Title`);
        issues.noMetaTitle.push({ title, url, blogNum });
    } else if (blog.metaTitle.length < 30) {
        console.log(`  ⚠️  Meta Title too short (${blog.metaTitle.length} chars)`);
        issues.shortTitles.push({ title, url, metaTitle: blog.metaTitle, blogNum });
    } else if (blog.metaTitle.length > 60) {
        console.log(`  ⚠️  Meta Title too long (${blog.metaTitle.length} chars)`);
        issues.longTitles.push({ title, url, metaTitle: blog.metaTitle, blogNum });
    } else {
        console.log(`  ✅ Meta Title: ${blog.metaTitle.length} chars`);
    }

    // Check Meta Description
    if (!blog.metaDescription || blog.metaDescription.trim() === '') {
        console.log(`  ⚠️  Missing Meta Description`);
    } else if (blog.metaDescription.length < 120) {
        console.log(`  ⚠️  Meta Description too short (${blog.metaDescription.length} chars)`);
        issues.shortMetaDescriptions.push({ title, url, length: blog.metaDescription.length, blogNum });
    } else if (blog.metaDescription.length > 160) {
        console.log(`  ⚠️  Meta Description too long (${blog.metaDescription.length} chars)`);
    } else {
        console.log(`  ✅ Meta Description: ${blog.metaDescription.length} chars`);
    }

    // Check Meta Keywords
    if (!blog.metaKeywords || blog.metaKeywords.length === 0) {
        console.log(`  ⚠️  Missing Meta Keywords`);
        issues.missingMetaKeywords.push({ title, url, blogNum });

        // Extract topic from title or category
        const topic = extractTopic(title, blog.category?.name);
        if (topic) {
            issues.needsTopicKeywords.push({ title, url, topic, blogNum });
        }
    } else {
        console.log(`  ✅ Meta Keywords: ${blog.metaKeywords.length} keywords`);

        // Check for duplicate keywords
        const duplicates = findDuplicates(blog.metaKeywords);
        if (duplicates.length > 0) {
            console.log(`  ⚠️  Duplicate keywords: ${duplicates.join(', ')}`);
            issues.duplicateKeywords.push({ title, url, duplicates, blogNum });
        }

        // Check if topic is in keywords
        const topic = extractTopic(title, blog.category?.name);
        if (topic && !blog.metaKeywords.some(kw => kw.toLowerCase().includes(topic.toLowerCase()))) {
            console.log(`  ⚠️  Topic "${topic}" not in keywords`);
            issues.needsTopicKeywords.push({ title, url, topic, existing: blog.metaKeywords, blogNum });
        }
    }

    // Check Featured Image
    if (!blog.image || !blog.image.url) {
        console.log(`  ⚠️  Missing Featured Image`);
        issues.missingImages.push({ title, url, blogNum });
    } else {
        console.log(`  ✅ Featured Image: ${blog.image.url}`);
    }

    // Check Tags
    if (!blog.tag || blog.tag.length === 0) {
        console.log(`  ⚠️  No Tags`);
    } else {
        console.log(`  ✅ Tags: ${blog.tag.map(t => t.name).join(', ')}`);
    }

    // Check Category
    if (!blog.category) {
        console.log(`  ⚠️  No Category`);
    } else {
        console.log(`  ✅ Category: ${blog.category.name}`);
    }
});

// Helper functions
function extractTopic(title, categoryName) {
    // Extract main topic from title
    const topics = [
        'digital marketing',
        'seo',
        'social media marketing',
        'content marketing',
        'email marketing',
        'ppc',
        'google ads',
        'facebook ads',
        'instagram marketing',
        'youtube marketing',
        'affiliate marketing',
        'influencer marketing',
        'marketing automation',
        'analytics',
        'conversion optimization'
    ];

    const lowerTitle = title.toLowerCase();
    const lowerCategory = (categoryName || '').toLowerCase();

    for (const topic of topics) {
        if (lowerTitle.includes(topic) || lowerCategory.includes(topic)) {
            return topic;
        }
    }

    return null;
}

function findDuplicates(arr) {
    const seen = new Set();
    const duplicates = [];

    arr.forEach(item => {
        const lower = item.toLowerCase();
        if (seen.has(lower)) {
            if (!duplicates.includes(item)) {
                duplicates.push(item);
            }
        } else {
            seen.add(lower);
        }
    });

    return duplicates;
}

// Print Summary
console.log(`\n\n========== SUMMARY OF ISSUES ==========\n`);

console.log(`\n📊 Meta Title Issues:`);
console.log(`  - Missing: ${issues.noMetaTitle.length}`);
console.log(`  - Too Short (<30 chars): ${issues.shortTitles.length}`);
console.log(`  - Too Long (>60 chars): ${issues.longTitles.length}`);

console.log(`\n📝 Meta Description Issues:`);
console.log(`  - Too Short (<120 chars): ${issues.shortMetaDescriptions.length}`);

console.log(`\n🏷️  Meta Keywords Issues:`);
console.log(`  - Missing Keywords: ${issues.missingMetaKeywords.length}`);
console.log(`  - Needs Topic Keywords: ${issues.needsTopicKeywords.length}`);
console.log(`  - Has Duplicates: ${issues.duplicateKeywords.length}`);

console.log(`\n🖼️  Image Issues:`);
console.log(`  - Missing Featured Image: ${issues.missingImages.length}`);

// Save detailed report
const report = {
    totalBlogs: blogs.length,
    timestamp: new Date().toISOString(),
    issues: issues,
    recommendations: generateRecommendations(issues)
};

fs.writeFileSync('blog-seo-analysis.json', JSON.stringify(report, null, 2));
console.log(`\n✅ Detailed report saved to: blog-seo-analysis.json`);

function generateRecommendations(issues) {
    const recommendations = [];

    if (issues.needsTopicKeywords.length > 0) {
        recommendations.push({
            priority: 'HIGH',
            issue: 'Missing topic keywords',
            count: issues.needsTopicKeywords.length,
            action: 'Add main topic as meta keyword for better SEO targeting',
            blogs: issues.needsTopicKeywords.map(b => ({
                blogNum: b.blogNum,
                title: b.title,
                url: b.url,
                suggestedKeyword: b.topic
            }))
        });
    }

    if (issues.missingMetaKeywords.length > 0) {
        recommendations.push({
            priority: 'HIGH',
            issue: 'Missing meta keywords',
            count: issues.missingMetaKeywords.length,
            action: 'Add relevant meta keywords for SEO',
            blogs: issues.missingMetaKeywords.map(b => ({
                blogNum: b.blogNum,
                title: b.title,
                url: b.url
            }))
        });
    }

    if (issues.shortMetaDescriptions.length > 0) {
        recommendations.push({
            priority: 'MEDIUM',
            issue: 'Short meta descriptions',
            count: issues.shortMetaDescriptions.length,
            action: 'Expand meta descriptions to 120-160 characters',
            blogs: issues.shortMetaDescriptions.map(b => ({
                blogNum: b.blogNum,
                title: b.title,
                url: b.url,
                currentLength: b.length
            }))
        });
    }

    if (issues.missingImages.length > 0) {
        recommendations.push({
            priority: 'MEDIUM',
            issue: 'Missing featured images',
            count: issues.missingImages.length,
            action: 'Add featured images for better engagement',
            blogs: issues.missingImages.map(b => ({
                blogNum: b.blogNum,
                title: b.title,
                url: b.url
            }))
        });
    }

    return recommendations;
}

console.log(`\n========== END OF ANALYSIS ==========\n`);
