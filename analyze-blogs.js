const fs = require('fs');

const blogs = JSON.parse(fs.readFileSync('blogs-data.json', 'utf8'));

console.log(`Total blogs: ${blogs.length}\n`);

// Show first blog in detail
console.log('=== FIRST BLOG SAMPLE ===');
const firstBlog = blogs[0];
console.log('ID:', firstBlog._id);
console.log('Title:', JSON.stringify(firstBlog.title));
console.log('Slug:', firstBlog.slug);
console.log('Featured Image:', firstBlog.featuredImage);
console.log('Content:', JSON.stringify(firstBlog.content).substring(0, 500));
console.log('Meta Description:', JSON.stringify(firstBlog.metaDescription));
console.log('Keywords:', JSON.stringify(firstBlog.keywords));
console.log('Status:', firstBlog.status);
console.log('\n');

// Count blogs by status
const statusCounts = {};
blogs.forEach(blog => {
    const status = blog.status || 'undefined';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
});

console.log('=== BLOGS BY STATUS ===');
Object.entries(statusCounts).forEach(([status, count]) => {
    console.log(`${status}: ${count}`);
});

// Find blogs with actual content
const blogsWithContent = blogs.filter(blog => {
    const content = blog.content?.en || blog.content?.EN || '';
    return content && content.trim().length > 100;
});

console.log(`\n=== BLOGS WITH CONTENT ===`);
console.log(`Blogs with content (>100 chars): ${blogsWithContent.length}`);

if (blogsWithContent.length > 0) {
    console.log('\nSample blog with content:');
    const sample = blogsWithContent[0];
    console.log('ID:', sample._id);
    console.log('Title:', sample.title);
    console.log('Slug:', sample.slug);
    console.log('Featured Image:', sample.featuredImage);
    console.log('Content length:', (sample.content?.en || sample.content?.EN || '').length);
}

// Check for empty/draft blogs
const emptyBlogs = blogs.filter(blog => {
    const content = blog.content?.en || blog.content?.EN || '';
    return !content || content.trim().length < 100;
});

console.log(`\nEmpty/Draft blogs: ${emptyBlogs.length}`);
