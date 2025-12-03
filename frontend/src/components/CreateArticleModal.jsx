import { useState } from 'react';
import axios from '../utils/axios';
import { useToast } from '../context/ToastContext';
import Modal from './Modal';
import Button from './Button';

const CreateArticleModal = ({ isOpen, onClose, onSuccess }) => {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: 'general',
        featuredImage: '',
        published: true,
        featured: false
    });
    const [loading, setLoading] = useState(false);

    const categories = [
        { value: 'announcement', label: 'Announcement' },
        { value: 'achievement', label: 'Achievement' },
        { value: 'event', label: 'Event' },
        { value: 'alumni-spotlight', label: 'Alumni Spotlight' },
        { value: 'general', label: 'General' }
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('/news', formData);
            showToast('Article created successfully!', 'success');
            handleClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            showToast(error.response?.data?.message || 'Failed to create article', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            title: '',
            excerpt: '',
            content: '',
            category: 'general',
            featuredImage: '',
            published: true,
            featured: false
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Create New Article">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="input w-full"
                        placeholder="Enter article title"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="input w-full"
                        required
                    >
                        {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Excerpt
                    </label>
                    <textarea
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        className="input w-full"
                        rows="2"
                        placeholder="Brief summary of the article (optional)"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        className="input w-full"
                        rows="8"
                        placeholder="Write your article content here..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Featured Image URL
                    </label>
                    <input
                        type="url"
                        name="featuredImage"
                        value={formData.featuredImage}
                        onChange={handleChange}
                        className="input w-full"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="published"
                            checked={formData.published}
                            onChange={handleChange}
                            className="rounded"
                        />
                        <span className="text-sm font-medium">Publish immediately</span>
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleChange}
                            className="rounded"
                        />
                        <span className="text-sm font-medium">Mark as featured</span>
                    </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Article'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateArticleModal;
