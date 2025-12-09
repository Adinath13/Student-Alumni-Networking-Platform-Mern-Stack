import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Edit, Save, X, Mail, Briefcase, GraduationCap, Calendar, ShieldCheck, ShieldAlert, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const ProfilePage = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [sendingVerification, setSendingVerification] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [user]);

    const fetchProfile = async () => {
        if (!user) return;

        // Only allow students and alumni to have profiles
        const allowedRoles = ['student', 'alumni'];
        if (!allowedRoles.includes(user.role.toLowerCase())) {
            setLoading(false);
            return;
        }

        try {
            const endpoint = user.role.toLowerCase() === 'alumni' ? '/alumni/me' : '/students/me';
            const { data } = await axios.get(endpoint);
            if (data) {
                setProfile(data);
                setFormData(data);
            } else {
                setProfile(null);
                setFormData({});
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            if (error.response?.status === 403) {
                console.error('Access denied. Please check your permissions.');
            } else if (error.response?.status === 401) {
                console.error('Please login to view your profile.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields for students
        if (user.role.toLowerCase() === 'student') {
            if (!formData.batch || !formData.course || !formData.branch) {
                toast({
                    variant: "destructive",
                    title: "Validation Error",
                    description: "Please fill in all required fields: Batch, Course, and Branch",
                });
                return;
            }
        }

        try {
            const endpoint = user.role.toLowerCase() === 'alumni' ? '/alumni' : '/students';
            const { data } = await axios.put(endpoint, formData);
            setProfile(data);
            setIsEditing(false);
            toast({
                title: "Success",
                description: "Profile updated successfully!",
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to update profile. Please try again.';
            toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage,
            });
        }
    };

    const handleResendVerification = async () => {
        setSendingVerification(true);
        try {
            const { data } = await axios.post('/auth/resend-verification', { email: user.email });
            toast({
                title: "Success",
                description: data.message || "Verification email sent! Please check your inbox.",
            });
        } catch (error) {
            console.error("Error sending verification email:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to send verification email. Please try again.",
            });
        } finally {
            setSendingVerification(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-20 w-20 rounded-full mx-auto" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!['student', 'alumni'].includes(user.role.toLowerCase())) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-muted/50 p-4 rounded-full mb-4">
                        <GraduationCap className="h-8 w-8 opacity-50" />
                    </div>
                    <CardTitle className="mb-2">Profile Management Unavailable</CardTitle>
                    <CardDescription className="max-w-md">
                        Profile management is currently only available for Students and Alumni.
                        As a {user.role}, you can manage other aspects of the platform from your dashboard.
                    </CardDescription>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your personal information and preferences
                    </p>
                </div>
                <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? "outline" : "default"}
                >
                    {isEditing ? (
                        <>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </>
                    ) : (
                        <>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Profile
                        </>
                    )}
                </Button>
            </div>

            {isEditing ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Profile</CardTitle>
                        <CardDescription>Update your profile information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="batch">Batch/Year *</Label>
                                    <Input
                                        id="batch"
                                        type="number"
                                        name="batch"
                                        value={formData.batch || ''}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., 2024"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="branch">Branch *</Label>
                                    <Input
                                        id="branch"
                                        type="text"
                                        name="branch"
                                        value={formData.branch || ''}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., Computer Science"
                                    />
                                </div>
                                {user.role.toLowerCase() === 'alumni' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="degree">Degree</Label>
                                            <Input
                                                id="degree"
                                                type="text"
                                                name="degree"
                                                value={formData.degree || ''}
                                                onChange={handleChange}
                                                placeholder="e.g., B.Tech"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="currentCompany">Current Company</Label>
                                            <Input
                                                id="currentCompany"
                                                type="text"
                                                name="currentCompany"
                                                value={formData.currentCompany || ''}
                                                onChange={handleChange}
                                                placeholder="e.g., Google"
                                            />
                                        </div>
                                    </>
                                )}
                                {user.role.toLowerCase() === 'student' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="course">Course *</Label>
                                        <Input
                                            id="course"
                                            type="text"
                                            name="course"
                                            value={formData.course || ''}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g., B.Tech"
                                        />
                                    </div>
                                )}
                            </div>
                            <Button type="submit" className="w-full sm:w-auto">
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader className="text-center border-b">
                        <div className="flex flex-col items-center space-y-4 pb-4">
                            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                                <AvatarImage src={profile?.user?.profilePicture} alt={profile?.user?.name} />
                                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                    {profile?.user?.name?.charAt(0) || user.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-2xl">{profile?.user?.name || user.name}</CardTitle>
                                <CardDescription className="text-base mt-1 capitalize">
                                    {user.role}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {!profile ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>Please complete your profile by clicking "Edit Profile" above.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
                                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm text-foreground truncate">{profile.user?.email}</p>
                                            {user.isEmailVerified ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                    <ShieldCheck className="h-3 w-3" />
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                                    <ShieldAlert className="h-3 w-3" />
                                                    Unverified
                                                </span>
                                            )}
                                        </div>
                                        {!user.isEmailVerified && (
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="h-auto p-0 mt-1 text-xs"
                                                onClick={handleResendVerification}
                                                disabled={sendingVerification}
                                            >
                                                {sendingVerification ? (
                                                    <>Sending...</>
                                                ) : (
                                                    <>
                                                        <Send className="h-3 w-3 mr-1" />
                                                        Verify Email
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
                                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-muted-foreground">Batch</p>
                                        <p className="text-sm text-foreground">{profile.batch}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
                                    <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-muted-foreground">Branch</p>
                                        <p className="text-sm text-foreground">{profile.branch}</p>
                                    </div>
                                </div>
                                {user.role.toLowerCase() === 'student' && profile.course && (
                                    <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
                                        <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-muted-foreground">Course</p>
                                            <p className="text-sm text-foreground">{profile.course}</p>
                                        </div>
                                    </div>
                                )}
                                {user.role.toLowerCase() === 'alumni' && profile.currentCompany && (
                                    <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
                                        <Briefcase className="h-5 w-5 text-primary mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-muted-foreground">Current Company</p>
                                            <p className="text-sm text-foreground">{profile.currentCompany}</p>
                                        </div>
                                    </div>
                                )}
                                {user.role.toLowerCase() === 'alumni' && profile.degree && (
                                    <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
                                        <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-muted-foreground">Degree</p>
                                            <p className="text-sm text-foreground">{profile.degree}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ProfilePage;

