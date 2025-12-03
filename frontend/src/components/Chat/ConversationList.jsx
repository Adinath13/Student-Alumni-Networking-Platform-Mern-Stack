import { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { Plus } from 'lucide-react';
import NewConversationModal from './NewConversationModal';

const ConversationList = () => {
    const { conversations, fetchMessages, activeConversation, createConversation } = useChat();
    const [searchTerm, setSearchTerm] = useState('');
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

    const handleSelectConversation = (conversation) => {
        fetchMessages(conversation._id);
    };

    const handleStartNewChat = (user) => {
        createConversation(user._id);
        setIsNewChatModalOpen(false);
    };

    const filteredConversations = conversations.filter(conv => {
        const otherParticipant = conv.participants.find(p => p._id !== localStorage.getItem('userId'));
        return otherParticipant?.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="conversation-list">
            <div className="conversation-header">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold m-0">Messages</h2>
                    <button
                        onClick={() => setIsNewChatModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                        <Plus size={16} />
                        New
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            <div className="conversations bg-blue-50 flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                    <p className="no-conversations">No conversations yet</p>
                ) : (
                    filteredConversations.map((conversation) => {
                        const otherParticipant = conversation.participants.find(
                            p => p._id !== localStorage.getItem('userId')
                        );

                        return (
                            <div
                                key={conversation._id}
                                className={`conversation-item ${activeConversation?._id === conversation._id ? 'active' : ''}`}
                                onClick={() => handleSelectConversation(conversation)}
                            >
                                <div className="conversation-avatar bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                                    {otherParticipant?.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="conversation-info bg-blue-50 p-2 rounded-md">
                                    <div className="conversation-name bg-blue-50 font-medium text-blue-900">
                                        {otherParticipant?.name}
                                        <span className="conversation-role bg-blue-50 text-sm text-blue-700 ml-2">
                                            {otherParticipant?.role}
                                        </span>
                                    </div>
                                    <div className="conversation-last-message bg-blue-50 text-sm text-blue-800">
                                        {conversation.lastMessage?.text || 'Start a conversation'}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <NewConversationModal
                isOpen={isNewChatModalOpen}
                onClose={() => setIsNewChatModalOpen(false)}
                onSelectUser={handleStartNewChat}
            />
        </div>
    );
};

export default ConversationList;
