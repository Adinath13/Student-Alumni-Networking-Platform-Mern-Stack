import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { CheckCircle, XCircle, Search, Filter, Loader, Eye } from 'lucide-react';

const MentorApplicationReview = () => {
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('pending');
    const [selectedApp, setSelectedApp] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    useEffect(() => {
        filterApplications();
    }, [searchTerm, statusFilter, applications]);

    const fetchApplications = async () => {
        try {
            const { data } = await axios.get('/mentor-applications');
            setApplications(data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterApplications = () => {
        let filtered = applications;

        // Filter by status
        if (statusFilter) {
            filtered = filtered.filter(app => app.status === statusFilter);
        }

        // Filter by search term
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(app =>
                app.user?.name?.toLowerCase().includes(searchLower) ||
                app.currentCompany?.toLowerCase().includes(searchLower) ||
                app.domain?.some(d => d.toLowerCase().includes(searchLower))
            );
        }

        setFilteredApplications(filtered);
    };

    const handleApprove = async (appId) => {
        if (!confirm('Are you sure you want to approve this mentor application?')) return;

        setActionLoading(true);
        try {
            await axios.put(`/mentor-applications/${appId}/approve`);
            await fetchApplications();
            setShowDetails(false);
            setSelectedApp(null);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to approve application');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (appId) => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }

        setActionLoading(true);
        try {
            await axios.put(`/mentor-applications/${appId}/reject`, {
                rejectionReason
            });
            await fetchApplications();
            setShowDetails(false);
            setSelectedApp(null);
            setRejectionReason('');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to reject application');
        } finally {
            setActionLoading(false);
        }
    };

    const viewDetails = (app) => {
        setSelectedApp(app);
        setShowDetails(true);
        setRejectionReason('');
    };

    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        approved: applications.filter(a => a.status === 'approved').length,
        rejected: applications.filter(a => a.status === 'rejected').length
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
                <h1 className="text-3xl font-bold text-gray-900">Mentor Application Review</h1>
                <p className="text-gray-600 mt-2">Review and approve mentor applications from alumni</p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-500">Total Applications</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg shadow p-6">
                    <p className="text-sm text-yellow-700">Pending Review</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="bg-green-50 rounded-lg shadow p-6">
                    <p className="text-sm text-green-700">Approved</p>
                    <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <div className="bg-red-50 rounded-lg shadow p-6">
                    <p className="text-sm text-red-700">Rejected</p>
                    <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, company, or domain..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 input w-full"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-10 input w-full"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Applications List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {filteredApplications.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No applications found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Applicant
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role & Company
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Experience
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Domains
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredApplications.map((app) => (
                                    <tr key={app._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-primary font-bold">
                                                    {app.user?.name?.charAt(0) || 'A'}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {app.user?.name || 'Unknown'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {app.user?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{app.currentRole}</div>
                                            <div className="text-sm text-gray-500">{app.currentCompany}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{app.experience?.years} years</div>
                                            <div className="text-sm text-gray-500">{app.availability?.hoursPerWeek} hrs/week</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {app.domain?.slice(0, 2).map((domain, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-primary"
                                                    >
                                                        {domain}
                                                    </span>
                                                ))}
                                                {app.domain?.length > 2 && (
                                                    <span className="text-xs text-gray-500">+{app.domain.length - 2}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                ${app.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                                                ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                ${app.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                                                ${app.status === 'suspended' ? 'bg-orange-100 text-orange-800' : ''}
                                            `}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => viewDetails(app)}
                                                className="text-primary hover:text-indigo-900 flex items-center"
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {showDetails && selectedApp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4">
                            <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Applicant Info */}
                            <div className="flex items-center space-x-4">
                                <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-primary text-2xl font-bold">
                                    {selectedApp.user?.name?.charAt(0) || 'A'}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">{selectedApp.user?.name}</h3>
                                    <p className="text-gray-600">{selectedApp.user?.email}</p>
                                </div>
                            </div>

                            {/* Professional Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Current Role</p>
                                    <p className="font-medium">{selectedApp.currentRole}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Current Company</p>
                                    <p className="font-medium">{selectedApp.currentCompany}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Experience</p>
                                    <p className="font-medium">{selectedApp.experience?.years} years</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Availability</p>
                                    <p className="font-medium">{selectedApp.availability?.hoursPerWeek} hours/week</p>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">LinkedIn</p>
                                    <a
                                        href={selectedApp.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline text-sm"
                                    >
                                        View Profile
                                    </a>
                                </div>
                                {selectedApp.portfolio && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Portfolio</p>
                                        <a
                                            href={selectedApp.portfolio}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline text-sm"
                                        >
                                            View Portfolio
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Domains */}
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Areas of Expertise</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedApp.domain?.map((domain, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-primary"
                                        >
                                            {domain}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Experience Description */}
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Experience Description</p>
                                <p className="text-gray-700">{selectedApp.experience?.description}</p>
                            </div>

                            {/* Bio */}
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Bio</p>
                                <p className="text-gray-700">{selectedApp.bio}</p>
                            </div>

                            {/* Rejection Reason Input (for pending applications) */}
                            {selectedApp.status === 'pending' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rejection Reason (if rejecting)
                                    </label>
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        rows="3"
                                        className="input w-full"
                                        placeholder="Provide a reason for rejection..."
                                    />
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-4 border-t">
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Close
                                </button>
                                {selectedApp.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleReject(selectedApp._id)}
                                            disabled={actionLoading}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleApprove(selectedApp._id)}
                                            disabled={actionLoading}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Approve
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorApplicationReview;
