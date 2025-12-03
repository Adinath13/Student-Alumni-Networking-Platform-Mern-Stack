import { Link } from 'react-router-dom';
import {
    Users,
    Calendar,
    Briefcase,
    Heart,
    MessageCircle,
    Award,
    ArrowRight,
    GraduationCap,
    TrendingUp
} from 'lucide-react';
import { useEffect, useState } from 'react';

const HomePage = () => {
    const [stats, setStats] = useState({
        alumni: 2000,
        events: 150,
        jobs: 320,
        mentorships: 450
    });

    const features = [
        {
            icon: <Users size={32} />,
            title: 'Alumni Network',
            description: 'Connect with thousands of alumni across the globe',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: <Calendar size={32} />,
            title: 'Events & Reunions',
            description: 'Stay updated with upcoming events and reunions',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: <Briefcase size={32} />,
            title: 'Job Opportunities',
            description: 'Explore career opportunities posted by alumni',
            color: 'from-orange-500 to-red-500'
        },
        {
            icon: <MessageCircle size={32} />,
            title: 'Mentorship Program',
            description: 'Get guidance from experienced alumni mentors',
            color: 'from-green-500 to-teal-500'
        },
        {
            icon: <Heart size={32} />,
            title: 'Give Back',
            description: 'Support your alma mater through donations',
            color: 'from-pink-500 to-rose-500'
        },
        {
            icon: <Award size={32} />,
            title: 'Success Stories',
            description: 'Read inspiring stories from fellow alumni',
            color: 'from-indigo-500 to-purple-500'
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="absolute inset-0" style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                }}></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                    <div className="text-center animate-fade-in">
                        <div className="flex items-center justify-center mb-6">
                            <GraduationCap size={64} className="animate-pulse" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Welcome to Our Alumni Network
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-indigo-100 max-w-3xl mx-auto">
                            Connect, collaborate, and grow with a vibrant community of alumni making a difference worldwide
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                Join Network
                                <ArrowRight size={20} />
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="var(--bg-primary)" />
                    </svg>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center animate-fade-in">
                            <div className="text-4xl md:text-5xl font-bold text-indigo-600 mb-2">
                                {stats.alumni.toLocaleString()}+
                            </div>
                            <div className="text-gray-600">Alumni Members</div>
                        </div>
                        <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                                {stats.events}+
                            </div>
                            <div className="text-gray-600">Events Hosted</div>
                        </div>
                        <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="text-4xl md:text-5xl font-bold text-pink-600 mb-2">
                                {stats.jobs}+
                            </div>
                            <div className="text-gray-600">Job Postings</div>
                        </div>
                        <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2">
                                {stats.mentorships}+
                            </div>
                            <div className="text-gray-600">Mentorships</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Everything You Need to Stay Connected
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Our platform offers comprehensive tools to help you network, grow, and give back
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="card group cursor-pointer animate-fade-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <TrendingUp size={48} className="mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Reconnect?
                    </h2>
                    <p className="text-xl mb-8 text-indigo-100">
                        Join thousands of alumni who are already benefiting from our network
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        Get Started Today
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
