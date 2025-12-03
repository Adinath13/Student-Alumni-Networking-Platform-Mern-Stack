const Testimonial = require('../models/Testimonial');

// Create testimonial
exports.createTestimonial = async (req, res) => {
    try {
        const { content, rating, category } = req.body;

        const testimonial = await Testimonial.create({
            user: req.user._id,
            content,
            rating,
            category
        });

        await testimonial.populate('user', 'name email');

        res.status(201).json(testimonial);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all testimonials
exports.getAllTestimonials = async (req, res) => {
    try {
        const { approved, featured, category } = req.query;
        const query = {};

        if (approved !== undefined) query.approved = approved === 'true';
        if (featured !== undefined) query.featured = featured === 'true';
        if (category) query.category = category;

        const testimonials = await Testimonial.find(query)
            .populate('user', 'name email')
            .sort('-createdAt');

        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single testimonial
exports.getTestimonialById = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id)
            .populate('user approvedBy', 'name email');

        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }

        res.json(testimonial);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update testimonial
exports.updateTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);

        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }

        // Check authorization
        if (testimonial.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        Object.assign(testimonial, req.body);
        await testimonial.save();

        res.json(testimonial);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete testimonial
exports.deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);

        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }

        // Check authorization
        if (testimonial.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await testimonial.deleteOne();

        res.json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Approve testimonial (Admin only)
exports.approveTestimonial = async (req, res) => {
    try {
        const { approved, featured } = req.body;
        const testimonial = await Testimonial.findById(req.params.id);

        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }

        testimonial.approved = approved;
        testimonial.featured = featured || testimonial.featured;
        testimonial.approvedBy = req.user._id;
        testimonial.approvedAt = new Date();

        await testimonial.save();
        await testimonial.populate('user approvedBy', 'name email');

        res.json(testimonial);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get featured testimonials
exports.getFeaturedTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({
            approved: true,
            featured: true
        })
            .populate('user', 'name email')
            .sort('-createdAt')
            .limit(6);

        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
