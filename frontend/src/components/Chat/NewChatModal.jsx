import { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import axios from 'axios';
import { X, Search } from 'lucide-react';

const NewChatModal = ({ isOpen, onClose }) => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const { createConversation } = useChat();

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
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartChat = (userId) => {
        createConversation(userId);
        onClose();
        setSearchTerm('');
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Start New Chat</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="search-container">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search users by name or role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="modal-search-input"
                            autoFocus
                        />
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <p>Loading users...</p>
                        </div>
                    ) : (
                        <div className="users-list">
                            {filteredUsers.length === 0 ? (
                                <p className="no-users">No users found</p>
                            ) : (
                                filteredUsers.map((user) => (
                                    <div
                                        key={user._id}
                                        className="user-card"
                                        onClick={() => handleStartChat(user._id)}
                                    >
                                        <div className="user-avatar">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="user-info">
                                            <h3 className="user-name">{user.name}</h3>
                                            <span className="user-role">{user.role}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewChatModal;
