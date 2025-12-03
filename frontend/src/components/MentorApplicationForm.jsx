import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, Clock, Loader } from 'lucide-react';

const MentorApplicationForm = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [existingApplication, setExistingApplication] = useState(null);
    const [fetchingApplication, setFetchingApplication] = useState(true);

    const [formData, setFormData] = useState({
        domain: [],
        experienceYears: '',
        experienceDescription: '',
        currentRole: '',
        currentCompany: '',
        linkedin: '',
        portfolio: '',
        hoursPerWeek: '',
        preferredDays: [],
        bio: ''
    });

    const domainOptions = [
        'AI/ML',
        'Web Development',
        'Mobile Development',
        'Cloud Computing',
        'Cybersecurity',
        'Data Science',
        'DevOps',
        'Blockchain',
        'UI/UX Design',
        'Product Management',
        'Career Guidance',
        'Interview Preparation',
        'Resume Building',
        'Other'
    ];

    const daysOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        fetchExistingApplication();
    }, []);

    const fetchExistingApplication = async () => {
        try {
            const { data } = await axios.get('/mentor-applications/me');
            setExistingApplication(data);

            // Populate form with existing data
            setFormData({
                domain: data.domain || [],
                experienceYears: data.experience?.years || '',
                experienceDescription: data.experience?.description || '',
                currentRole: data.currentRole || '',
                currentCompany: data.currentCompany || '',
                linkedin: data.linkedin || '',
                portfolio: data.portfolio || '',
                hoursPerWeek: data.availability?.hoursPerWeek || '',
                preferredDays: data.availability?.preferredDays || [],
                bio: data.bio || ''
            });
        } catch (error) {
            // No application found, that's okay
            if (error.response?.status !== 404) {
                console.error('Error fetching application:', error);
            }
        } finally {
            setFetchingApplication(false);
        }
    };

    const handleDomainChange = (domain) => {
        setFormData(prev => ({
            ...prev,
            domain: prev.domain.includes(domain)
                ? prev.domain.filter(d => d !== domain)
                : [...prev.domain, domain]
        }));
    };

    const handleDayChange = (day) => {
        setFormData(prev => ({
            ...prev,
            preferredDays: prev.preferredDays.includes(day)
                ? prev.preferredDays.filter(d => d !== day)
                : [...prev.preferredDays, day]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                domain: formData.domain,
                experience: {
                    years: parseInt(formData.experienceYears),
                    description: formData.experienceDescription
                },
                currentRole: formData.currentRole,
                currentCompany: formData.currentCompany,
                linkedin: formData.linkedin,
                portfolio: formData.portfolio || undefined,
                availability: {
                    hoursPerWeek: parseInt(formData.hoursPerWeek),
                    preferredDays: formData.preferredDays
                },
                bio: formData.bio
            };

            if (existingApplication && existingApplication.status === 'pending') {
                // Update existing application
                await axios.put(`/mentor-applications/${existingApplication._id}`, payload);
                showToast('Mentor application updated successfully!', 'success');
            } else {
                // Submit new application
                await axios.post('/mentor-applications', payload);
                showToast('Mentor application submitted successfully! Awaiting admin approval.', 'success');
            }

            fetchExistingApplication();
        } catch (error) {
            console.error('Application error:', error);
            showToast(error.response?.data?.message || 'Failed to submit application', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (user?.role !== 'alumni') {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Only alumni can apply to become mentors.</p>
            </div>
        );
    }

    if (fetchingApplication) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader className="animate-spin h-8 w-8 text-primary" />
            </div>
        );
    }

    // Show status if application exists and is not pending
    if (existingApplication && existingApplication.status !== 'pending') {
        return (
            <div className="max-w-2xl mx-auto">
                <div className={`p-6 rounded-lg border-2 ${existingApplication.status === 'approved' ? 'border-green-500 bg-green-50' :
                        existingApplication.status === 'rejected' ? 'border-red-500 bg-red-50' :
                            'border-yellow-500 bg-yellow-50'
                    }`}>
                    <div className="flex items-center space-x-3 mb-4">
                        {existingApplication.status === 'approved' && <CheckCircle className="h-8 w-8 text-green-600" />}
                        {existingApplication.status === 'rejected' && <XCircle className="h-8 w-8 text-red-600" />}
                        {existingApplication.status === 'suspended' && <XCircle className="h-8 w-8 text-yellow-600" />}
                        <h2 className="text-2xl font-bold">
                            {existingApplication.status === 'approved' && 'Mentor Application Approved!'}
                            {existingApplication.status === 'rejected' && 'Application Rejected'}
                            {existingApplication.status === 'suspended' && 'Mentor Status Suspended'}
                        </h2>
                    </div>

                    {existingApplication.status === 'approved' && (
                        <p className="text-gray-700">
                            Congratulations! You are now a verified mentor. Students can now send you mentorship requests.
                        </p>
                    )}

                    {existingApplication.status === 'rejected' && (
                        <div>
                            <p className="text-gray-700 mb-2">
                                Your mentor application was not approved.
                            </p>
                            {existingApplication.rejectionReason && (
                                <div className="mt-3 p-3 bg-white rounded border border-red-200">
                                    <p className="text-sm font-medium text-gray-700">Reason:</p>
                                    <p className="text-sm text-gray-600">{existingApplication.rejectionReason}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {existingApplication.status === 'suspended' && (
                        <div>
                            <p className="text-gray-700 mb-2">
                                Your mentor status has been suspended.
                            </p>
                            {existingApplication.rejectionReason && (
                                <div className="mt-3 p-3 bg-white rounded border border-yellow-200">
                                    <p className="text-sm font-medium text-gray-700">Reason:</p>
                                    <p className="text-sm text-gray-600">{existingApplication.rejectionReason}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Become a Mentor</h1>
                <p className="mt-2 text-gray-600">
                    Share your knowledge and experience with students. Fill out the application below to become a verified mentor.
                </p>
            </div>

            {existingApplication && existingApplication.status === 'pending' && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                        Your application is pending admin approval. You can update it below.
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
                {/* Domain Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Areas of Expertise <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {domainOptions.map(domain => (
                            <label key={domain} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.domain.includes(domain)}
                                    onChange={() => handleDomainChange(domain)}
                                    className="rounded text-primary focus:ring-primary"
                                />
                                <span className="text-sm">{domain}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Years of Experience <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={formData.experienceYears}
                            onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                            className="input w-full"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hours Available Per Week <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="20"
                            value={formData.hoursPerWeek}
                            onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                            className="input w-full"
                            required
                        />
                    </div>
                </div>

                {/* Current Role & Company */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Role <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.currentRole}
                            onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                            className="input w-full"
                            placeholder="e.g., Software Engineer"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Company <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.currentCompany}
                            onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                            className="input w-full"
                            placeholder="e.g., Google"
                            required
                        />
                    </div>
                </div>

                {/* LinkedIn & Portfolio */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            LinkedIn Profile <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="url"
                            value={formData.linkedin}
                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                            className="input w-full"
                            placeholder="https://linkedin.com/in/yourprofile"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Portfolio/Website (Optional)
                        </label>
                        <input
                            type="url"
                            value={formData.portfolio}
                            onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                            className="input w-full"
                            placeholder="https://yourportfolio.com"
                        />
                    </div>
                </div>

                {/* Experience Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={formData.experienceDescription}
                        onChange={(e) => setFormData({ ...formData, experienceDescription: e.target.value })}
                        className="input w-full"
                        rows="3"
                        placeholder="Describe your professional experience..."
                        required
                    />
                </div>

                {/* Preferred Days */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Days for Mentorship
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {daysOptions.map(day => (
                            <label key={day} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.preferredDays.includes(day)}
                                    onChange={() => handleDayChange(day)}
                                    className="rounded text-primary focus:ring-primary"
                                />
                                <span className="text-sm">{day}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Bio */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio - What can you help with? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="input w-full"
                        rows="5"
                        minLength="50"
                        maxLength="1000"
                        placeholder="Tell students what you can help them with, your mentoring style, and what they can expect..."
                        required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        {formData.bio.length}/1000 characters (minimum 50)
                    </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || formData.domain.length === 0}
                        className="btn btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Submitting...' : existingApplication ? 'Update Application' : 'Submit Application'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MentorApplicationForm;
