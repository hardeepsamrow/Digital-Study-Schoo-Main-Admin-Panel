const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const API_BASE = "https://backend.digitalstudyschool.com/";
const AUTH_EMAIL = process.env.ADMIN_EMAIL;
const AUTH_PASSWORD = process.env.ADMIN_PASSWORD;

async function listCategories() {
    try {
        const response = await axios.post(`${API_BASE}api/admin/login`, {
            email: AUTH_EMAIL,
            password: AUTH_PASSWORD
        });
        const token = response.data.data.accessToken;

        const res = await axios.get(`${API_BASE}api/category/getAll`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Available Categories:");
        res.data.data.forEach(c => console.log(`- ${c.name} (ID: ${c._id})`));

        const resTags = await axios.get(`${API_BASE}api/tag/getAll`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("\nAvailable Tags:");
        resTags.data.data.forEach(t => console.log(`- ${t.name} (ID: ${t._id})`));

    } catch (error) {
        console.error(error);
    }
}

listCategories();
