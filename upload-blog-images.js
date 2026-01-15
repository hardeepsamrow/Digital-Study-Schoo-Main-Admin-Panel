const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE = "https://backend.digitalstudyschool.com/";
const USERNAME = "hssamrow";
const PASSWORD = "Rsoft@123";

const imageMapping = {
    "668e6ea5170a4cab84286bdb": "web_development_courses_chandigarh_1768485366239.png",
    "668f7e05bda4db88a925435d": "business_digital_marketing_tactics_1768485385966.png",
    "6703d81905a854bc7209925d": "transformative_power_digital_marketing_1768485403284.png",
    "6703dd1d05a854bc720992bb": "career_opportunities_digital_marketing_1768485422541.png",
    "6703dfd005a854bc720992ea": "digital_marketing_strategy_guide_1768485496069.png",
    "6706362085e469523aafe413": "web_dev_course_guide_chandigarh_1768485529681.png",
    "6711067d7f89503a53ccd6f1": "animated_video_earning_1768485547278.png",
    "67110cc27f89503a53ccd7b4": "social_media_marketing_skills_1768485566258.png",
    "671260c4c4caf5849a6f0e17": "affiliate_marketing_guide_1768485582747.png",
    "6713a832c4caf5849a6f14e3": "email_marketing_comprehensive_1768485601628.png",
    "6713b44ec4caf5849a6f1f6a": "seo_digital_era_1768485656771.png",
    "67d2e32002368d0afaaa3640": "top_digital_marketing_courses_1768485673637.png",
    "682f8042bb011995124c1c0e": "digital_marketing_skills_2025_1768485692562.png",
    "6842d1cfbb011995124d268d": "career_digital_marketing_2025_1768485711846.png",
    "6843290fbb011995124d2baf": "ai_creativity_marketing_1768485729515.png"
};

const IMAGE_DIR = "C:/Users/DELL/.gemini/antigravity/brain/b21d83c5-bfd0-4681-a56e-a2987947e5ce";

async function login() {
    try {
        const response = await axios.post(`${API_BASE}api/admin/login`, {
            email: USERNAME,
            password: PASSWORD
        });
        if (response.data && response.data.data && response.data.data.accessToken) {
            console.log("✓ Login successful!");
            return response.data.data.accessToken;
        }
    } catch (error) {
        console.error("Login failed:", error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

async function updateBlogWithImage(token, blogId, imagePath) {
    const blogs = JSON.parse(fs.readFileSync('final_fixed_blogs.json', 'utf8'));
    const blog = blogs.find(b => b._id === blogId);

    if (!blog) {
        console.error(`Blog ${blogId} not found`);
        return false;
    }

    const form = new FormData();

    // Add image file
    form.append('image', fs.createReadStream(imagePath));

    // Add all other blog fields
    form.append('title', blog.title);
    form.append('description', blog.description);
    form.append('metaTitle', blog.metaTitle);
    form.append('metaDescription', blog.metaDescription);
    form.append('url', blog.url);
    form.append('status', blog.status);

    if (blog.category) {
        form.append('category', blog.category);
    }

    if (blog.tag && Array.isArray(blog.tag)) {
        blog.tag.forEach((t, i) => {
            form.append(`tag[${i}]`, t);
        });
    }

    if (blog.metaKeywords && Array.isArray(blog.metaKeywords)) {
        blog.metaKeywords.forEach((kw, i) => {
            form.append(`metaKeywords[${i}]`, kw);
        });
    }

    try {
        await axios.put(`${API_BASE}api/blogs/update/${blogId}`, form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${token}`
            }
        });
        return true;
    } catch (error) {
        console.error(`Failed to update blog ${blogId}:`, error.response ? error.response.data : error.message);
        return false;
    }
}

async function run() {
    const token = await login();

    console.log("\n=== Uploading images to blogs ===\n");

    let successCount = 0;
    let failCount = 0;

    for (const [blogId, imageFile] of Object.entries(imageMapping)) {
        const imagePath = path.join(IMAGE_DIR, imageFile);

        if (!fs.existsSync(imagePath)) {
            console.error(`✗ Image file not found: ${imageFile}`);
            failCount++;
            continue;
        }

        console.log(`Updating blog ${blogId}...`);

        const success = await updateBlogWithImage(token, blogId, imagePath);
        if (success) {
            console.log(`  ✓ Successfully updated with new image`);
            successCount++;
        } else {
            console.log(`  ✗ Failed to update`);
            failCount++;
        }

        await new Promise(r => setTimeout(r, 300));
    }

    console.log(`\n=== Complete ===`);
    console.log(`Success: ${successCount}`);
    console.log(`Failed: ${failCount}`);
}

run();
