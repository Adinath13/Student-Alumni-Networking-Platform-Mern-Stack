import { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const faqs = [
        {
            category: 'General',
            questions: [
                {
                    question: 'How do I join the alumni network?',
                    answer: 'You can join by registering on our platform with your graduation details. Once verified, you\'ll have full access to all features.'
                },
                {
                    question: 'Is there a membership fee?',
                    answer: 'No, membership to the alumni network is completely free for all graduates of our institution.'
                },
                {
                    question: 'How do I update my profile information?',
                    answer: 'Log in to your account, go to your profile page, and click the "Edit Profile" button to update your information.'
                }
            ]
        },
        {
            category: 'Events',
            questions: [
                {
                    question: 'How can I find upcoming events?',
                    answer: 'Visit the Events page to see all upcoming alumni events. You can filter by date, location, and event type.'
                },
                {
                    question: 'Can I host an alumni event?',
                    answer: 'Yes! Alumni can propose events through the platform. Contact the admin team with your event details for approval.'
                },
                {
                    question: 'How do I RSVP for an event?',
                    answer: 'On the event details page, click the "Register" or "RSVP" button. You\'ll receive a confirmation email.'
                }
            ]
        },
        {
            category: 'Jobs & Career',
            questions: [
                {
                    question: 'How do I post a job opportunity?',
                    answer: 'Alumni can post jobs through the Job Board section. Click "Post a Job" and fill in the job details.'
                },
                {
                    question: 'Can students access job postings?',
                    answer: 'Yes, current students have access to view all job postings shared by alumni.'
                },
                {
                    question: 'How does the mentorship program work?',
                    answer: 'Students can request mentorship from alumni in their field of interest. Alumni can accept or decline requests based on their availability.'
                }
            ]
        },
        {
            category: 'Donations',
            questions: [
                {
                    question: 'How can I make a donation?',
                    answer: 'Visit the Donations page and choose your donation amount and purpose. We accept various payment methods.'
                },
                {
                    question: 'Is my donation tax-deductible?',
                    answer: 'Yes, all donations are tax-deductible. You\'ll receive a receipt for tax purposes after your donation.'
                },
                {
                    question: 'Can I set up recurring donations?',
                    answer: 'Yes, you can set up monthly or annual recurring donations through your donation preferences.'
                }
            ]
        },
        {
            category: 'Technical',
            questions: [
                {
                    question: 'I forgot my password. How do I reset it?',
                    answer: 'Click "Forgot Password" on the login page and follow the instructions sent to your registered email.'
                },
                {
                    question: 'Is there a mobile app?',
                    answer: 'Currently, we offer a mobile-responsive website. A dedicated mobile app is in development.'
                }
            ]
        }
    ];

    const filteredFaqs = faqs.map(category => ({
        ...category,
        questions: category.questions.filter(q =>
            q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    const toggleQuestion = (categoryIndex, questionIndex) => {
        const index = `${categoryIndex}-${questionIndex}`;
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl text-gray-600">
                        Find answers to common questions about our alumni network
                    </p>
                </div>

                {/* Search */}
                <div className="mb-12">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search FAQs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input pl-12"
                        />
                    </div>
                </div>

                {/* FAQ Categories */}
                <div className="space-y-8">
                    {filteredFaqs.map((category, categoryIndex) => (
                        <div key={categoryIndex} className="animate-fade-in">
                            <h2 className="text-2xl font-bold mb-4 text-indigo-600">
                                {category.category}
                            </h2>
                            <div className="space-y-3">
                                {category.questions.map((faq, questionIndex) => {
                                    const index = `${categoryIndex}-${questionIndex}`;
                                    const isOpen = openIndex === index;

                                    return (
                                        <div key={questionIndex} className="card hover:shadow-lg transition-shadow">
                                            <button
                                                onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                                                className="w-full flex items-center justify-between text-left"
                                            >
                                                <span className="font-semibold text-lg pr-4">{faq.question}</span>
                                                {isOpen ? (
                                                    <ChevronUp className="flex-shrink-0 text-indigo-600" size={24} />
                                                ) : (
                                                    <ChevronDown className="flex-shrink-0 text-gray-400" size={24} />
                                                )}
                                            </button>
                                            {isOpen && (
                                                <div className="mt-4 pt-4 border-t border-gray-200 text-gray-600 animate-fade-in">
                                                    {faq.answer}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredFaqs.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-500">No FAQs found matching your search.</p>
                    </div>
                )}

                {/* Contact CTA */}
                <div className="mt-16 card card-gradient text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
                    <p className="mb-6 opacity-90">
                        Can't find the answer you're looking for? Please contact our support team.
                    </p>
                    <a href="/contact" className="btn bg-white text-indigo-600 hover:bg-gray-100">
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
