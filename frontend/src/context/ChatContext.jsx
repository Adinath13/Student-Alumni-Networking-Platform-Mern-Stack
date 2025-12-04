import { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import axios from '../utils/axios';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);

    // Fetch Conversations - memoized with useCallback to prevent infinite loops
    const fetchConversations = useCallback(async () => {
        if (!user) return;

        try {
            const { data } = await axios.get('/chat/conversations');

            console.log('[ChatContext] Fetched conversations:', data);
            console.log('[ChatContext] Number of conversations:', data.length);

            // Filter out any conversations that might include admin users
            // Only filter if participants are populated
            const filteredConversations = data.filter(conv => {
                if (!conv.participants || conv.participants.length === 0) {
                    console.warn('[ChatContext] Conversation missing participants:', conv);
                    return false;
                }

                // Check if any participant is an admin
                const hasAdmin = conv.participants.some(p => p && p.role === 'admin');
                if (hasAdmin) {
                    console.log('[ChatContext] Filtering out conversation with admin:', conv._id);
                }
                return !hasAdmin;
            });

            console.log('[ChatContext] Filtered conversations:', filteredConversations);
            console.log('[ChatContext] Number of filtered conversations:', filteredConversations.length);
            setConversations(filteredConversations);
        } catch (error) {
            console.error("[ChatContext] Error fetching conversations:", error);
            console.error("[ChatContext] Error response:", error.response?.data);
        }
    }, [user]);

    // Initialize Socket
    useEffect(() => {
        if (user) {
            const newSocket = io(API_URL);
            setSocket(newSocket);

            newSocket.emit('join_chat', user._id);

            // Note: receive_message listener is handled in a separate useEffect below
            // to correctly access activeConversationIdRef

            return () => newSocket.close();
        }
    }, [user]);

    // We need a ref to track the active conversation ID for the socket listener
    const activeConversationIdRef = useRef(null);

    useEffect(() => {
        activeConversationIdRef.current = activeConversation?._id;
    }, [activeConversation]);

    // Re-implementing the socket listener with the Ref approach
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message) => {
            const currentConversationId = activeConversationIdRef.current;

            // Only add message if it belongs to the active conversation
            if (currentConversationId && message.conversationId === currentConversationId) {
                setMessages((prev) => {
                    if (prev.some(m => m._id === message._id)) return prev;
                    return [...prev, message];
                });
            }

            // Update conversation list to show new message preview
            // But use state updater to avoid fetching from server
            setConversations((prevConversations) => {
                return prevConversations.map(conv => {
                    if (conv._id === message.conversationId) {
                        return {
                            ...conv,
                            lastMessage: message,
                            updatedAt: new Date()
                        };
                    }
                    return conv;
                });
            });
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [socket]);

    // Fetch Messages
    const fetchMessages = useCallback(async (conversationId) => {
        try {
            console.log('[ChatContext] Fetching messages for conversation:', conversationId);
            const { data } = await axios.get(`/chat/messages/${conversationId}`);
            console.log('[ChatContext] Fetched messages:', data);
            console.log('[ChatContext] Number of messages:', data.length);
            setMessages(data);

            const conversation = conversations.find(c => c._id === conversationId);
            console.log('[ChatContext] Setting active conversation:', conversation);
            setActiveConversation(conversation);
        } catch (error) {
            console.error("[ChatContext] Error fetching messages:", error);
            console.error("[ChatContext] Error response:", error.response?.data);
        }
    }, [conversations]);

    // Send Message
    const sendMessage = useCallback(async (conversationId, text, receiverId) => {
        try {
            console.log('[ChatContext] Sending message:', { conversationId, text, receiverId });
            const { data } = await axios.post('/chat/message', {
                conversationId,
                text
            });

            console.log('[ChatContext] Message sent successfully:', data);

            // Emit socket event
            if (socket) {
                socket.emit('send_message', { ...data, receiver: receiverId });
                console.log('[ChatContext] Socket event emitted to receiver:', receiverId);
            } else {
                console.warn('[ChatContext] Socket not available, message not emitted via socket');
            }

            // Update messages locally
            setMessages(prev => [...prev, data]);

            // Update conversation list locally instead of fetching
            setConversations(prevConversations => {
                return prevConversations.map(conv => {
                    if (conv._id === conversationId) {
                        return {
                            ...conv,
                            lastMessage: data,
                            updatedAt: new Date()
                        };
                    }
                    return conv;
                });
            });
        } catch (error) {
            console.error("[ChatContext] Error sending message:", error);
            console.error("[ChatContext] Error response:", error.response?.data);
        }
    }, [socket]);

    // Create or Get Conversation
    const createConversation = useCallback(async (receiverId) => {
        try {
            const { data } = await axios.post('/chat/conversation', { receiverId });

            // Check if it already exists in list
            if (!conversations.find(c => c._id === data._id)) {
                setConversations([data, ...conversations]);
            }

            setActiveConversation(data);
            fetchMessages(data._id);
        } catch (error) {
            console.error("Error creating conversation", error);
        }
    }, [conversations, fetchMessages]);

    // Fetch conversations only once when user is available
    useEffect(() => {
        if (user) {
            fetchConversations();
        }
    }, [user, fetchConversations]);

    return (
        <ChatContext.Provider value={{
            socket,
            conversations,
            activeConversation,
            messages,
            fetchMessages,
            sendMessage,
            createConversation,
            setActiveConversation
        }}>
            {children}
        </ChatContext.Provider>
    );
};
