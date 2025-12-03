import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ChatProvider } from '../context/ChatContext';
import ConversationList from '../components/Chat/ConversationList';
import ChatWindow from '../components/Chat/ChatWindow';
import '../styles/messaging.css';

const MessagingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Redirect admin and TPO to message management
    useEffect(() => {
        if (user?.role === 'admin' || user?.role === 'tpo') {
            navigate('/message-management');
        }
    }, [user, navigate]);

    // Don't render anything while redirecting
    if (user?.role === 'admin' || user?.role === 'tpo') {
        return null;
    }

    return (
        <ChatProvider>
            <div className="messaging-page">
                <ConversationList />
                <ChatWindow />
            </div>
        </ChatProvider>
    );
};

export default MessagingPage;
