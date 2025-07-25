import fs from 'fs';
import path from 'path';

// Load mock data from seed files
let mockBlogs = [];
let mockCategories = [];
let mockPosts = [];

try {
    const blogsRaw = JSON.parse(fs.readFileSync(path.join('data', 'test.blogs.json')));
    const categoriesRaw = JSON.parse(fs.readFileSync(path.join('data', 'test.categories.json')));
    const postsRaw = JSON.parse(fs.readFileSync(path.join('data', 'test.posts.json')));
    
    // Clean MongoDB document format
    function cleanMongoDocument(obj) {
        if (Array.isArray(obj)) {
            return obj.map(cleanMongoDocument);
        } else if (obj && typeof obj === 'object') {
            const newObj = {};
            for (const key in obj) {
                if (key === '$oid') return obj['$oid'];
                if (key === '$date') return new Date(obj['$date']);
                newObj[key] = cleanMongoDocument(obj[key]);
            }
            return newObj;
        }
        return obj;
    }
    
    mockBlogs = cleanMongoDocument(blogsRaw);
    mockCategories = cleanMongoDocument(categoriesRaw);
    mockPosts = cleanMongoDocument(postsRaw);
    
    console.log('📄 Mock data loaded successfully');
} catch (error) {
    console.error('⚠️  Error loading mock data:', error.message);
}

export { mockBlogs, mockCategories, mockPosts };