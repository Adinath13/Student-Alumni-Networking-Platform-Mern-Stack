const News = require('../models/News');

// Create news article
exports.createNews = async (req, res) => {
    try {
        const { title, content, excerpt, category, featuredImage, tags, published } = req.body;

        const news = await News.create({
            title,
            content,
            excerpt,
            category,
            featuredImage,
            tags,
            published,
            author: req.user._id,
            publishedAt: published ? new Date() : null
        });

        await news.populate('author', 'name email');

        res.status(201).json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all news articles
exports.getAllNews = async (req, res) => {
    try {
        const { category, published } = req.query;
        const query = {};

        if (category) query.category = category;
        if (published !== undefined) query.published = published === 'true';

        const news = await News.find(query)
            .populate('author', 'name email')
            .sort('-publishedAt -createdAt');

        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single news article
exports.getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id)
            .populate('author', 'name email');

        if (!news) {
            return res.status(404).json({ message: 'News article not found' });
        }

        // Increment views
        news.views += 1;
        await news.save();

        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update news article
exports.updateNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({ message: 'News article not found' });
        }

        // Check authorization
        if (news.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // If publishing for the first time
        if (!news.published && req.body.published) {
            req.body.publishedAt = new Date();
        }

        Object.assign(news, req.body);
        await news.save();

        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete news article
exports.deleteNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({ message: 'News article not found' });
        }

        // Check authorization
        if (news.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await news.deleteOne();

        res.json({ message: 'News article deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get featured news
exports.getFeaturedNews = async (req, res) => {
    try {
        const news = await News.find({ published: true })
            .populate('author', 'name email')
            .sort('-views -publishedAt')
            .limit(5);

        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
