const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const API_BASE = "https://backend.digitalstudyschool.com/";
const AUTH_EMAIL = process.env.ADMIN_EMAIL;
const AUTH_PASSWORD = process.env.ADMIN_PASSWORD;

async function fetchBlogs() {
    try {
        console.log("Logging in...");
        const loginRes = await axios.post(`${API_BASE}api/admin/login`, {
            email: AUTH_EMAIL,
            password: AUTH_PASSWORD
        });
        const token = loginRes.data.data.accessToken;
        console.log("Login successful.");

        console.log("Fetching blogs...");
        let blogsRes;
        try {
            blogsRes = await axios.get(`${API_BASE}api/blogs/getAll`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (e) {
            console.log("Failed to fetch from api/blogs/getAll, trying api/blog/getAll");
            blogsRes = await axios.get(`${API_BASE}api/blog/getAll`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        }

        const blogs = blogsRes.data.data || blogsRes.data; // Adjust based on actual structure
        console.log(`Found ${blogs.length} blogs.`);

        fs.writeFileSync('all-blogs-dump.json', JSON.stringify(blogs, null, 2));
        console.log("Saved all blogs to all-blogs-dump.json");

        // Print titles to console as well
        if (Array.isArray(blogs)) {
            blogs.forEach((b, i) => {
                const title = b.title ? (typeof b.title === 'string' ? JSON.parse(b.title).EN : b.title.EN) : "No Title";
                console.log(`${i + 1}. ${title}`);
            });
        }

    } catch (error) {
        console.error("Error fetching blogs:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        }
    }
}

fetchBlogs();
