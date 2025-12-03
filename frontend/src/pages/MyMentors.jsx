import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Users, Clock, CheckCircle, XCircle, MessageCircle, Loader } from 'lucide-react';

const MyMentors = () => {
    const [activeTab, setActiveTab] = useState('accepted');
    const [mentorships, setMentorships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMentorships();
    }, []);

    const fetchMentorships = async () => {
        try {
            const { data } = await axios.get('/mentorships');
            setMentorships(data);
        } catch (error) {
            console.error('Error fetching mentorships:', error);
        } finally {
            setLoading(false);
        }
    };

    const acceptedMentorships = mentorships.filter(m => m.status === 'active' || m.status === 'accepted' || m.status === 'completed');
    const pendingMentorships = mentorships.filter(m => m.status === 'pending');
    const rejectedMentorships = mentorships.filter(m => m.status === 'rejected');

    const handleChat = (mentorId) => {
        window.location.href = `/messages?userId=${mentorId}`;
    };

    const renderMentorCard = (mentorship) => {
        const mentor = mentorship.mentor;
        const isActive = mentorship.status === 'active' || mentorship.status === 'accepted';

        return (
            <div key={mentorship._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-primary text-xl font-bold">
                                {mentor?.name?.charAt(0) || 'M'}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{mentor?.name || 'Mentor'}</h3>
                                <p className="text-sm text-gray-500">{mentor?.email}</p>
                                {mentor?.linkedin && (
                                    <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline block mt-1">
                                        LinkedIn Profile
                                    </a>
                                )}
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${mentorship.status === 'active' || mentorship.status === 'accepted' ? 'bg-green-100 text-green-800' : ''}
                            ${mentorship.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${mentorship.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                            ${mentorship.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
                        `}>
                            {mentorship.status}
                        </span>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-500">Area of Expertise</p>
                            <p className="font-medium text-gray-900">{mentorship.areaOfExpertise}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Your Goals</p>
                            <p className="text-gray-700 text-sm">{mentorship.studentGoals}</p>
                        </div>

                        {mentorship.status === 'rejected' && mentorship.rejectionReason && (
                            <div className="bg-red-50 border border-red-200 rounded p-3">
                                <p className="text-sm font-semibold text-red-800 mb-1">Rejection Reason:</p>
                                <p className="text-sm text-red-700">{mentorship.rejectionReason}</p>
                            </div>
                        )}

                        {mentorship.startDate && (
                            <div>
                                <p className="text-sm text-gray-500">Started On</p>
                                <p className="text-sm text-gray-700">
                                    {new Date(mentorship.startDate).toLocaleDateString()}
                                </p>
                            </div>
                        )}

                        {isActive && (
                            <button
                                onClick={() => handleChat(mentor._id)}
                                className="w-full mt-4 btn-primary flex items-center justify-center"
                            >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Chat with Mentor
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">My Mentors</h1>
                <p className="text-gray-600 mt-2">Manage your mentorship connections</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('accepted')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'accepted'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            My Mentors ({acceptedMentorships.length})
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'pending'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center">
                            <Clock className="h-5 w-5 mr-2" />
                            Pending Requests ({pendingMentorships.length})
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('rejected')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'rejected'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center">
                            <XCircle className="h-5 w-5 mr-2" />
                            Rejected ({rejectedMentorships.length})
                        </div>
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div>
                {activeTab === 'accepted' && (
                    <div>
                        {acceptedMentorships.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg shadow">
                                <Users className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No mentors yet</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Start by finding and requesting a mentor
                                </p>
                                <div className="mt-6">
                                    <a href="/mentorship" className="btn-primary">
                                        Find a Mentor
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {acceptedMentorships.map(renderMentorCard)}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'pending' && (
                    <div>
                        {pendingMentorships.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg shadow">
                                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No pending requests</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    You don't have any pending mentorship requests
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pendingMentorships.map(renderMentorCard)}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'rejected' && (
                    <div>
                        {rejectedMentorships.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg shadow">
                                <XCircle className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No rejected requests</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    You don't have any rejected mentorship requests
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {rejectedMentorships.map(renderMentorCard)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyMentors;
