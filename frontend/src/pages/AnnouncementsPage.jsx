import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Megaphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const { user } = useAuth();
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const { data } = await axios.get('/announcements');
            setAnnouncements(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/announcements', newAnnouncement);
            setNewAnnouncement({ title: '', content: '' });
            fetchAnnouncements();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>

            {['admin', 'tpo'].includes(user?.role) && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Post Announcement</h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Title"
                            className="w-full border p-2 rounded"
                            value={newAnnouncement.title}
                            onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                            required
                        />
                        <textarea
                            placeholder="Content"
                            className="w-full border p-2 rounded"
                            value={newAnnouncement.content}
                            onChange={e => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                            required
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-white rounded hover:bg-indigo-700"
                        >
                            Post
                        </button>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {announcements.map((announcement) => (
                    <div key={announcement._id} className="bg-white shadow rounded-lg p-6 border-l-4 border-primary">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <Megaphone className="h-6 w-6 text-primary" />
                            </div>
                            <div className="ml-3 w-full">
                                <h3 className="text-lg font-medium text-gray-900">{announcement.title}</h3>
                                <div className="mt-2 text-gray-600">
                                    <p>{announcement.content}</p>
                                </div>
                                <div className="mt-4 text-sm text-gray-500">
                                    Posted by {announcement.postedBy?.name} on {new Date(announcement.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnnouncementsPage;
