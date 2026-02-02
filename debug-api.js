const axios = require('axios');
require('dotenv').config();

const API_BASE = "https://backend.digitalstudyschool.com/";
const AUTH_EMAIL = process.env.ADMIN_EMAIL;
const AUTH_PASSWORD = process.env.ADMIN_PASSWORD;

async function debug() {
    console.log("Checking connectivity to " + API_BASE);
    try {
        await axios.get(API_BASE);
        console.log("Root endpoint is reachable.");
    } catch (e) {
        console.log("Root endpoint error: " + e.message);
    }

    console.log("Attempting login with " + AUTH_EMAIL);
    let token = "";
    try {
        const res = await axios.post(`${API_BASE}api/admin/login`, {
            email: AUTH_EMAIL,
            password: AUTH_PASSWORD
        });
        console.log("Login Status:", res.status);
        if (res.data && res.data.data) {
            token = res.data.data.accessToken;
            console.log("Token obtained.");
        } else {
            console.log("Login response format unexpected:", JSON.stringify(res.data));
            return;
        }
    } catch (e) {
        console.log("Login failed:");
        console.log(e.message);
        if (e.response) {
            console.log("Status:", e.response.status);
            console.log("Data:", JSON.stringify(e.response.data));
        }
        return;
    }

    console.log("Attempting to list blogs...");
    try {
        const res = await axios.get(`${API_BASE}api/blogs/admin-panel`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Blogs Status:", res.status);
        console.log("Blogs Data:", JSON.stringify(res.data).substring(0, 500));
    } catch (e) {
        console.log("Fetch blogs failed:");
        console.log(e.message);
        if (e.response) {
            console.log("Status:", e.response.status);
            console.log("Data:", JSON.stringify(e.response.data));
        }
    }
}

debug();
