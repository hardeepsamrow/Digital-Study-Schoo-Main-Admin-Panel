const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuration
const API_BASE = "https://backend.digitalstudyschool.com/";
const AUTH_EMAIL = process.env.ADMIN_EMAIL;
const AUTH_PASSWORD = process.env.ADMIN_PASSWORD;

if (!AUTH_EMAIL || !AUTH_PASSWORD) {
    console.error("Error: Please set ADMIN_EMAIL and ADMIN_PASSWORD in a .env file.");
    process.exit(1);
}

// Helper to read JSON
function readJSON(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

async function login() {
    try {
        console.log(`Logging in as ${AUTH_EMAIL}...`);
        const response = await axios.post(`${API_BASE}api/admin/login`, {
            email: AUTH_EMAIL,
            password: AUTH_PASSWORD
        });
        const token = response.data.data.accessToken;
        console.log("Login successful!");
        return token;
    } catch (error) {
        console.error("Login failed:", error.message);
        if (error.response) console.error(error.response.data);
        process.exit(1);
    }
}

async function getCategories(token) {
    const res = await axios.get(`${API_BASE}api/category/getAll`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.data;
}

async function getTags(token) {
    const res = await axios.get(`${API_BASE}api/tag/getAll`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.data;
}

async function publishBlog() {
    const content = readJSON('blog-content.json');
    const token = await login();

    // 1. Resolve Category ID
    // 1. Resolve Category ID
    const categories = await getCategories(token);
    let category = categories.find(c => c.name.toLowerCase() === content.category_name.toLowerCase());

    if (!category) {
        console.warn(`Warning: Category '${content.category_name}' not found.`);
        // Fuzzy match
        category = categories.find(c => c.name.toLowerCase().includes("digital"));
        if (category) {
            console.log(`Fallback: Using category '${category.name}' instead.`);
        } else {
            // Default to first
            if (categories.length > 0) {
                category = categories[0];
                console.log(`Fallback: Using first available category '${category.name}'.`);
            } else {
                console.error("Error: No categories found in backend.");
                process.exit(1);
            }
        }
    }
    console.log(`Resolved Category '${category.name}' to ID: ${category._id}`);

    // 2. Resolve Tag IDs
    const allTags = await getTags(token);
    const tagIds = [];
    for (const tagName of content.tags) {
        const tag = allTags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
        if (tag) {
            tagIds.push(tag._id);
        } else {
            console.warn(`Warning: Tag '${tagName}' not found. Skipping.`);
        }
    }

    // 3. Handle Inner Images
    if (content.inner_images && content.inner_images.length > 0) {
        console.log("Uploading inner images...");
        for (let i = 0; i < content.inner_images.length; i++) {
            const imgPath = content.inner_images[i];
            if (fs.existsSync(imgPath)) {
                try {
                    const innerForm = new FormData();
                    innerForm.append('image', fs.createReadStream(imgPath));
                    // The endpoint seems to be this based on frontend code
                    const res = await axios.post(`${API_BASE}api/EnNews/images`, innerForm, {
                        headers: {
                            ...innerForm.getHeaders(),
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const imgUrl = res.data.location || res.data.url; // Adjust based on actual response
                    console.log(`Inner image ${i + 1} uploaded: ${imgUrl}`);

                    // Replace placeholder {{INNER_IMAGE_i}} in description
                    const placeholder = `{{INNER_IMAGE_${i + 1}}}`;
                    if (content.description_en.includes(placeholder)) {
                        content.description_en = content.description_en.replace(placeholder, imgUrl);
                    }
                } catch (err) {
                    console.error(`Failed to upload inner image ${imgPath}:`, err.message);
                }
            } else {
                console.warn(`Inner image path not found: ${imgPath}`);
            }
        }
    }

    // 4. Prepare Form Data
    const form = new FormData();

    // Image
    if (content.image_path && fs.existsSync(content.image_path)) {
        form.append('image', fs.createReadStream(content.image_path));
    } else {
        console.warn("Warning: Image path not found or invalid.");
    }

    // JSON fields need typically stringifying if the backend expects it, 
    // but based on code, they are sent as strings.
    // Backend expects 'title' as stringified JSON: '{"EN":"...","PU":"..."}'
    form.append('title', JSON.stringify({
        EN: content.title_en,
        PU: content.title_pu || ""
    }));

    form.append('description', JSON.stringify({
        EN: content.description_en,
        PU: content.description_pu || ""
    }));

    // Keywords
    content.keywords.forEach((kw, i) => {
        form.append(`metaKeywords[${i}]`, kw);
    });

    // Tags
    tagIds.forEach((id, i) => {
        form.append(`tag[${i}]`, id);
    });

    form.append('category', category._id);
    form.append('metaTitle', content.meta_title);
    form.append('metaDescription', content.meta_desc);
    form.append('url', content.url_slug);
    form.append('status', 'Published');

    // 5. Send Request
    try {
        console.log("Uploading blog post...");
        const response = await axios.post(`${API_BASE}api/blogs/add`, form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${token}`
            }
        });
        console.log("Success! Blog published.");
        console.log("Response:", response.data);
    } catch (error) {
        console.error("Upload failed:", error.message);
        if (error.response) console.error(error.response.data);
    }
}

publishBlog();
