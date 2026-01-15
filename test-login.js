const axios = require('axios');

const API_BASE = "https://backend.digitalstudyschool.com/";

async function testLogin() {
    console.log("\n=== Testing Admin Login ===\n");

    // Test 1: Try with email field
    console.log("Test 1: Using 'email' field with 'hssamrow'");
    try {
        const res = await axios.post(`${API_BASE}api/admin/login`, {
            email: 'hssamrow',
            password: 'Rsoft@123'
        });
        console.log("✅ SUCCESS with email='hssamrow'");
        console.log("Response:", JSON.stringify(res.data, null, 2));
        return;
    } catch (e) {
        console.log("❌ FAILED");
        if (e.response) {
            console.log("Status:", e.response.status);
            console.log("Message:", e.response.data?.message || e.response.data);
        }
    }

    // Test 2: Try with email as actual email format
    console.log("\nTest 2: Using 'email' field with 'hssamrow@digitalstudyschool.com'");
    try {
        const res = await axios.post(`${API_BASE}api/admin/login`, {
            email: 'hssamrow@digitalstudyschool.com',
            password: 'Rsoft@123'
        });
        console.log("✅ SUCCESS with email='hssamrow@digitalstudyschool.com'");
        console.log("Response:", JSON.stringify(res.data, null, 2));
        return;
    } catch (e) {
        console.log("❌ FAILED");
        if (e.response) {
            console.log("Status:", e.response.status);
            console.log("Message:", e.response.data?.message || e.response.data);
        }
    }

    // Test 3: Try with admin@
    console.log("\nTest 3: Using 'email' field with 'admin@digitalstudyschool.com'");
    try {
        const res = await axios.post(`${API_BASE}api/admin/login`, {
            email: 'admin@digitalstudyschool.com',
            password: 'Rsoft@123'
        });
        console.log("✅ SUCCESS with email='admin@digitalstudyschool.com'");
        console.log("Response:", JSON.stringify(res.data, null, 2));
        return;
    } catch (e) {
        console.log("❌ FAILED");
        if (e.response) {
            console.log("Status:", e.response.status);
            console.log("Message:", e.response.data?.message || e.response.data);
        }
    }

    console.log("\n=== All tests failed ===");
    console.log("\nPlease provide the correct admin email address.");
    console.log("The backend expects 'email' field, not 'username'.");
}

testLogin();
