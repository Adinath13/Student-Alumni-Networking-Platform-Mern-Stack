import { useState } from 'react';
import axios from '../utils/axios';
import { useToast } from '../context/ToastContext';
import Modal from './Modal';
import Button from './Button';

const MentorshipRequestModal = ({ isOpen, onClose, mentorId, mentorName, mentorDomains }) => {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        areaOfExpertise: '',
        requestMessage: '',
        studentGoals: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('/mentorships', {
                mentorId,
                areaOfExpertise: formData.areaOfExpertise,
                requestMessage: formData.requestMessage,
                studentGoals: formData.studentGoals,
                description: formData.description
            });
            showToast('Mentorship request sent successfully!', 'success');
            handleClose();
        } catch (error) {
            console.error(error);
            showToast(error.response?.data?.message || 'Failed to send request', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            areaOfExpertise: '',
            requestMessage: '',
            studentGoals: '',
            description: ''
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={`Request Mentorship from ${mentorName}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Area of Expertise <span className="text-red-500">*</span>
                    </label>
                    {mentorDomains && mentorDomains.length > 0 ? (
                        <select
                            value={formData.areaOfExpertise}
                            onChange={(e) => setFormData({ ...formData, areaOfExpertise: e.target.value })}
                            className="input w-full"
                            required
                        >
                            <option value="">Select an area</option>
                            {mentorDomains.map((domain, index) => (
                                <option key={index} value={domain}>{domain}</option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type="text"
                            value={formData.areaOfExpertise}
                            onChange={(e) => setFormData({ ...formData, areaOfExpertise: e.target.value })}
                            className="input w-full"
                            placeholder="e.g., Web Development, Data Science, Career Guidance"
                            required
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Why do you want this mentorship? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={formData.requestMessage}
                        onChange={(e) => setFormData({ ...formData, requestMessage: e.target.value })}
                        className="input w-full"
                        rows="3"
                        placeholder="Tell the mentor why you're seeking their guidance..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Your Goals <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={formData.studentGoals}
                        onChange={(e) => setFormData({ ...formData, studentGoals: e.target.value })}
                        className="input w-full"
                        rows="3"
                        placeholder="What do you hope to achieve through this mentorship?"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Additional Details <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="input w-full"
                        rows="4"
                        placeholder="Any additional information about your background, current situation, or specific areas you'd like help with..."
                        required
                    />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Request'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default MentorshipRequestModal;
