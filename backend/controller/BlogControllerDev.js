import { Blogs } from "../schema/BlogSchema.js";
import { mockBlogs } from "../lib/mockData.js";
import { isDbConnected } from "../server.js";

// Helper function to generate mock ID
function generateMockId() {
    return Math.random().toString(36).substr(2, 9);
}

// CRUD Operations for Blog 
// 1) Create
export const createBlog = async (req, res) => {
    try {
        if (isDbConnected) {
            // Original database logic
            const blogExists = await Blogs.findOne({ title: req.body.title });
            if (blogExists) {
                return res.status(409).json({
                    message: "Blog title already exists, please choose another one",
                });
            }

            const newBlog = await new Blogs({
                ...req.body,
                image: req.files?.image?.[0]?.path || '/uploads/default.jpg',
                profile: req.files?.profile?.[0]?.path || '/uploads/default-profile.jpg'
            }).save();
            
            return res.status(201).json({
                message: "Blog created successfully",
                data: newBlog,
            });
        } else {
            // Mock data logic
            const blogExists = mockBlogs.find(blog => blog.title === req.body.title);
            if (blogExists) {
                return res.status(409).json({
                    message: "Blog title already exists, please choose another one",
                });
            }

            const newBlog = {
                _id: generateMockId(),
                ...req.body,
                image: req.files?.image?.[0]?.path || '/uploads/default.jpg',
                profile: req.files?.profile?.[0]?.path || '/uploads/default-profile.jpg',
                date: new Date(),
            };
            
            mockBlogs.push(newBlog);
            
            return res.status(201).json({
                message: "Blog created successfully (mock mode)",
                data: newBlog,
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// 2) Read all blogs
export const getAllBlogs = async (req, res) => {
    try {
        if (isDbConnected) {
            const allBlogs = await Blogs.find();
            if (allBlogs.length === 0) {
                return res.status(404).json({
                    message: "No blogs found",
                });
            }
            return res.status(200).json({
                message: "Blogs fetched successfully",
                data: allBlogs,
            });
        } else {
            // Use mock data
            if (mockBlogs.length === 0) {
                return res.status(404).json({
                    message: "No blogs found",
                });
            }
            return res.status(200).json({
                message: "Blogs fetched successfully (mock mode)",
                data: mockBlogs,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// 3) Read by id
export const getBlogById = async (req, res) => {
    try {
        if (isDbConnected) {
            const singleBlog = await Blogs.findById(req.params.id);
            if (!singleBlog) {
                return res.status(404).json({
                    message: "Blog not found",
                });
            }
            return res.status(200).json({
                message: "Blog fetched successfully",
                data: singleBlog,
            });
        } else {
            // Use mock data
            const singleBlog = mockBlogs.find(blog => blog._id === req.params.id);
            if (!singleBlog) {
                return res.status(404).json({
                    message: "Blog not found",
                });
            }
            return res.status(200).json({
                message: "Blog fetched successfully (mock mode)",
                data: singleBlog,
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// 4) Update by id
export const updateBlogById = async (req, res) => {
    try {
        if (isDbConnected) {
            const updatedBlog = await Blogs.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });
            if (!updatedBlog) {
                return res.status(404).json({
                    message: "Blog not found",
                });
            }
            return res.status(200).json({
                message: "Blog updated successfully",
                data: updatedBlog,
            });
        } else {
            // Use mock data
            const blogIndex = mockBlogs.findIndex(blog => blog._id === req.params.id);
            if (blogIndex === -1) {
                return res.status(404).json({
                    message: "Blog not found",
                });
            }
            
            mockBlogs[blogIndex] = { ...mockBlogs[blogIndex], ...req.body };
            
            return res.status(200).json({
                message: "Blog updated successfully (mock mode)",
                data: mockBlogs[blogIndex],
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error."
        });
    }
};

// 5) Delete by id
export const deleteBlogById = async (req, res) => {
    try {
        if (isDbConnected) {
            const deletedBlog = await Blogs.findByIdAndDelete(req.params.id);
            if (!deletedBlog) {
                return res.status(404).json({
                    message: "Blog not found",
                });
            }
            return res.status(200).json({
                message: "Blog deleted successfully",
                data: deletedBlog,
            });
        } else {
            // Use mock data
            const blogIndex = mockBlogs.findIndex(blog => blog._id === req.params.id);
            if (blogIndex === -1) {
                return res.status(404).json({
                    message: "Blog not found",
                });
            }
            
            const deletedBlog = mockBlogs.splice(blogIndex, 1)[0];
            
            return res.status(200).json({
                message: "Blog deleted successfully (mock mode)",
                data: deletedBlog,
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error."
        });
    }
};

// 6) Search blogs
export const searchBlogs = async (req, res) => {
    try {
        const { query, username, sort } = req.query;

        if (isDbConnected) {
            // Original database logic
            let searchQuery = {};

            if (query) {
                searchQuery = {
                    $or: [
                        { title: { $regex: query, $options: 'i' } },
                        { description: { $regex: query, $options: 'i' } }
                    ]
                };
            }

            if (username) {
                searchQuery.username = { $regex: username, $options: 'i' };
            }

            let sortOptions = {};
            if (sort === 'newest') {
                sortOptions = { date: -1 };
            } else if (sort === 'oldest') {
                sortOptions = { date: 1 };
            } else if (sort === 'title_asc') {
                sortOptions = { title: 1 };
            } else if (sort === 'title_desc') {
                sortOptions = { title: -1 };
            } else {
                sortOptions = { date: -1 };
            }

            const searchResults = await Blogs.find(searchQuery).sort(sortOptions);

            return res.status(200).json({
                message: "Search results fetched successfully",
                count: searchResults.length,
                data: searchResults,
            });
        } else {
            // Mock data search logic
            let searchResults = [...mockBlogs];

            // Filter by query
            if (query) {
                searchResults = searchResults.filter(blog => 
                    blog.title?.toLowerCase().includes(query.toLowerCase()) ||
                    blog.description?.toLowerCase().includes(query.toLowerCase())
                );
            }

            // Filter by username
            if (username) {
                searchResults = searchResults.filter(blog => 
                    blog.username?.toLowerCase().includes(username.toLowerCase())
                );
            }

            // Sort results
            if (sort === 'newest') {
                searchResults.sort((a, b) => new Date(b.date) - new Date(a.date));
            } else if (sort === 'oldest') {
                searchResults.sort((a, b) => new Date(a.date) - new Date(b.date));
            } else if (sort === 'title_asc') {
                searchResults.sort((a, b) => a.title?.localeCompare(b.title));
            } else if (sort === 'title_desc') {
                searchResults.sort((a, b) => b.title?.localeCompare(a.title));
            } else {
                searchResults.sort((a, b) => new Date(b.date) - new Date(a.date));
            }

            return res.status(200).json({
                message: "Search results fetched successfully (mock mode)",
                count: searchResults.length,
                data: searchResults,
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};