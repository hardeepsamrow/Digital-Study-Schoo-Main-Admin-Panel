const fs = require('fs');

const blogs = JSON.parse(fs.readFileSync('blogs-data.json', 'utf8'));

console.log(`Scanning ${blogs.length} blogs for list formatting...\n`);

let matchesFound = 0;

blogs.forEach((blog, i) => {
    let content = '';
    try {
        const desc = typeof blog.description === 'string' ? JSON.parse(blog.description) : blog.description;
        content = desc.EN || desc.en || '';
    } catch (e) { content = ''; }

    // Look for lists
    if (content.includes('<ul>') || content.includes('<ol>')) {
        // Extract a snippet containing a list
        const listRegex = /<(ul|ol)>[\s\S]*?<\/\1>/gi;
        const matches = content.match(listRegex);

        if (matches && matches.length > 0) {
            console.log(`Blog ${i + 1}: ${blog.title}`);
            console.log(`- Found ${matches.length} lists.`);
            console.log(`- Sample List HTML:`);
            console.log(matches[0].substring(0, 300)); // Print first 300 chars of list
            console.log('-----------------------------------');
            matchesFound++;

            if (matchesFound >= 5) {
                // Stop after 5 samples
                process.exit(0);
            }
        }
    }
});

if (matchesFound === 0) console.log("No lists found in sampled blogs.");
