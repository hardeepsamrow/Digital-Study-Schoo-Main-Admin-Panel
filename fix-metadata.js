const axios = require('axios');
const fs = require('fs');

const API_BASE = "https://backend.digitalstudyschool.com/";
const AUTH_EMAIL = "hssamrow@gmail.com";
const AUTH_PASSWORD = "Rsoft@123";

// Helper to smart trim
function smartTrim(text, maxLength) {
    if (!text || text.length <= maxLength) return text;

    let trimmed = text.substr(0, maxLength);
    // Don't cut words
    trimmed = trimmed.substr(0, trimmed.lastIndexOf(" "));

    // Remove trailing punctuation
    trimmed = trimmed.replace(/[,;:-]+$/, "");

    return trimmed + "...";
}

async function fixMetadata() {
    console.log("🔐 Logging in...");
    let token = "";

    try {
        const loginRes = await axios.post(`${API_BASE}api/admin/login`, {
            email: AUTH_EMAIL,
            password: AUTH_PASSWORD
        });
        token = loginRes.data.data.accessToken;
        console.log("✅ Login successful!\n");
    } catch (e) {
        console.log("❌ Login failed:", e.message);
        return;
    }

    const blogs = JSON.parse(fs.readFileSync('blogs-data.json', 'utf8'));
    let fixedCount = 0;

    for (let i = 0; i < blogs.length; i++) {
        const blog = blogs[i];
        let needsUpdate = false;

        // Check Meta Title (Max 60 for SEO, we allow up to 65 safely)
        let newMetaTitle = blog.metaTitle || "";
        if (newMetaTitle.length > 65) {
            newMetaTitle = smartTrim(newMetaTitle, 60);
            needsUpdate = true;
        }

        // Check Meta Description (Max 160)
        let newMetaDesc = blog.metaDescription || "";
        if (newMetaDesc.length > 165) {
            newMetaDesc = smartTrim(newMetaDesc, 155);
            needsUpdate = true;
        }

        if (needsUpdate) {
            console.log(`🔧 Fixing Blog ${i + 1}: ${blog._id}`);
            if (blog.metaTitle !== newMetaTitle) {
                console.log(`   - Trimming Meta Title: ${blog.metaTitle.length} -> ${newMetaTitle.length}`);
            }
            if (blog.metaDescription !== newMetaDesc) {
                console.log(`   - Trimming Meta Desc:  ${blog.metaDescription.length} -> ${newMetaDesc.length}`);
            }

            const updateData = {
                title: blog.title, // Keep original format (string or JSON)
                description: blog.description, // Keep original
                metaTitle: newMetaTitle,
                metaDescription: newMetaDesc,
                url: blog.url || blog.slug,
                status: blog.status,
                category: blog.category ? blog.category._id : undefined,
                metaKeywords: blog.metaKeywords,
                tag: blog.tag
            };

            try {
                await axios.put(`${API_BASE}api/blogs/update/${blog._id}`, updateData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(`   ✅ Updated`);
                fixedCount++;
            } catch (e) {
                console.log(`   ❌ Failed: ${e.message}`);
            }

            // Delay to be gentle
            await new Promise(r => setTimeout(r, 400));
        }
    }

    console.log(`\n=== DONE ===`);
    console.log(`Fixed ${fixedCount} blogs.`);
}

fixMetadata();
