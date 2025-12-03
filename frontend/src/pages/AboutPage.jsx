import { Users, Target, Award, Heart, Mail } from 'lucide-react';

const AboutPage = () => {
    const milestones = [
        { year: '1984', event: 'Institution Founded' },
        { year: '1995', event: '1,000 Alumni Milestone' },
        { year: '2010', event: 'Global Alumni Network Launched' },
        { year: '2020', event: 'Digital Platform Introduced' },
        { year: '2024', event: '2,000+ Active Alumni' }
    ];

    const values = [
        {
            icon: <Users size={40} />,
            title: 'Community',
            description: 'Building strong connections among alumni worldwide'
        },
        {
            icon: <Target size={40} />,
            title: 'Excellence',
            description: 'Maintaining the highest standards in everything we do'
        },
        {
            icon: <Award size={40} />,
            title: 'Achievement',
            description: 'Celebrating success and inspiring future generations'
        },
        {
            icon: <Heart size={40} />,
            title: 'Giving Back',
            description: 'Supporting our alma mater and fellow alumni'
        }
    ];

    return (
        <div className="min-h-screen relative">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" />

            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 -right-40 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
                <div className="absolute -bottom-20 -left-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
            </div>

            <div className="relative py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16 animate-fade-in">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">About Our Alumni Network</h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Connecting generations of graduates and fostering lifelong relationships
                        </p>
                    </div>

                    {/* Our Vision - Featured */}
                    <div className="mb-16">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl p-10 transform transition-all duration-300 hover:scale-105">
                                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Our Vision</h2>
                                <p className="text-xl text-center leading-relaxed">
                                    To be the leading alumni network that empowers graduates to achieve their full potential
                                    and make a positive impact in their communities and the world.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mission */}
                    <div className="mb-20">
                        <div className="max-w-4xl mx-auto">
                            <div className="card-gradient text-white rounded-2xl shadow-xl p-8">
                                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Our Mission</h2>
                                <p className="text-lg text-center opacity-90 leading-relaxed">
                                    To create a vibrant, engaged alumni community that supports personal and professional
                                    growth while strengthening the bond with our institution and fellow graduates.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Values */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {values.map((value, index) => (
                                <div key={index} className="card text-center">
                                    <div className="text-indigo-600 mb-4 flex justify-center">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
                        <div className="relative">
                            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-indigo-200"></div>
                            <div className="space-y-12">
                                {milestones.map((milestone, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                                    >
                                        <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                                            <div className="card">
                                                <div className="text-2xl font-bold text-indigo-600 mb-2">{milestone.year}</div>
                                                <div className="text-lg">{milestone.event}</div>
                                            </div>
                                        </div>
                                        <div className="w-4 h-4 bg-indigo-600 rounded-full border-4 border-white z-10"></div>
                                        <div className="w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact CTA */}
                    <div className="card card-gradient text-white text-center">
                        <Mail size={48} className="mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                        <p className="text-lg mb-6 opacity-90">
                            Have questions or want to learn more about our alumni network?
                        </p>
                        <a href="/contact" className="btn bg-white text-indigo-600 hover:bg-gray-100">
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
