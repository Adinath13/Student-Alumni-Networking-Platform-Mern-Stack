import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, Clock, Eye, Ban } from 'lucide-react';

const AdminMentorManagement = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('pending');
    const [applications, setApplications] = useState([]);
    const [studentRequests, setStudentRequests] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        if (user?.role === 'admin' || user?.role === 'tpo') {
            fetchApplications();
            fetchStats();
        }
    }, [activeTab, user]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            if (activeTab === 'student-requests') {
                const { data } = await axios.get('/mentorships');
                setStudentRequests(data);
            } else {
                const { data } = await axios.get(`/mentor-applications?status=${activeTab}`);
                setApplications(data);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            showToast('Failed to fetch data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const { data } = await axios.get('/mentor-applications/stats');
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm('Are you sure you want to approve this mentor application?')) return;

        setActionLoading(true);
        try {
            await axios.put(`/mentor-applications/${id}/approve`);
            showToast('Mentor application approved successfully!', 'success');
            fetchApplications();
            fetchStats();
            setShowDetailsModal(false);
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to approve application', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (id) => {
        if (!rejectionReason.trim()) {
            showToast('Please provide a rejection reason', 'error');
            return;
        }

        setActionLoading(true);
        try {
            await axios.put(`/mentor-applications/${id}/reject`, {
                reason: rejectionReason
            });
            showToast('Mentor application rejected', 'success');
            fetchApplications();
            fetchStats();
            setShowDetailsModal(false);
            setRejectionReason('');
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to reject application', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSuspend = async (id) => {
        const reason = window.prompt('Please provide a reason for suspension:');
        if (!reason) return;

        setActionLoading(true);
        try {
            await axios.put(`/mentor-applications/${id}/suspend`, { reason });
            showToast('Mentor suspended successfully', 'success');
            fetchApplications();
            fetchStats();
            setShowDetailsModal(false);
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to suspend mentor', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    if (user?.role !== 'admin' && user?.role !== 'tpo') {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Only admins and TPOs can access this page.</p>
            </div>
        );
    }

    const tabs = [
        { id: 'pending', label: 'Pending', count: stats?.applications?.pending || 0 },
        { id: 'approved', label: 'Verified Mentors', count: stats?.applications?.approved || 0 },
        { id: 'rejected', label: 'Rejected', count: stats?.applications?.rejected || 0 },
        { id: 'suspended', label: 'Suspended', count: stats?.applications?.suspended || 0 },
        { id: 'student-requests', label: 'Student Requests', count: stats?.mentorships?.total || 0 }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Mentor Management</h1>
                <p className="mt-2 text-gray-600">
                    Review and manage mentor applications
                </p>
            </div>

            {/* Statistics */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600">Total Applications</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.applications.total}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600">Verified Mentors</p>
                        <p className="text-2xl font-bold text-green-600">{stats.applications.approved}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600">Active Mentorships</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.mentorships.active}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600">Total Mentorships</p>
                        <p className="text-2xl font-bold text-indigo-600">{stats.mentorships.total}</p>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${activeTab === tab.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                        >
                            <span>{tab.label}</span>
                            <span className={`${activeTab === tab.id ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
                                } px-2 py-0.5 rounded-full text-xs`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Applications List */}
            {loading ? (
                <div className="text-center py-12">Loading applications...</div>
            ) : activeTab === 'student-requests' ? (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mentor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {studentRequests.map((req) => (
                                <tr key={req._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{req.student?.name}</div>
                                        <div className="text-sm text-gray-500">{req.student?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{req.mentor?.name}</div>
                                        <div className="text-sm text-gray-500">{req.mentor?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${req.status === 'active' ? 'bg-green-100 text-green-800' :
                                            req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(req.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="max-w-xs truncate" title={req.requestMessage}>
                                            {req.requestMessage}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {studentRequests.length === 0 && (
                        <div className="text-center py-12 text-gray-500">No student requests found.</div>
                    )}
                </div>
            ) : applications.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">No {activeTab} applications found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {applications.map(app => (
                        <div key={app._id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {app.user?.name || 'Unknown'}
                                        </h3>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                app.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-blue-100 text-blue-800'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {app.currentRole} at {app.currentCompany}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {app.experience?.years} years experience • {app.availability?.hoursPerWeek} hrs/week
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {app.domain?.slice(0, 4).map((domain, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                {domain}
                                            </span>
                                        ))}
                                        {app.domain?.length > 4 && (
                                            <span className="text-xs text-gray-500">+{app.domain.length - 4} more</span>
                                        )}
                                    </div>
                                    {app.status === 'approved' && (
                                        <p className="text-sm text-gray-600 mt-2">
                                            Rating: {app.rating > 0 ? app.rating.toFixed(1) : 'No ratings yet'} •
                                            Active Mentees: {app.activeMentees} • Total: {app.totalMentees}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col space-y-2 ml-4">
                                    <button
                                        onClick={() => {
                                            setSelectedApplication(app);
                                            setShowDetailsModal(true);
                                        }}
                                        className="btn btn-secondary text-sm flex items-center space-x-1"
                                    >
                                        <Eye className="h-4 w-4" />
                                        <span>View Details</span>
                                    </button>
                                    {app.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(app._id)}
                                                disabled={actionLoading}
                                                className="btn btn-primary text-sm flex items-center space-x-1"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                                <span>Approve</span>
                                            </button>
                                        </>
                                    )}
                                    {app.status === 'approved' && (
                                        <button
                                            onClick={() => handleSuspend(app._id)}
                                            disabled={actionLoading}
                                            className="btn bg-yellow-500 hover:bg-yellow-600 text-white text-sm flex items-center space-x-1"
                                        >
                                            <Ban className="h-4 w-4" />
                                            <span>Suspend</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Details Modal */}
            {showDetailsModal && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {selectedApplication.user?.name}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setRejectionReason('');
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-gray-700">Contact</h3>
                                    <p className="text-gray-600">{selectedApplication.user?.email}</p>
                                    <a href={selectedApplication.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        LinkedIn Profile
                                    </a>
                                    {selectedApplication.portfolio && (
                                        <>
                                            {' • '}
                                            <a href={selectedApplication.portfolio} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                Portfolio
                                            </a>
                                        </>
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-700">Current Position</h3>
                                    <p className="text-gray-600">
                                        {selectedApplication.currentRole} at {selectedApplication.currentCompany}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-700">Experience</h3>
                                    <p className="text-gray-600">
                                        {selectedApplication.experience?.years} years
                                    </p>
                                    <p className="text-gray-600 mt-1">
                                        {selectedApplication.experience?.description}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-700">Areas of Expertise</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {selectedApplication.domain?.map((domain, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                                {domain}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-700">Availability</h3>
                                    <p className="text-gray-600">
                                        {selectedApplication.availability?.hoursPerWeek} hours per week
                                    </p>
                                    {selectedApplication.availability?.preferredDays?.length > 0 && (
                                        <p className="text-gray-600">
                                            Preferred days: {selectedApplication.availability.preferredDays.join(', ')}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-700">Bio</h3>
                                    <p className="text-gray-600 whitespace-pre-wrap">
                                        {selectedApplication.bio}
                                    </p>
                                </div>

                                {(selectedApplication.status === 'rejected' || selectedApplication.status === 'suspended') && selectedApplication.rejectionReason && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded">
                                        <h3 className="font-semibold text-red-800">Reason</h3>
                                        <p className="text-red-700">{selectedApplication.rejectionReason}</p>
                                    </div>
                                )}

                                {selectedApplication.status === 'pending' && (
                                    <div className="space-y-4 pt-4 border-t">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Rejection Reason (if rejecting)
                                            </label>
                                            <textarea
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                className="input w-full"
                                                rows="3"
                                                placeholder="Provide a reason for rejection..."
                                            />
                                        </div>
                                        <div className="flex justify-end space-x-3">
                                            <button
                                                onClick={() => handleReject(selectedApplication._id)}
                                                disabled={actionLoading || !rejectionReason.trim()}
                                                className="btn bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
                                            >
                                                <XCircle className="h-4 w-4 mr-2" />
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleApprove(selectedApplication._id)}
                                                disabled={actionLoading}
                                                className="btn btn-primary"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Approve
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMentorManagement;
