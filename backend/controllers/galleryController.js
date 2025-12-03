const Gallery = require('../models/Gallery');

// Create gallery album
exports.createGallery = async (req, res) => {
    try {
        const { title, description, category, eventId, images } = req.body;

        const gallery = await Gallery.create({
            title,
            description,
            category,
            event: eventId,
            images: images || [],
            uploadedBy: req.user._id
        });

        await gallery.populate('uploadedBy', 'name email');

        res.status(201).json(gallery);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all galleries
exports.getGalleries = async (req, res) => {
    try {
        const { category, eventId } = req.query;
        const query = { isPublic: true };

        if (category) query.category = category;
        if (eventId) query.event = eventId;

        const galleries = await Gallery.find(query)
            .populate('uploadedBy event', 'name email title')
            .sort('-createdAt');

        res.json(galleries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single gallery
exports.getGalleryById = async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.id)
            .populate('uploadedBy event', 'name email title');

        if (!gallery) {
            return res.status(404).json({ message: 'Gallery not found' });
        }

        res.json(gallery);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update gallery
exports.updateGallery = async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.id);

        if (!gallery) {
            return res.status(404).json({ message: 'Gallery not found' });
        }

        // Check authorization
        if (gallery.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        Object.assign(gallery, req.body);
        await gallery.save();

        res.json(gallery);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete gallery
exports.deleteGallery = async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.id);

        if (!gallery) {
            return res.status(404).json({ message: 'Gallery not found' });
        }

        // Check authorization
        if (gallery.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await gallery.deleteOne();

        res.json({ message: 'Gallery deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add images to gallery
exports.addImages = async (req, res) => {
    try {
        const { images } = req.body;
        const gallery = await Gallery.findById(req.params.id);

        if (!gallery) {
            return res.status(404).json({ message: 'Gallery not found' });
        }

        images.forEach(image => {
            gallery.images.push({
                ...image,
                uploadedBy: req.user._id
            });
        });

        await gallery.save();

        res.json(gallery);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
