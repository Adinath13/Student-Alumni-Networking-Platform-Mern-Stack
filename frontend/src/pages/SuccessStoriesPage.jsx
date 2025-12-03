import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import axios from '../utils/axios';
import { Star, Quote, Award, TrendingUp } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const SuccessStoriesPage = () => {
    const { showToast } = useToast();
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const { data } = await axios.get('/testimonials', {
                params: { approved: true }
            });
            setTestimonials(data);
        } catch (error) {
            showToast('Failed to load success stories', 'error');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <Star
                key={index}
                size={20}
                className={index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
            />
        ));
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="flex justify-center mb-4">
                        <Award size={48} className="text-indigo-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Success Stories</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Inspiring testimonials from our alumni community sharing their achievements and experiences
                    </p>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="card text-center bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                        <TrendingUp size={40} className="mx-auto mb-3" />
                        <div className="text-4xl font-bold mb-2">{testimonials.length}+</div>
                        <div className="text-lg opacity-90">Success Stories</div>
                    </div>
                    <div className="card text-center bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                        <Star size={40} className="mx-auto mb-3" />
                        <div className="text-4xl font-bold mb-2">4.8</div>
                        <div className="text-lg opacity-90">Average Rating</div>
                    </div>
                    <div className="card text-center bg-gradient-to-br from-green-500 to-teal-600 text-white">
                        <Award size={40} className="mx-auto mb-3" />
                        <div className="text-4xl font-bold mb-2">95%</div>
                        <div className="text-lg opacity-90">Satisfaction Rate</div>
                    </div>
                </div>

                {/* Testimonials Grid */}
                {testimonials.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={testimonial._id}
                                className="card relative animate-fade-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <Quote className="absolute top-4 right-4 text-indigo-200" size={40} />
                                <div className="relative">
                                    {/* Rating */}
                                    <div className="flex gap-1 mb-4">
                                        {renderStars(testimonial.rating)}
                                    </div>

                                    {/* Content */}
                                    <p className="text-gray-700 mb-6 italic">
                                        "{testimonial.content}"
                                    </p>

                                    {/* Author */}
                                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                            {testimonial.user?.name?.charAt(0) || 'A'}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{testimonial.user?.name || 'Anonymous'}</div>
                                            <div className="text-sm text-gray-500">
                                                {testimonial.category.charAt(0).toUpperCase() + testimonial.category.slice(1)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Featured Badge */}
                                    {testimonial.featured && (
                                        <div className="absolute top-0 left-0">
                                            <span className="badge bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                                                Featured
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Quote size={64} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No success stories yet</h3>
                        <p className="text-gray-600">
                            Be the first to share your success story!
                        </p>
                    </div>
                )}

                {/* CTA */}
                <div className="mt-16 card card-gradient text-white text-center">
                    <h2 className="text-2xl font-bold mb-4">Share Your Success Story</h2>
                    <p className="text-lg mb-6 opacity-90">
                        Inspire others by sharing your journey and achievements
                    </p>
                    <button className="btn bg-white text-indigo-600 hover:bg-gray-100">
                        Submit Your Story
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessStoriesPage;
