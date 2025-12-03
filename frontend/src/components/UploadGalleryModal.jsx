import { useState } from 'react';
import axios from '../utils/axios';
import { useToast } from '../context/ToastContext';
import Modal from './Modal';
import Button from './Button';
import { Upload, X } from 'lucide-react';

const UploadGalleryModal = ({ isOpen, onClose, onSuccess }) => {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'event'
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);

    const categories = [
        { value: 'event', label: 'Event' },
        { value: 'campus', label: 'Campus' },
        { value: 'achievement', label: 'Achievement' },
        { value: 'reunion', label: 'Reunion' },
        { value: 'other', label: 'Other' }
    ];

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);

        // Create previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    const removeFile = (index) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedFiles.length === 0) {
            showToast('Please select at least one image', 'error');
            return;
        }

        setUploading(true);

        try {
            // Upload all images
            const uploadedImages = [];
            for (const file of selectedFiles) {
                const formDataUpload = new FormData();
                formDataUpload.append('image', file);

                const { data } = await axios.post('/upload', formDataUpload, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                uploadedImages.push({
                    url: data.url,
                    caption: ''
                });
            }

            // Create gallery with uploaded images
            await axios.post('/gallery', {
                ...formData,
                images: uploadedImages
            });

            showToast('Gallery created successfully!', 'success');
            onSuccess();
            handleClose();
        } catch (error) {
            console.error(error);
            showToast(error.response?.data?.message || 'Failed to upload gallery', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleClose = () => {
        setFormData({ title: '', description: '', category: 'event' });
        setSelectedFiles([]);
        setPreviews([]);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Upload Photos" size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="input w-full"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="input w-full"
                        rows="3"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                    <label className="block text-sm font-medium mb-2">Images</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">
                                Click to upload images or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
                        </label>
                    </div>

                    {previews.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            {previews.map((preview, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-24 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload Gallery'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default UploadGalleryModal;
