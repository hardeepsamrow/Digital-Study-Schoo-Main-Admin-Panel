const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const API_BASE = "https://backend.digitalstudyschool.com/";
const AUTH_EMAIL = "hssamrow@gmail.com";
const AUTH_PASSWORD = "Rsoft@123";

function formatDate(date) {
    const formattedDate = new Date(date);

    const year = formattedDate.getFullYear();
    const month = formattedDate.toLocaleString("en-US", { month: "2-digit" });
    const day = formattedDate.toLocaleString("en-US", { day: "2-digit" });
    const time = formattedDate.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    const correctedDate = `${year}-${month}-${day} ${time}`;
    return correctedDate;
}

async function run() {
    console.log("🔐 Logging in...");
    let token = "";
    let categoryId = "";
    let tagId = "";

    // 1. Login
    try {
        const loginRes = await axios.post(`${API_BASE}api/admin/login`, {
            email: AUTH_EMAIL,
            password: AUTH_PASSWORD
        });
        token = loginRes.data.data.accessToken;
        console.log("✅ Login successful");
    } catch (e) {
        console.log("❌ Login failed:", e.message);
        return;
    }

    // 2. Get Category
    try {
        const catRes = await axios.get(`${API_BASE}api/category/getAll`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (catRes.data.data.length > 0) {
            categoryId = catRes.data.data[0]._id;
            console.log("✅ Got Category ID:", categoryId);
        } else {
            console.log("❌ No categories found");
            return;
        }
    } catch (e) {
        console.log("❌ Failed to get categories");
        return;
    }

    // 3. Test Scheduling with Current Format
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1); // Tomorrow
    const slot = formatDate(futureDate);

    console.log("\n🧪 Testing with format:", slot);

    const form = new FormData();
    form.append("title", JSON.stringify({ EN: "Test Blog " + Date.now(), PU: "" }));
    form.append("description", JSON.stringify({ EN: "<p>Test Content</p>", PU: "" }));
    form.append("category", categoryId);
    form.append("metaTitle", "Test Meta");
    form.append("metaDescription", "Test Desc");
    form.append("url", "test-blog-" + Date.now());
    form.append("status", "Pending");
    form.append("schedulingDate", slot);

    // Create a dummy image file
    fs.writeFileSync('test_thumb.webp', 'dummy webp content');
    form.append("image", fs.createReadStream('test_thumb.webp'), 'test_thumb.webp');

    // Add required array fields
    form.append('metaKeywords[0]', 'test');

    // We need a valid tag ID. We can try to fetch tags or just assume/skip if we can't. 
    // But since we need to pass validation, let's fetch tags.
    try {
        const tagRes = await axios.get(`${API_BASE}api/tag/getAll`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (tagRes.data.data.length > 0) {
            form.append('tag[0]', tagRes.data.data[0]._id);
            console.log("✅ Got Tag ID:", tagRes.data.data[0]._id);
        } else {
            console.log("⚠️ No tags found, sending empty tag (might fail)");
        }
    } catch (e) {
        console.log("⚠️ Failed to fetch tags");
    }

    try {
        const res = await axios.post(`${API_BASE}api/blogs/add`, form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${token}`
            }
        });
        console.log("✅ API Response Status:", res.status);
        console.log("✅ API Response Data:", res.data);
    } catch (e) {
        console.log("❌ API Request Failed:");
        console.log("   Status:", e.response ? e.response.status : "Unknown");
        console.log("   Data:", e.response ? e.response.data : e.message);
    }

    // Cleanup
    try { fs.unlinkSync('test_thumb.jpg'); } catch { }
}

run();
