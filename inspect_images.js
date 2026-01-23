const fs = require('fs');

const blogs = JSON.parse(fs.readFileSync('blogs-data.json', 'utf8'));

console.log(`Total blogs: ${blogs.length}`);
console.log("Inspecting keys for the first blog:\n");

if (blogs.length > 0) {
    const blog = blogs[0];
    console.log(`ID: ${blog._id}`);
    console.log(`Keys:`, Object.keys(blog));
    console.log(`'image' field value:`, JSON.stringify(blog.image, null, 2));
    console.log(`'featuredImage' field value:`, blog.featuredImage);
} else {
    console.log("No blogs found.");
}
