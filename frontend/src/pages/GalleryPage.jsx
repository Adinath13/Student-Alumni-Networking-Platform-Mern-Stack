import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from '../utils/axios';
import { Image, Upload, Trash2, Eye } from 'lucide-react';
import Button from '../components/Button';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import UploadGalleryModal from '../components/UploadGalleryModal';

const GalleryPage = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchGalleries();
    }, [filter]);

    const fetchGalleries = async () => {
        try {
            const params = filter !== 'all' ? { category: filter } : {};
            const { data } = await axios.get('/gallery', { params });
            setGalleries(data);
        } catch (error) {
            showToast('Failed to load galleries', 'error');
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { value: 'all', label: 'All Photos' },
        { value: 'event', label: 'Events' },
        { value: 'campus', label: 'Campus' },
        { value: 'achievement', label: 'Achievements' },
        { value: 'reunion', label: 'Reunions' },
        { value: 'other', label: 'Other' }
    ];

    const openGallery = (gallery) => {
        setSelectedGallery(gallery);
        setShowModal(true);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Photo Gallery</h1>
                        <p className="text-gray-600">
                            Browse through memories from events, campus life, and more
                        </p>
                    </div>
                    {user && (user.role === 'admin' || user.role === 'alumni') && (
                        <Button className="mt-4 md:mt-0" onClick={() => setShowUploadModal(true)}>
                            <Upload size={20} />
                            Upload Photos
                        </Button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category.value}
                            onClick={() => setFilter(category.value)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === category.value
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200:bg-gray-700'
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                {galleries.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {galleries.map((gallery) => (
                            <div
                                key={gallery._id}
                                className="card cursor-pointer group"
                                onClick={() => openGallery(gallery)}
                            >
                                <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
                                    {gallery.images && gallery.images.length > 0 ? (
                                        <img
                                            src={gallery.images[0].url || 'https://placehold.co/400x300'}
                                            alt={gallery.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Image size={48} className="text-gray-400" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                                        <Eye size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    {gallery.images && gallery.images.length > 1 && (
                                        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                                            {gallery.images.length} photos
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{gallery.title}</h3>
                                {gallery.description && (
                                    <p className="text-gray-600 line-clamp-2">
                                        {gallery.description}
                                    </p>
                                )}
                                <div className="mt-3">
                                    <span className="badge badge-primary">{gallery.category}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Image size={64} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No photos found</h3>
                        <p className="text-gray-600">
                            Check back later for new photos
                        </p>
                    </div>
                )}
            </div>

            {/* Gallery Modal */}
            {selectedGallery && (
                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title={selectedGallery.title}
                    size="xl"
                >
                    <div className="space-y-4">
                        {selectedGallery.description && (
                            <p className="text-gray-600">{selectedGallery.description}</p>
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {selectedGallery.images && selectedGallery.images.map((image, index) => (
                                <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                                    <img
                                        src={image.url || 'https://placehold.co/300'}
                                        alt={image.caption || `Photo ${index + 1}`}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </Modal>
            )}

            {/* Upload Modal */}
            <UploadGalleryModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                onSuccess={fetchGalleries}
            />
        </div>
    );
};

export default GalleryPage;
