import { BookOpen, FileText, Video, Download, ExternalLink } from 'lucide-react';
import Card from '../components/Card';

const CareerResourcesPage = () => {
    const resources = [
        {
            category: 'Resume & CV',
            icon: <FileText size={32} />,
            color: 'from-blue-500 to-cyan-600',
            items: [
                { title: 'Resume Template - Modern', type: 'PDF', link: '#' },
                { title: 'Resume Template - Professional', type: 'PDF', link: '#' },
                { title: 'CV Writing Guide', type: 'PDF', link: '#' },
                { title: 'Cover Letter Samples', type: 'PDF', link: '#' }
            ]
        },
        {
            category: 'Interview Preparation',
            icon: <Video size={32} />,
            color: 'from-purple-500 to-pink-600',
            items: [
                { title: 'Common Interview Questions', type: 'Guide', link: '#' },
                { title: 'Behavioral Interview Tips', type: 'Video', link: '#' },
                { title: 'Technical Interview Prep', type: 'Guide', link: '#' },
                { title: 'Mock Interview Sessions', type: 'Video', link: '#' }
            ]
        },
        {
            category: 'Career Development',
            icon: <BookOpen size={32} />,
            color: 'from-green-500 to-teal-600',
            items: [
                { title: 'Career Planning Workbook', type: 'PDF', link: '#' },
                { title: 'Networking Strategies', type: 'Guide', link: '#' },
                { title: 'Personal Branding Guide', type: 'PDF', link: '#' },
                { title: 'LinkedIn Optimization', type: 'Guide', link: '#' }
            ]
        },
        {
            category: 'Industry Insights',
            icon: <ExternalLink size={32} />,
            color: 'from-orange-500 to-red-600',
            items: [
                { title: 'Tech Industry Trends 2024', type: 'Article', link: '#' },
                { title: 'Finance Sector Overview', type: 'Article', link: '#' },
                { title: 'Healthcare Career Paths', type: 'Guide', link: '#' },
                { title: 'Startup Ecosystem Guide', type: 'Article', link: '#' }
            ]
        }
    ];

    const webinars = [
        {
            title: 'Building Your Personal Brand',
            date: 'Dec 15, 2024',
            speaker: 'John Doe, Marketing Director',
            status: 'upcoming'
        },
        {
            title: 'Navigating Career Transitions',
            date: 'Dec 20, 2024',
            speaker: 'Jane Smith, Career Coach',
            status: 'upcoming'
        },
        {
            title: 'Mastering Remote Work',
            date: 'Nov 28, 2024',
            speaker: 'Mike Johnson, HR Manager',
            status: 'recorded'
        }
    ];

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Career Resources</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Access comprehensive resources to boost your career development and professional growth
                    </p>
                </div>

                {/* Resource Categories */}
                <div className="space-y-12 mb-16">
                    {resources.map((category, index) => (
                        <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center text-white`}>
                                    {category.icon}
                                </div>
                                <h2 className="text-2xl font-bold">{category.category}</h2>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {category.items.map((item, itemIndex) => (
                                    <Card key={itemIndex} className="group cursor-pointer">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-semibold group-hover:text-indigo-600 transition-colors">
                                                {item.title}
                                            </h3>
                                            <Download size={18} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                                        </div>
                                        <span className="badge badge-primary">{item.type}</span>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Upcoming Webinars */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-8">Upcoming Webinars & Workshops</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {webinars.map((webinar, index) => (
                            <Card key={index} className="relative">
                                {webinar.status === 'upcoming' && (
                                    <div className="absolute top-4 right-4">
                                        <span className="badge bg-green-500 text-white">Upcoming</span>
                                    </div>
                                )}
                                {webinar.status === 'recorded' && (
                                    <div className="absolute top-4 right-4">
                                        <span className="badge bg-blue-500 text-white">Recorded</span>
                                    </div>
                                )}
                                <div className="mb-4">
                                    <div className="w-full aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                                        <Video size={48} />
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{webinar.title}</h3>
                                <p className="text-gray-600 mb-2">{webinar.speaker}</p>
                                <p className="text-sm text-gray-500">{webinar.date}</p>
                                <button className="btn btn-primary w-full mt-4">
                                    {webinar.status === 'upcoming' ? 'Register' : 'Watch Recording'}
                                </button>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <Card className="card-gradient text-white text-center">
                    <BookOpen size={48} className="mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-4">Need Personalized Career Guidance?</h2>
                    <p className="text-lg mb-6 opacity-90">
                        Connect with our alumni mentors for one-on-one career counseling
                    </p>
                    <a href="/mentorship" className="btn bg-white text-indigo-600 hover:bg-gray-100">
                        Find a Mentor
                    </a>
                </Card>
            </div>
        </div>
    );
};

export default CareerResourcesPage;
