const axios = require('axios');
const fs = require('fs');

const API_BASE = "https://backend.digitalstudyschool.com/";
const AUTH_EMAIL = "hssamrow@gmail.com";
const AUTH_PASSWORD = "Rsoft@123";

async function fixLists() {
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

        let descObj = {};
        try {
            descObj = typeof blog.description === 'string' ? JSON.parse(blog.description) : blog.description;
        } catch (e) { continue; }

        let contentEN = descObj.EN || descObj.en || '';
        let contentPU = descObj.PU || descObj.pu || '';

        // Function to clean content
        const cleanListContent = (html) => {
            if (!html) return html;
            let newHtml = html;

            // 1. Unwrap <p> inside <li>: <li><p>Text</p></li> -> <li>Text</li>
            // We use a regex that captures content between <p> and </p> inside <li>
            // Note: This is simple regex, might fail on complex nested tags, but standard TinyMCE output is predictable.
            if (newHtml.includes('<li><p>')) {
                newHtml = newHtml.replace(/<li>\s*<p>(.*?)<\/p>\s*<\/li>/g, '<li>$1</li>');

                // Also handle cases with attributes: <li><p style="...">
                newHtml = newHtml.replace(/<li>\s*<p[^>]*>(.*?)<\/p>\s*<\/li>/g, '<li>$1</li>');
            }

            // 2. Remove leading <br> inside <li>: <li><br>Text</li> -> <li>Text</li>
            // Or <li><br />Text</li>
            newHtml = newHtml.replace(/<li>\s*<br\s*\/?>\s*/g, '<li>');

            // 3. Remove &nbsp; at start of li
            newHtml = newHtml.replace(/<li>\s*&nbsp;\s*/g, '<li>');

            return newHtml;
        };

        const newContentEN = cleanListContent(contentEN);
        const newContentPU = cleanListContent(contentPU);

        if (newContentEN !== contentEN || newContentPU !== contentPU) {
            console.log(`🔧 Fixing Lists in Blog: ${blog.title}`);
            needsUpdate = true;

            const updateData = {
                title: blog.title,
                description: JSON.stringify({
                    EN: newContentEN,
                    PU: newContentPU
                }),
                metaTitle: blog.metaTitle,
                metaDescription: blog.metaDescription,
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
                console.log(`   ✅ Fixed`);
                fixedCount++;
            } catch (e) {
                console.log(`   ❌ Failed: ${e.message}`);
            }
            await new Promise(r => setTimeout(r, 400));
        }
    }

    console.log(`\n=== DONE ===`);
    console.log(`Fixed lists in ${fixedCount} blogs.`);
}

fixLists();
