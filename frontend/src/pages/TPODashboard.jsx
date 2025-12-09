import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import StudentDetailModal from '../components/StudentDetailModal';
import {
    Users,
    Briefcase,
    TrendingUp,
    Award,
    Calendar,
    FileText,
    Download,
    Search,
    Filter,
    Plus,
    Building2,
    GraduationCap,
    DollarSign,
    BarChart3
} from 'lucide-react';
import EmailVerificationBanner from '../components/EmailVerificationBanner';

const TPODashboard = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalStudents: 0,
        placedStudents: 0,
        activeJobs: 0,
        averagePackage: 0,
        companiesVisited: 0
    });
    const [students, setStudents] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBatch, setFilterBatch] = useState('all');
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [studentsRes, jobsRes] = await Promise.all([
                axios.get('/students'),
                axios.get('/jobs')
            ]);

            setStudents(studentsRes.data);
            setJobs(jobsRes.data);

            // Calculate statistics
            const totalStudents = studentsRes.data.length;
            const activeJobs = jobsRes.data.filter(job => job.status === 'active').length;
            const placedStudents = Math.floor(totalStudents * 0.75); // Mock data
            const averagePackage = 8.5; // Mock data in LPA
            const companiesVisited = new Set(jobsRes.data.map(job => job.company)).size;

            setStats({
                totalStudents,
                placedStudents,
                activeJobs,
                averagePackage,
                companiesVisited
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBatch = filterBatch === 'all' || student.batch?.toString() === filterBatch;
        return matchesSearch && matchesBatch;
    });

    const handleViewStudent = (student) => {
        setSelectedStudent(student);
    };

    const handleContactStudent = (student) => {
        navigate('/messages', { state: { selectedUser: student.user } });
    };

    const handleExportReports = () => {
        try {
            // Create CSV content
            const headers = ['Name', 'Email', 'Batch', 'Branch', 'Course'];
            const csvContent = [
                headers.join(','),
                ...filteredStudents.map(s =>
                    [s.user?.name, s.user?.email, s.batch, s.branch, s.course].join(',')
                )
            ].join('\n');

            // Create download link
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `students_report_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

            showToast('Report exported successfully', 'success');
        } catch (error) {
            console.error('Error exporting report:', error);
            showToast('Failed to export report', 'error');
        }
    };

    const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
                    {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
                </div>
                <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                    <Icon className={`h-8 w-8 ${color}`} />
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-gray-600">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                <h1 className="text-3xl font-bold">TPO Dashboard</h1>
                <p className="mt-2 text-indigo-100">Manage placements, students, and recruitment activities</p>
            </div>

            <EmailVerificationBanner />

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard
                    icon={Users}
                    title="Total Students"
                    value={stats.totalStudents}
                    color="text-blue-600"
                />
                <StatCard
                    icon={Award}
                    title="Placed Students"
                    value={stats.placedStudents}
                    subtitle={`${Math.round((stats.placedStudents / stats.totalStudents) * 100)}% placement rate`}
                    color="text-green-600"
                />
                <StatCard
                    icon={Briefcase}
                    title="Active Jobs"
                    value={stats.activeJobs}
                    subtitle="Open positions"
                    color="text-purple-600"
                />
                <StatCard
                    icon={DollarSign}
                    title="Avg Package"
                    value={`₹${stats.averagePackage} LPA`}
                    color="text-yellow-600"
                />
                <StatCard
                    icon={Building2}
                    title="Companies"
                    value={stats.companiesVisited}
                    subtitle="Visited this year"
                    color="text-indigo-600"
                />
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        {['overview', 'students', 'jobs', 'analytics'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 text-sm font-medium capitalize ${activeTab === tab
                                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Quick Actions */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                                        <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                                        Quick Actions
                                    </h3>
                                    <div className="space-y-3">
                                        <Link to="/announcements" className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                            <span className="flex items-center">
                                                <Plus className="h-4 w-4 mr-2 text-indigo-600" />
                                                Create Announcement
                                            </span>
                                        </Link>
                                        <Link to="/admin/mentors" className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                            <span className="flex items-center">
                                                <Users className="h-4 w-4 mr-2 text-green-600" />
                                                Manage Mentors
                                            </span>
                                        </Link>
                                        <Link to="/jobs" className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                            <span className="flex items-center">
                                                <Briefcase className="h-4 w-4 mr-2 text-purple-600" />
                                                Post New Job
                                            </span>
                                        </Link>
                                        <button onClick={handleExportReports} className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                            <span className="flex items-center">
                                                <Download className="h-4 w-4 mr-2 text-green-600" />
                                                Export Reports
                                            </span>
                                        </button>
                                        <Link to="/jobs" className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                            <span className="flex items-center">
                                                <FileText className="h-4 w-4 mr-2 text-blue-600" />
                                                View Applications
                                            </span>
                                        </Link>
                                        <Link to="/message-management" className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                            <span className="flex items-center">
                                                <Users className="h-4 w-4 mr-2 text-indigo-600" />
                                                View All Chats
                                            </span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                                        <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
                                        Recent Activity
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="bg-white p-3 rounded-lg">
                                            <p className="text-sm font-medium">New job posted by TCS</p>
                                            <p className="text-xs text-gray-500">2 hours ago</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg">
                                            <p className="text-sm font-medium">15 students applied to Infosys</p>
                                            <p className="text-xs text-gray-500">5 hours ago</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg">
                                            <p className="text-sm font-medium">Placement drive scheduled</p>
                                            <p className="text-xs text-gray-500">1 day ago</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg">
                                            <p className="text-sm font-medium">10 students placed at Wipro</p>
                                            <p className="text-xs text-gray-500">2 days ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Upcoming Events */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                                    Upcoming Placement Drives
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            <tr>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">Google</td>
                                                <td className="px-4 py-3 text-sm text-gray-500">Dec 15, 2025</td>
                                                <td className="px-4 py-3 text-sm text-gray-500">₹18-25 LPA</td>
                                                <td className="px-4 py-3"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Confirmed</span></td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">Microsoft</td>
                                                <td className="px-4 py-3 text-sm text-gray-500">Dec 20, 2025</td>
                                                <td className="px-4 py-3 text-sm text-gray-500">₹20-28 LPA</td>
                                                <td className="px-4 py-3"><span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span></td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">Amazon</td>
                                                <td className="px-4 py-3 text-sm text-gray-500">Jan 5, 2026</td>
                                                <td className="px-4 py-3 text-sm text-gray-500">₹15-22 LPA</td>
                                                <td className="px-4 py-3"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Confirmed</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Students Tab */}
                    {activeTab === 'students' && (
                        <div className="space-y-4">
                            {/* Filters */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search students by name or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Filter className="h-5 w-5 text-gray-400" />
                                    <select
                                        value={filterBatch}
                                        onChange={(e) => setFilterBatch(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    >
                                        <option value="all">All Batches</option>
                                        <option value="2024">2024</option>
                                        <option value="2023">2023</option>
                                        <option value="2022">2022</option>
                                        <option value="2021">2021</option>
                                    </select>
                                </div>
                            </div>

                            {/* Students Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredStudents.length > 0 ? (
                                            filteredStudents.map((student) => (
                                                <tr key={student._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                                <span className="text-indigo-600 font-medium">
                                                                    {student.user?.name?.charAt(0) || 'S'}
                                                                </span>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {student.user?.name || 'N/A'}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {student.user?.email || 'N/A'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {student.batch || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {student.branch || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {student.course || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                        <button
                                                            onClick={() => handleViewStudent(student)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() => handleContactStudent(student)}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Contact
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No students found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Jobs Tab */}
                    {
                        activeTab === 'jobs' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">Job Postings</h3>
                                    <button
                                        onClick={() => navigate('/jobs')}
                                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Post New Job
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {jobs.length > 0 ? (
                                        jobs.slice(0, 6).map((job) => (
                                            <div key={job._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-semibold text-gray-900">{job.title}</h4>
                                                        <p className="text-sm text-gray-600 mt-1">{job.company}</p>
                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                {job.location}
                                                            </span>
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                {job.type}
                                                            </span>
                                                            {job.package && (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                    ₹{job.package} LPA
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className={`px-2 py-1 text-xs rounded-full ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {job.status}
                                                    </span>
                                                </div>
                                                <div className="mt-4 flex gap-2">
                                                    <button
                                                        onClick={() => showToast('Job details feature coming soon', 'info')}
                                                        className="flex-1 px-3 py-2 text-sm border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50"
                                                    >
                                                        View Details
                                                    </button>
                                                    <button
                                                        onClick={() => showToast('Applications management feature coming soon', 'info')}
                                                        className="flex-1 px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                                    >
                                                        Manage Applications
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-2 text-center py-8 text-gray-500">
                                            No job postings available
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    }

                    {/* Analytics Tab */}
                    {
                        activeTab === 'analytics' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Placement Trends */}
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                                            <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
                                            Placement Trends
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>Computer Science</span>
                                                    <span className="font-medium">95%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>Electronics</span>
                                                    <span className="font-medium">88%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>Mechanical</span>
                                                    <span className="font-medium">75%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>Civil</span>
                                                    <span className="font-medium">68%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Top Recruiters */}
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                                            <Building2 className="h-5 w-5 mr-2 text-indigo-600" />
                                            Top Recruiters
                                        </h3>
                                        <div className="space-y-3">
                                            {['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture'].map((company, index) => (
                                                <div key={company} className="flex items-center justify-between bg-white p-3 rounded-lg">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm mr-3">
                                                            {index + 1}
                                                        </div>
                                                        <span className="font-medium">{company}</span>
                                                    </div>
                                                    <span className="text-sm text-gray-500">{25 - index * 3} hires</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Package Distribution */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                                        <DollarSign className="h-5 w-5 mr-2 text-indigo-600" />
                                        Package Distribution
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-white p-4 rounded-lg text-center">
                                            <p className="text-2xl font-bold text-indigo-600">15%</p>
                                            <p className="text-sm text-gray-600 mt-1">&gt; 15 LPA</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg text-center">
                                            <p className="text-2xl font-bold text-purple-600">35%</p>
                                            <p className="text-sm text-gray-600 mt-1">10-15 LPA</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg text-center">
                                            <p className="text-2xl font-bold text-green-600">40%</p>
                                            <p className="text-sm text-gray-600 mt-1">5-10 LPA</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg text-center">
                                            <p className="text-2xl font-bold text-blue-600">10%</p>
                                            <p className="text-sm text-gray-600 mt-1">&lt; 5 LPA</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>

            {/* Student Detail Modal */}
            {
                selectedStudent && (
                    <StudentDetailModal
                        student={selectedStudent}
                        onClose={() => setSelectedStudent(null)}
                    />
                )
            }
        </div>
    );
};

export default TPODashboard;
