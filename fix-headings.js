const axios = require('axios');
const fs = require('fs');

const API_BASE = "https://backend.digitalstudyschool.com/";
const AUTH_EMAIL = "hssamrow@gmail.com";
const AUTH_PASSWORD = "Rsoft@123";

async function fixHeadings() {
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

        // Parse Title and Description JSON
        let titleObj = {};
        let descObj = {};

        try {
            titleObj = typeof blog.title === 'string' ? JSON.parse(blog.title) : blog.title;
            descObj = typeof blog.description === 'string' ? JSON.parse(blog.description) : blog.description;
        } catch (e) {
            console.log(`⚠️  Skipping Blog ${blog._id}: JSON parse error`);
            continue;
        }

        let contentEN = descObj.EN || descObj.en || '';
        let contentPU = descObj.PU || descObj.pu || '';

        // Check for H1 tags in content
        if (contentEN.includes('<h1') || contentPU.includes('<h1')) {
            console.log(`🔧 Fixing Blog: ${titleObj.EN || blog.slug}`);

            // Replace H1 with H2 (Global replacement)
            const newContentEN = contentEN.replace(/<h1/gi, '<h2').replace(/<\/h1>/gi, '</h2>');
            const newContentPU = contentPU.replace(/<h1/gi, '<h2').replace(/<\/h1>/gi, '</h2>');

            // Prepare update payload
            const updateData = {
                title: JSON.stringify(titleObj),
                description: JSON.stringify({
                    EN: newContentEN,
                    PU: newContentPU
                }),
                metaTitle: blog.metaTitle,
                metaDescription: blog.metaDescription,
                url: blog.url || blog.slug,
                status: blog.status,
                category: blog.category ? blog.category._id : undefined, // Preserve category if exists
                metaKeywords: blog.metaKeywords,
                tag: blog.tag // Preserve tags
            };

            // Fix for image field if needed (preserve existing)
            // The API might expect 'image' as a file or URL? 
            // Based on previous fixes, we might not need to send image if not updating it, 
            // BUT standard PUT usually replaces the object. 
            // Let's safe-guard: Usually backend handles partial updates or we must re-send everything.
            // fix-blogs.js re-sent everything.

            // Note: If the backend requires the image file again for updates without image change, that's tricky.
            // But looking at 'edit-blog-content.js', it sends 'image' only if file is selected.
            // If dataService.updateBlog sends FormData, but here we send JSON?
            // fix-blogs.js sent JSON. So it should be fine to not send 'image' field if not changing it, 
            // OR we might need to send the 'image' property as is?
            // Let's try sending just the text fields first.

            try {
                await axios.put(`${API_BASE}api/blogs/update/${blog._id}`, updateData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(`   ✅ Fixed H1 -> H2`);
                fixedCount++;
            } catch (e) {
                console.log(`   ❌ Failed to update: ${e.message}`);
            }

            // Small delay
            await new Promise(r => setTimeout(r, 500));
        }
    }

    console.log(`\n=== DONE ===`);
    console.log(`Fixed ${fixedCount} blogs.`);
}

fixHeadings();
