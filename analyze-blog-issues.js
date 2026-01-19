const fs = require('fs');

const blogs = JSON.parse(fs.readFileSync('blogs-data.json', 'utf8'));

console.log(`Total blogs: ${blogs.length}\n`);
console.log('=== CHECKING FOR ISSUES ===\n');

let brokenImages = [];
let missingContent = [];
let goodBlogs = [];

blogs.forEach((blog, index) => {
    const hasIssues = [];

    // Check image
    const imageUrl = blog.image?.url || '';
    if (!imageUrl || imageUrl.includes('undefined') || imageUrl.includes('null')) {
        hasIssues.push('Broken/missing image');
        brokenImages.push(blog);
    }

    // Check title
    let title = '';
    try {
        const titleObj = typeof blog.title === 'string' ? JSON.parse(blog.title) : blog.title;
        title = titleObj.EN || titleObj.en || '';
    } catch (e) {
        hasIssues.push('Invalid title format');
    }

    if (!title || title.trim() === '') {
        hasIssues.push('Missing title');
    }

    // Check description/content
    let description = '';
    try {
        const descObj = typeof blog.description === 'string' ? JSON.parse(blog.description) : blog.description;
        description = descObj.EN || descObj.en || '';
    } catch (e) {
        hasIssues.push('Invalid description format');
    }

    if (!description || description.trim().length < 50) {
        hasIssues.push('Missing/short content');
        missingContent.push(blog);
    }

    if (hasIssues.length > 0) {
        console.log(`Blog ${index + 1}: ${blog._id}`);
        console.log(`  Title: ${title.substring(0, 60)}...`);
        console.log(`  Issues: ${hasIssues.join(', ')}`);
        console.log(`  Image: ${imageUrl}`);
        console.log('');
    } else {
        goodBlogs.push(blog);
    }
});

console.log('\n=== SUMMARY ===');
console.log(`✅ Good blogs: ${goodBlogs.length}`);
console.log(`🖼️  Blogs with broken images: ${brokenImages.length}`);
console.log(`📝 Blogs with missing/short content: ${missingContent.length}`);
console.log(`📊 Total: ${blogs.length}`);

// Save problematic blogs for review
if (brokenImages.length > 0) {
    fs.writeFileSync('broken-images-blogs.json', JSON.stringify(brokenImages, null, 2));
    console.log('\n💾 Saved blogs with broken images to: broken-images-blogs.json');
}

if (missingContent.length > 0) {
    fs.writeFileSync('missing-content-blogs.json', JSON.stringify(missingContent, null, 2));
    console.log('💾 Saved blogs with missing content to: missing-content-blogs.json');
}
