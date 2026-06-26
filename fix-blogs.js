const axios = require('axios');
const fs = require('fs');

const API_BASE = "https://blueviolet-meerkat-733057.hostingersite.com/";
const AUTH_EMAIL = "hssamrow@gmail.com";
const AUTH_PASSWORD = "Rsoft@123";

async function fixBlogs() {
    console.log("🔐 Logging in...");
    let token = "";

    try {
        const loginRes = await axios.post(`${API_BASE}api/admin/login`, {
            email: AUTH_EMAIL,
            password: AUTH_PASSWORD
        });

        if (loginRes.data && loginRes.data.data && loginRes.data.data.accessToken) {
            token = loginRes.data.data.accessToken;
            console.log("✅ Login successful!\n");
        } else {
            console.log("❌ Login failed");
            return;
        }
    } catch (e) {
        console.log("❌ Login error:", e.message);
        return;
    }

    // Read the blogs data
    const blogs = JSON.parse(fs.readFileSync('blogs-data.json', 'utf8'));
    console.log(`📚 Found ${blogs.length} blogs to process\n`);

    let fixed = 0;
    let skipped = 0;
    let errors = 0;

    for (let i = 0; i < blogs.length; i++) {
        const blog = blogs[i];

        try {
            // Parse title and description
            let titleObj = {};
            let descObj = {};

            try {
                titleObj = typeof blog.title === 'string' ? JSON.parse(blog.title) : blog.title;
                descObj = typeof blog.description === 'string' ? JSON.parse(blog.description) : blog.description;
            } catch (e) {
                console.log(`⚠️  Blog ${blog._id}: Could not parse title/description`);
            }

            const title = titleObj.EN || titleObj.en || '';
            const description = descObj.EN || descObj.en || '';

            // Check if blog needs fixing
            const needsFix = !title || !description || !blog.image || !blog.image.url || blog.image.url.includes('undefined');

            if (!needsFix) {
                skipped++;
                console.log(`✓ Blog ${i + 1}/${blogs.length}: "${title.substring(0, 50)}..." - OK`);
                continue;
            }

            console.log(`\n🔧 Fixing Blog ${i + 1}/${blogs.length}: ${blog._id}`);
            console.log(`   Title: ${title || 'MISSING'}`);

            // Prepare update data
            const updateData = {
                title: JSON.stringify({ EN: title || 'Untitled Blog', PU: '' }),
                description: JSON.stringify({ EN: description || 'Content coming soon...', PU: '' }),
                metaTitle: blog.metaTitle || title || 'Untitled',
                metaDescription: blog.metaDescription || description.substring(0, 160) || 'Read more...',
                status: blog.status || 'Draft',
                metaKeywords: blog.metaKeywords || []
            };

            // Fix image if broken
            if (!blog.image || !blog.image.url || blog.image.url.includes('undefined')) {
                updateData.featuredImage = '/uploads/default-blog-image.webp';
            }

            // Update the blog
            const updateRes = await axios.put(
                `${API_BASE}api/blogs/update/${blog._id}`,
                updateData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (updateRes.status === 200) {
                fixed++;
                console.log(`   ✅ Fixed successfully`);
            }

            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (e) {
            errors++;
            console.log(`   ❌ Error: ${e.message}`);
        }
    }

    console.log(`\n\n=== SUMMARY ===`);
    console.log(`✅ Fixed: ${fixed}`);
    console.log(`⏭️  Skipped (OK): ${skipped}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📊 Total: ${blogs.length}`);
}

fixBlogs();
