const fs = require('fs');

const blogs = JSON.parse(fs.readFileSync('blogs-data.json', 'utf8'));

console.log(`Checking ${blogs.length} blogs for duplicates...\n`);

const titles = {};
const descs = {};
let dupesFound = 0;

blogs.forEach(blog => {
    let title = '';
    try {
        const t = typeof blog.title === 'string' ? JSON.parse(blog.title) : blog.title;
        title = t.EN || t.en || '';
    } catch (e) { title = blog.title || ''; }

    const metaDesc = blog.metaDescription || '';

    // Check Title
    if (title) {
        if (titles[title]) {
            console.log(`⚠️  Duplicate Title: "${title}"`);
            console.log(`   - ID: ${titles[title]}`);
            console.log(`   - ID: ${blog._id}`);
            dupesFound++;
        } else {
            titles[title] = blog._id;
        }
    }

    // Check Meta Description (ignore if very short/empty)
    if (metaDesc && metaDesc.length > 20) {
        if (descs[metaDesc]) {
            console.log(`⚠️  Duplicate Meta Desc: "${metaDesc.substring(0, 50)}..."`);
            console.log(`   - ID: ${descs[metaDesc]}`);
            console.log(`   - ID: ${blog._id}`);
            dupesFound++;
        } else {
            descs[metaDesc] = blog._id;
        }
    }
});

if (dupesFound === 0) {
    console.log("✅ No duplicates found.");
} else {
    console.log(`\n❌ Found ${dupesFound} duplicates.`);
}
