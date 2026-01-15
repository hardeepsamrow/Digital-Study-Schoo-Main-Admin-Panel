const axios = require('axios');
const fs = require('fs');

const API_BASE = "https://backend.digitalstudyschool.com"; // Images usually served from backend or frontend public folder?
// In the json, url is `/uploads/...`. 
// Often these are served via `https://backend.digitalstudyschool.com/uploads/...` or `https://digitalstudyschool.com/uploads/...`
// Let's try backend first as it is the source.

const blogs = JSON.parse(fs.readFileSync('final_fixed_blogs.json', 'utf8'));

async function checkImages() {
    const brokenImages = [];

    for (const blog of blogs) {
        // Check Featured Image
        if (blog.image && blog.image.url) {
            const url = blog.image.url.startsWith('http') ? blog.image.url : `${API_BASE}${blog.image.url}`;
            try {
                await axios.head(url);
                // console.log(`[OK] ${url}`);
            } catch (error) {
                console.error(`[BROKEN] Featured: ${blog.title} -> ${url}`);
                brokenImages.push({
                    type: 'featured',
                    blogId: blog._id,
                    title: JSON.parse(blog.title).EN, // Assuming JSON
                    url: url,
                    path: blog.image.url
                });
            }
        } else {
            console.error(`[MISSING] Featured: ${blog.title}`);
            brokenImages.push({
                type: 'featured',
                blogId: blog._id,
                title: blog.title, // Might be string if parse failed
                url: null
            });
        }

        // Check Inner Images (Regex)
        let desc = "";
        try { desc = JSON.parse(blog.description).EN; } catch (e) { desc = blog.description; }

        // Regex for <img src="...">
        const imgRegex = /<img[^>]+src="([^">]+)"/g;
        let match;
        while ((match = imgRegex.exec(desc)) !== null) {
            let src = match[1];
            // Fix relative paths or double slashes
            if (src.startsWith('/')) src = `${API_BASE}${src}`;

            // Skip data URIs or external valid links if we want (optional)
            if (!src.startsWith('http')) continue;

            try {
                await axios.head(src);
            } catch (error) {
                console.error(`[BROKEN] Inner: ${blog.title} -> ${src}`);
                brokenImages.push({
                    type: 'inner',
                    blogId: blog._id,
                    title: blog.title,
                    url: src
                });
            }
        }
    }

    fs.writeFileSync('broken_images.json', JSON.stringify(brokenImages, null, 2));
    console.log(`Found ${brokenImages.length} broken images.`);
}

checkImages();
