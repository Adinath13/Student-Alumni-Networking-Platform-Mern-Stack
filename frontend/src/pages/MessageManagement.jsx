import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Search, X, Users } from 'lucide-react';

const MessageManagement = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAllConversations();
    }, []);

    const fetchAllConversations = async () => {
        try {
            const { data } = await axios.get('/messages/admin/all-conversations');
            setConversations(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching conversations:', error);
            setLoading(false);
        }
    };

    const fetchConversationDetails = async (conversationId) => {
        try {
            const { data } = await axios.get(`/messages/admin/conversation/${conversationId}`);
            setSelectedConversation(data.conversation);
            setMessages(data.messages);
        } catch (error) {
            console.error('Error fetching conversation details:', error);
        }
    };

    const handleConversationClick = (conversation) => {
        fetchConversationDetails(conversation._id);
    };

    const filteredConversations = conversations.filter(conv => {
        const searchLower = searchTerm.toLowerCase();
        return conv.participants && conv.participants.some(p =>
            (p.name && p.name.toLowerCase().includes(searchLower)) ||
            (p.email && p.email.toLowerCase().includes(searchLower))
        );
    });

    const getOtherParticipant = (participants, currentUserId) => {
        return participants.find(p => p._id !== currentUserId);
    };

    if (user?.role !== 'admin' && user?.role !== 'tpo') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
                    <p className="text-gray-600 mt-2">This page is only accessible to Admin and TPO users.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            <div className="bg-white shadow-sm border-b px-6 py-4">
                <h1 className="text-2xl font-bold text-gray-900">Message Management</h1>
                <p className="text-gray-600 text-sm mt-1">View and monitor all conversations (Read-only)</p>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Conversations List */}
                <div className="w-1/3 border-r bg-white flex flex-col">
                    <div className="p-4 border-b">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="text-center py-8 text-gray-500">Loading conversations...</div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                                <p>No conversations found</p>
                            </div>
                        ) : (
                            filteredConversations.map((conversation) => (
                                <div
                                    key={conversation._id}
                                    onClick={() => handleConversationClick(conversation)}
                                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${selectedConversation?._id === conversation._id ? 'bg-indigo-50' : ''
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Users className="h-4 w-4 text-gray-400" />
                                                <span className="font-medium text-gray-900">
                                                    {conversation.participants.map(p => p.name).join(' & ')}
                                                </span>
                                            </div>
                                            <div className="flex gap-2 text-xs text-gray-500">
                                                {conversation.participants.map((p, idx) => (
                                                    <span key={p._id} className="capitalize">
                                                        {p.role}
                                                        {idx < conversation.participants.length - 1 && ' •'}
                                                    </span>
                                                ))}
                                            </div>
                                            {conversation.lastMessage && (
                                                <p className="text-sm text-gray-600 mt-1 truncate">
                                                    {conversation.lastMessage.content || conversation.lastMessage.text || 'No messages yet'}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Date(conversation.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Messages View */}
                <div className="flex-1 flex flex-col bg-gray-50">
                    {selectedConversation ? (
                        <>
                            <div className="bg-white border-b px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {selectedConversation.participants.map(p => p.name).join(' & ')}
                                        </h2>
                                        <div className="flex gap-2 text-sm text-gray-500 mt-1">
                                            {selectedConversation.participants.map((p, idx) => (
                                                <span key={p._id} className="capitalize">
                                                    {p.name} ({p.role})
                                                    {idx < selectedConversation.participants.length - 1 && ' •'}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedConversation(null)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {messages.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8">No messages in this conversation</div>
                                ) : (
                                    messages.map((message) => {
                                        const isSender = message.sender?._id === selectedConversation.participants[0]?._id;
                                        return (
                                            <div key={message._id} className={`flex ${isSender ? 'justify-start' : 'justify-end'}`}>
                                                <div className={`max-w-[70%] ${isSender ? '' : 'flex flex-col items-end'}`}>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium text-sm text-gray-900">{message.sender?.name}</span>
                                                        <span className="text-xs text-gray-500 capitalize">({message.sender?.role})</span>
                                                        <span className="text-xs text-gray-400">
                                                            {new Date(message.createdAt).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className={`rounded-lg p-3 shadow-sm ${isSender
                                                                ? 'bg-white'
                                                                : 'bg-green-100'
                                                            }`}
                                                        style={{ borderTopLeftRadius: isSender ? '0' : '8px', borderTopRightRadius: isSender ? '8px' : '0' }}
                                                    >
                                                        <p className="text-gray-800">{message.content || message.text || 'No content'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="bg-white border-t px-6 py-4">
                                <div className="bg-gray-100 rounded-lg p-3 text-center text-gray-600 text-sm">
                                    <MessageSquare className="inline-block h-4 w-4 mr-2" />
                                    Read-only mode - You cannot send messages
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <MessageSquare className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Conversation Selected</h3>
                                <p>Select a conversation from the list to view messages</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageManagement;
