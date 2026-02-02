const axios = require('axios');
const fs = require('fs');

const API_BASE = "https://backend.digitalstudyschool.com/";
const AUTH_EMAIL = "hssamrow@gmail.com"; // Update if different
const AUTH_PASSWORD = "Rsoft@123";

async function fetchAllBlogs() {
    console.log("🔐 Logging in...");
    let token = "";

    try {
        const loginRes = await axios.post(`${API_BASE}api/admin/login`, {
            email: AUTH_EMAIL,
            password: AUTH_PASSWORD
        });

        if (loginRes.data && loginRes.data.data && loginRes.data.data.accessToken) {
            token = loginRes.data.data.accessToken;
            console.log("✅ Login successful!");
        } else {
            console.log("❌ Login failed - unexpected response format");
            return;
        }
    } catch (e) {
        console.log("❌ Login failed:", e.message);
        if (e.response) {
            console.log("Status:", e.response.status);
            console.log("Data:", JSON.stringify(e.response.data));
        }
        return;
    }

    console.log("\n📚 Fetching all blogs...");
    try {
        const blogsRes = await axios.get(`${API_BASE}api/blogs/admin-panel`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (blogsRes.data && blogsRes.data.data) {
            const blogs = blogsRes.data.data;
            console.log(`✅ Found ${blogs.length} blogs\n`);

            // Analyze each blog for issues
            const issues = [];

            blogs.forEach((blog, index) => {
                const blogIssues = {
                    id: blog._id,
                    title: blog.title?.en || 'No title',
                    slug: blog.slug,
                    problems: []
                };

                // Check for broken images in featured image
                if (!blog.featuredImage || blog.featuredImage === '' || blog.featuredImage === 'undefined') {
                    blogIssues.problems.push('Missing or broken featured image');
                }

                // Check content structure
                const content = blog.content?.en || '';
                if (!content || content.trim() === '') {
                    blogIssues.problems.push('Empty content');
                }

                // Check for broken image URLs in content
                if (content.includes('undefined') || content.includes('null')) {
                    blogIssues.problems.push('Content contains undefined/null values');
                }

                // Check for missing meta description
                if (!blog.metaDescription?.en || blog.metaDescription.en.trim() === '') {
                    blogIssues.problems.push('Missing meta description');
                }

                // Check for missing keywords/topics
                if (!blog.keywords || blog.keywords.length === 0) {
                    blogIssues.problems.push('Missing keywords/topics');
                }

                if (blogIssues.problems.length > 0) {
                    issues.push(blogIssues);
                }
            });

            // Save full blog data to file
            fs.writeFileSync('blogs-data.json', JSON.stringify(blogs, null, 2));
            console.log('✅ Full blog data saved to blogs-data.json\n');

            // Save issues report
            fs.writeFileSync('blogs-issues.json', JSON.stringify(issues, null, 2));
            console.log(`📋 Found ${issues.length} blogs with issues\n`);

            // Print summary
            console.log('=== ISSUES SUMMARY ===\n');
            issues.forEach((blog, idx) => {
                console.log(`${idx + 1}. ${blog.title}`);
                console.log(`   ID: ${blog.id}`);
                console.log(`   Slug: ${blog.slug}`);
                console.log(`   Problems:`);
                blog.problems.forEach(p => console.log(`   - ${p}`));
                console.log('');
            });

        } else {
            console.log("❌ Unexpected response format");
        }
    } catch (e) {
        console.log("❌ Failed to fetch blogs:", e.message);
        if (e.response) {
            console.log("Status:", e.response.status);
            console.log("Data:", JSON.stringify(e.response.data));
        }
    }
}

fetchAllBlogs();
