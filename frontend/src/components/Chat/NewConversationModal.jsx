import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../Modal';
import { Search, Award, Users } from 'lucide-react';

const NewConversationModal = ({ isOpen, onClose, onSelectUser }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            };
            const { data } = await axios.get('http://localhost:5001/api/chat/users', config);
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Separate mentors (alumni) from students
    const mentors = filteredUsers.filter(user => user.role === 'alumni');
    const students = filteredUsers.filter(user => user.role === 'student');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Start New Conversation" size="md">
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="max-h-96 overflow-y-auto space-y-4">
                    {loading ? (
                        <div className="text-center py-4 text-gray-500">Loading users...</div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">No users found</div>
                    ) : (
                        <>
                            {/* Mentors Section */}
                            {mentors.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-2 px-2">
                                        <Award className="h-4 w-4 text-green-600" />
                                        <h3 className="text-sm font-semibold text-gray-700">Your Mentors</h3>
                                    </div>
                                    <div className="space-y-2">
                                        {mentors.map(user => (
                                            <button
                                                key={user._id}
                                                onClick={() => onSelectUser(user)}
                                                className="w-full flex items-center p-3 hover:bg-gray-50:bg-gray-700 rounded-lg transition-colors text-left"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold mr-3">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                    <div className="text-xs text-green-600 capitalize mt-0.5">Mentor</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Students Section */}
                            {students.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-2 px-2">
                                        <Users className="h-4 w-4 text-indigo-600" />
                                        <h3 className="text-sm font-semibold text-gray-700">Other Students</h3>
                                    </div>
                                    <div className="space-y-2">
                                        {students.map(user => (
                                            <button
                                                key={user._id}
                                                onClick={() => onSelectUser(user)}
                                                className="w-full flex items-center p-3 hover:bg-gray-50:bg-gray-700 rounded-lg transition-colors text-left"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold mr-3">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                    <div className="text-xs text-indigo-600 capitalize mt-0.5">Student</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default NewConversationModal;
