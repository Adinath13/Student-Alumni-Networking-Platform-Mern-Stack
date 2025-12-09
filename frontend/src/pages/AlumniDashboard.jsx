import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserCircle, Briefcase, Users, ArrowRight } from "lucide-react"
import EmailVerificationBanner from '../components/EmailVerificationBanner';

const AlumniDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back, {user?.name}. Manage your profile and mentorship.
                </p>
            </div>

            <EmailVerificationBanner />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Your Profile
                        </CardTitle>
                        <UserCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Update</div>
                        <p className="text-xs text-muted-foreground">
                            Keep your profile updated
                        </p>
                        <Button asChild className="mt-4 w-full" variant="outline">
                            <Link to="/profile">
                                Edit Profile <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Post a Job
                        </CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Hiring?</div>
                        <p className="text-xs text-muted-foreground">
                            Share opportunities with students
                        </p>
                        <Button asChild className="mt-4 w-full" variant="outline">
                            <Link to="/jobs">
                                Post Job <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Mentorship
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Guide</div>
                        <p className="text-xs text-muted-foreground">
                            Share your expertise
                        </p>
                        <div className="mt-4 flex flex-col gap-2">
                            <Button asChild className="w-full" variant="outline">
                                <Link to="/become-mentor">
                                    Become a Mentor <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild className="w-full" variant="ghost">
                                <Link to="/mentor-dashboard">
                                    Mentor Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AlumniDashboard;

