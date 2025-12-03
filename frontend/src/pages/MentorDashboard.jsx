import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from '../context/AuthContext';
import { Users, CheckCircle, XCircle, Star, MessageCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

const MentorDashboard = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [requests, setRequests] = useState([]);
    const [activeMentees, setActiveMentees] = useState([]);
    const [mentorProfile, setMentorProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (user?.role === 'alumni') {
            fetchMentorProfile();
            fetchRequests();
            fetchActiveMentees();
        }
    }, [user]);

    const fetchMentorProfile = async () => {
        try {
            const { data } = await axios.get('/mentor-applications/me');
            setMentorProfile(data);
        } catch (error) {
            console.error('Error fetching mentor profile:', error);
        }
    };

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/mentorships');
            const pendingRequests = data.filter(m => m.status === 'pending');
            setRequests(pendingRequests);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchActiveMentees = async () => {
        try {
            const { data } = await axios.get('/mentorships/my-mentees');
            setActiveMentees(data);
        } catch (error) {
            console.error('Error fetching mentees:', error);
        }
    };

    const handleAccept = async (id) => {
        setActionLoading(true);
        try {
            await axios.put(`/mentorships/${id}/status`, { status: 'accepted' });
            toast({
                title: "Success",
                description: "Mentorship request accepted!",
            });
            fetchRequests();
            fetchActiveMentees();
            fetchMentorProfile();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || 'Failed to accept request',
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (id) => {
        const reason = window.prompt('Please provide a reason for rejection (optional):');

        setActionLoading(true);
        try {
            await axios.put(`/mentorships/${id}/status`, {
                status: 'rejected',
                rejectionReason: reason || 'Not available at this time'
            });
            toast({
                title: "Request Rejected",
                description: "The mentorship request has been rejected.",
            });
            fetchRequests();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || 'Failed to reject request',
            });
        } finally {
            setActionLoading(false);
        }
    };

    if (user?.role !== 'alumni') {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-muted-foreground">Only alumni can access the mentor dashboard.</p>
            </div>
        );
    }

    if (!mentorProfile || mentorProfile.status !== 'approved') {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle>Mentor Status</CardTitle>
                        <CardDescription>
                            {!mentorProfile
                                ? 'You have not applied to become a mentor yet.'
                                : `Your mentor application is ${mentorProfile.status}.`}
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Mentor Dashboard</h1>
                <p className="text-muted-foreground">
                    Manage your mentorship requests and active mentees
                </p>
            </div>

            {/* Mentor Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{requests.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Mentees</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mentorProfile.activeMentees}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Mentees</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mentorProfile.totalMentees}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rating</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mentorProfile.rating > 0 ? mentorProfile.rating.toFixed(1) : 'N/A'}</div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="requests" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="requests">
                        Mentee Requests
                        {requests.length > 0 && (
                            <Badge variant="secondary" className="ml-2">{requests.length}</Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="active">Active Mentees</TabsTrigger>
                    <TabsTrigger value="profile">My Profile</TabsTrigger>
                </TabsList>

                <TabsContent value="requests" className="space-y-4">
                    {loading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    ) : requests.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                <Users className="h-12 w-12 mb-4 opacity-20" />
                                <p>No pending mentorship requests</p>
                            </CardContent>
                        </Card>
                    ) : (
                        requests.map(request => (
                            <Card key={request._id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <Avatar>
                                                <AvatarImage src={request.student?.profilePicture} />
                                                <AvatarFallback>{request.student?.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <CardTitle className="text-base">{request.student?.name || 'Student'}</CardTitle>
                                                <CardDescription>{request.student?.email}</CardDescription>
                                            </div>
                                        </div>
                                        <Badge variant="outline">Requested {new Date(request.createdAt).toLocaleDateString()}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Area of Interest</p>
                                        <p className="text-sm text-muted-foreground">{request.areaOfExpertise}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Why they want mentorship</p>
                                        <p className="text-sm text-muted-foreground">{request.requestMessage}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Their Goals</p>
                                        <p className="text-sm text-muted-foreground">{request.studentGoals}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Additional Details</p>
                                        <p className="text-sm text-muted-foreground">{request.description}</p>
                                    </div>
                                </CardContent>
                                <div className="flex items-center justify-end gap-2 p-6 pt-0">
                                    <Button variant="destructive" size="sm" onClick={() => handleReject(request._id)} disabled={actionLoading}>
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Reject
                                    </Button>
                                    <Button size="sm" onClick={() => handleAccept(request._id)} disabled={actionLoading}>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Accept
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </TabsContent>

                <TabsContent value="active" className="space-y-4">
                    {activeMentees.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                <Users className="h-12 w-12 mb-4 opacity-20" />
                                <p>No active mentees yet</p>
                            </CardContent>
                        </Card>
                    ) : (
                        activeMentees.map(mentee => (
                            <Card key={mentee._id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <Avatar>
                                                <AvatarImage src={mentee.student?.profilePicture} />
                                                <AvatarFallback>{mentee.student?.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <CardTitle className="text-base">{mentee.student?.name || 'Student'}</CardTitle>
                                                <CardDescription>{mentee.student?.email}</CardDescription>
                                            </div>
                                        </div>
                                        <Badge variant={mentee.status === 'active' ? 'default' : 'secondary'}>
                                            {mentee.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Mentorship Focus</p>
                                        <p className="text-sm text-muted-foreground">{mentee.areaOfExpertise}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Student Goals</p>
                                        <p className="text-sm text-muted-foreground">{mentee.studentGoals}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Started</p>
                                        <p className="text-sm text-muted-foreground">{new Date(mentee.startDate).toLocaleDateString()}</p>
                                    </div>
                                    {mentee.rating && (
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Rating</p>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
                                                {mentee.rating}/5
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                                {mentee.status === 'active' && (
                                    <div className="flex items-center justify-end gap-2 p-6 pt-0">
                                        <Button size="sm" variant="secondary" onClick={() => window.location.href = `/messages?userId=${mentee.student._id}`}>
                                            <MessageCircle className="mr-2 h-4 w-4" />
                                            Chat
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        ))
                    )}
                </TabsContent>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mentor Profile</CardTitle>
                            <CardDescription>Your public mentor profile details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Current Position</p>
                                    <p className="text-sm text-muted-foreground">{mentorProfile.currentRole} at {mentorProfile.currentCompany}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Experience</p>
                                    <p className="text-sm text-muted-foreground">{mentorProfile.experience?.years} years</p>
                                    <p className="text-xs text-muted-foreground">{mentorProfile.experience?.description}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Areas of Expertise</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {mentorProfile.domain?.map((domain, idx) => (
                                            <Badge key={idx} variant="outline">{domain}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Availability</p>
                                    <p className="text-sm text-muted-foreground">{mentorProfile.availability?.hoursPerWeek} hours per week</p>
                                    {mentorProfile.availability?.preferredDays?.length > 0 && (
                                        <p className="text-xs text-muted-foreground">Preferred days: {mentorProfile.availability.preferredDays.join(', ')}</p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Bio</p>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{mentorProfile.bio}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Links</p>
                                <div className="flex gap-4 text-sm">
                                    <a href={mentorProfile.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">LinkedIn Profile</a>
                                    {mentorProfile.portfolio && (
                                        <a href={mentorProfile.portfolio} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Portfolio</a>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MentorDashboard;

