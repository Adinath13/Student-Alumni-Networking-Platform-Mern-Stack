import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { CheckCircle, Clock, XCircle, AlertCircle, Loader } from 'lucide-react';
import MentorApplicationForm from '../components/MentorApplicationForm';

const MentorApplicationStatus = () => {
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchApplication();
    }, []);

    const fetchApplication = async () => {
        try {
            const { data } = await axios.get('/mentor-applications/me');
            setApplication(data);
        } catch (error) {
            if (error.response?.status !== 404) {
                console.error('Error fetching application:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleApplicationSuccess = () => {
        fetchApplication();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // No application yet
    if (!application) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-6">
                        <div className="mx-auto h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                            <AlertCircle className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Become a Mentor
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Share your knowledge and experience with students. Help guide the next generation
                        of professionals in their career journey.
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn-primary px-6 py-3 text-lg"
                    >
                        Apply to Become a Mentor
                    </button>
                </div>

                <MentorApplicationForm
                    isOpen={showForm}
                    onClose={() => setShowForm(false)}
                    onSuccess={handleApplicationSuccess}
                />
            </div>
        );
    }

    // Application exists - show status
    const getStatusIcon = () => {
        switch (application.status) {
            case 'approved':
                return <CheckCircle className="h-12 w-12 text-green-500" />;
            case 'pending':
                return <Clock className="h-12 w-12 text-yellow-500" />;
            case 'rejected':
                return <XCircle className="h-12 w-12 text-red-500" />;
            case 'suspended':
                return <AlertCircle className="h-12 w-12 text-orange-500" />;
            default:
                return <Clock className="h-12 w-12 text-gray-500" />;
        }
    };

    const getStatusColor = () => {
        switch (application.status) {
            case 'approved':
                return 'bg-green-50 border-green-200';
            case 'pending':
                return 'bg-yellow-50 border-yellow-200';
            case 'rejected':
                return 'bg-red-50 border-red-200';
            case 'suspended':
                return 'bg-orange-50 border-orange-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const getStatusText = () => {
        switch (application.status) {
            case 'approved':
                return 'Your application has been approved!';
            case 'pending':
                return 'Your application is under review';
            case 'rejected':
                return 'Your application was not approved';
            case 'suspended':
                return 'Your mentor status has been suspended';
            default:
                return 'Application Status';
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className={`bg-white rounded-lg shadow-lg border-2 ${getStatusColor()} p-8`}>
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        {getStatusIcon()}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {getStatusText()}
                    </h2>
                    <p className="text-gray-600 capitalize">
                        Status: <span className="font-semibold">{application.status}</span>
                    </p>
                </div>

                {/* Application Details */}
                <div className="space-y-6 border-t pt-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Application Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Current Role</p>
                                <p className="font-medium">{application.currentRole}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Current Company</p>
                                <p className="font-medium">{application.currentCompany}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Experience</p>
                                <p className="font-medium">{application.experience?.years} years</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Availability</p>
                                <p className="font-medium">{application.availability?.hoursPerWeek} hours/week</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 mb-2">Areas of Expertise</p>
                        <div className="flex flex-wrap gap-2">
                            {application.domain?.map((domain, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-primary"
                                >
                                    {domain}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 mb-2">Bio</p>
                        <p className="text-gray-700">{application.bio}</p>
                    </div>

                    {application.status === 'rejected' && application.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm font-semibold text-red-800 mb-1">Rejection Reason:</p>
                            <p className="text-red-700">{application.rejectionReason}</p>
                        </div>
                    )}

                    {application.status === 'approved' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-800 font-semibold mb-2">
                                🎉 Congratulations! You are now a verified mentor.
                            </p>
                            <p className="text-green-700 mb-4">
                                Students can now see your profile and send you mentorship requests.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-2xl font-bold text-primary">{application.activeMentees || 0}</p>
                                    <p className="text-sm text-gray-600">Active Mentees</p>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-2xl font-bold text-primary">{application.totalMentees || 0}</p>
                                    <p className="text-sm text-gray-600">Total Mentees</p>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-2xl font-bold text-primary">
                                        {application.rating > 0 ? application.rating.toFixed(1) : 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">Rating</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {application.status === 'pending' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-800">
                                ⏳ Your application is being reviewed by the TPO/Admin team.
                                You will be notified once a decision is made.
                            </p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-center space-x-4">
                    {application.status === 'approved' && (
                        <a
                            href="/mentorship"
                            className="btn-primary px-6 py-2"
                        >
                            View Mentorship Requests
                        </a>
                    )}
                    {application.status === 'rejected' && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="btn-primary px-6 py-2"
                        >
                            Reapply
                        </button>
                    )}
                </div>
            </div>

            <MentorApplicationForm
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                onSuccess={handleApplicationSuccess}
            />
        </div>
    );
};

export default MentorApplicationStatus;
