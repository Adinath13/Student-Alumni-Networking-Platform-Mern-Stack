import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from '../utils/axios';
import { Newspaper, Calendar, User, Eye, Plus } from 'lucide-react';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import CreateArticleModal from '../components/CreateArticleModal';
import { format } from 'date-fns';

const NewsPage = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [news, setNews] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetchNews();
        fetchFeatured();
    }, [filter]);

    const fetchNews = async () => {
        try {
            const params = filter !== 'all' ? { category: filter, published: true } : { published: true };
            const { data } = await axios.get('/news', { params });
            setNews(data);
        } catch (error) {
            console.error('Error loading news:', error);
            // Only show toast for network errors, not empty results
            if (error.response?.status !== 404) {
                showToast('Unable to load news articles', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchFeatured = async () => {
        try {
            const { data } = await axios.get('/news/featured');
            setFeatured(data.slice(0, 3));
        } catch (error) {
            console.error('Failed to load featured news');
        }
    };

    const categories = [
        { value: 'all', label: 'All News' },
        { value: 'announcement', label: 'Announcements' },
        { value: 'achievement', label: 'Achievements' },
        { value: 'event', label: 'Events' },
        { value: 'alumni-spotlight', label: 'Alumni Spotlight' },
        { value: 'general', label: 'General' }
    ];

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">News & Updates</h1>
                        <p className="text-gray-600">
                            Stay updated with the latest news from our alumni community
                        </p>
                    </div>
                    {user && (user.role === 'admin' || user.role === 'tpo') && (
                        <Button className="mt-4 md:mt-0" onClick={() => setIsCreateModalOpen(true)}>
                            <Plus size={20} />
                            Create Article
                        </Button>
                    )}
                </div>

                {/* Featured News */}
                {featured.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">Featured Stories</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {featured.map((article) => (
                                <div key={article._id} className="card group cursor-pointer">
                                    <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg mb-4 overflow-hidden">
                                        {article.featuredImage ? (
                                            <img
                                                src={article.featuredImage}
                                                alt={article.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white">
                                                <Newspaper size={48} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-2">
                                        <span className="badge badge-primary">{article.category}</span>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-600 transition-colors">
                                        {article.title}
                                    </h3>
                                    {article.excerpt && (
                                        <p className="text-gray-600 mb-3 line-clamp-2">
                                            {article.excerpt}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={16} />
                                            {format(new Date(article.publishedAt || article.createdAt), 'MMM dd, yyyy')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye size={16} />
                                            {article.views || 0}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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

                {/* News List */}
                {news.length > 0 ? (
                    <div className="space-y-6">
                        {news.map((article) => (
                            <div key={article._id} className="card flex flex-col md:flex-row gap-6 group cursor-pointer">
                                <div className="md:w-64 aspect-video md:aspect-square bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg overflow-hidden flex-shrink-0">
                                    {article.featuredImage ? (
                                        <img
                                            src={article.featuredImage}
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white">
                                            <Newspaper size={48} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="mb-2">
                                        <span className="badge badge-primary">{article.category}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">
                                        {article.title}
                                    </h2>
                                    {article.excerpt && (
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {article.excerpt}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-6 text-sm text-gray-500">
                                        {article.author && (
                                            <span className="flex items-center gap-1">
                                                <User size={16} />
                                                {article.author.name}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Calendar size={16} />
                                            {format(new Date(article.publishedAt || article.createdAt), 'MMM dd, yyyy')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye size={16} />
                                            {article.views || 0} views
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Newspaper size={64} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                        <p className="text-gray-600">
                            Check back later for new updates
                        </p>
                    </div>
                )}
            </div>

            <CreateArticleModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    fetchNews();
                    fetchFeatured();
                }}
            />
        </div>
    );
};

export default NewsPage;
