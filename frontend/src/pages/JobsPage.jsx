import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Briefcase, MapPin, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const JobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [newJob, setNewJob] = useState({
        title: '',
        company: '',
        location: '',
        type: 'full-time',
        description: ''
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const { data } = await axios.get('/jobs');
            setJobs(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/jobs', newJob);
            setShowModal(false);
            fetchJobs();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Job Board</h1>
                {['admin', 'alumni', 'tpo'].includes(user?.role) && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700"
                    >
                        Post Job
                    </button>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Post New Job</h2>
                        <form onSubmit={handleCreateJob} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Job Title"
                                className="w-full border p-2 rounded"
                                value={newJob.title}
                                onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Company"
                                className="w-full border p-2 rounded"
                                value={newJob.company}
                                onChange={e => setNewJob({ ...newJob, company: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Location"
                                className="w-full border p-2 rounded"
                                value={newJob.location}
                                onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                                required
                            />
                            <select
                                className="w-full border p-2 rounded"
                                value={newJob.type}
                                onChange={e => setNewJob({ ...newJob, type: e.target.value })}
                            >
                                <option value="full-time">Full Time</option>
                                <option value="part-time">Part Time</option>
                                <option value="internship">Internship</option>
                            </select>
                            <textarea
                                placeholder="Description"
                                className="w-full border p-2 rounded"
                                value={newJob.description}
                                onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                                required
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded hover:bg-indigo-700"
                                >
                                    Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {jobs.map((job) => (
                        <li key={job._id}>
                            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-primary truncate">{job.title}</p>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {job.type}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            <Building className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                            {job.company}
                                        </p>
                                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                            <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                            {job.location}
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                        <p>
                                            Posted by {job.postedBy?.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default JobsPage;
