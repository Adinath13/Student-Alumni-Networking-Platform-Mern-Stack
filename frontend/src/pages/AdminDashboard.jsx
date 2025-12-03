import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { Users, Briefcase, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        jobs: 0,
        events: 0,
        donations: 0
    });

    useEffect(() => {
        // In a real app, you'd fetch these stats from an API
        // For now, we'll just simulate or fetch what we can
        const fetchStats = async () => {
            try {
                const [users, jobs, events, donations] = await Promise.all([
                    axios.get('/users'),
                    axios.get('/jobs'),
                    axios.get('/events'),
                    axios.get('/donations')
                ]);
                setStats({
                    users: users.data.length,
                    jobs: jobs.data.length,
                    events: events.data.length,
                    donations: donations.data.length
                });
            } catch (error) {
                console.error("Error fetching stats", error);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { title: 'Total Users', value: stats.users, icon: Users, description: "Active users on platform" },
        { title: 'Active Jobs', value: stats.jobs, icon: Briefcase, description: "Open positions" },
        { title: 'Upcoming Events', value: stats.events, icon: Calendar, description: "Scheduled events" },
        { title: 'Total Donations', value: stats.donations, icon: DollarSign, description: "Contributions received" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of platform activity and quick actions.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => (
                    <Card key={card.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {card.title}
                            </CardTitle>
                            <card.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{card.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {card.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Manage your platform efficiently</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Button asChild variant="outline" className="h-auto flex-col items-start p-4 space-y-2">
                            <Link to="/admin/users" className="w-full">
                                <div className="font-semibold flex items-center">
                                    Manage Users <ArrowRight className="ml-2 h-4 w-4" />
                                </div>
                                <span className="text-xs text-muted-foreground font-normal text-left block">
                                    View, approve, or suspend users
                                </span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-auto flex-col items-start p-4 space-y-2">
                            <Link to="/announcements" className="w-full">
                                <div className="font-semibold flex items-center">
                                    Post Announcement <ArrowRight className="ml-2 h-4 w-4" />
                                </div>
                                <span className="text-xs text-muted-foreground font-normal text-left block">
                                    Notify all users
                                </span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-auto flex-col items-start p-4 space-y-2">
                            <Link to="/events" className="w-full">
                                <div className="font-semibold flex items-center">
                                    Review Events <ArrowRight className="ml-2 h-4 w-4" />
                                </div>
                                <span className="text-xs text-muted-foreground font-normal text-left block">
                                    Manage upcoming events
                                </span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-auto flex-col items-start p-4 space-y-2">
                            <Link to="/message-management" className="w-full">
                                <div className="font-semibold flex items-center">
                                    View All Chats <ArrowRight className="ml-2 h-4 w-4" />
                                </div>
                                <span className="text-xs text-muted-foreground font-normal text-left block">
                                    Monitor user conversations
                                </span>
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;

