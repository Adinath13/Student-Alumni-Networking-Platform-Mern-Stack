import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Briefcase, Calendar, ArrowRight } from "lucide-react"
import EmailVerificationBanner from '../components/EmailVerificationBanner';

const StudentDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back, {user?.name}. Here's an overview of your network.
                </p>
            </div>

            <EmailVerificationBanner />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Find Mentors
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Connect</div>
                        <p className="text-xs text-muted-foreground">
                            Get guidance from experienced alumni
                        </p>
                        <Button asChild className="mt-4 w-full" variant="outline">
                            <Link to="/directory">
                                Browse Directory <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Jobs & Internships
                        </CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Explore</div>
                        <p className="text-xs text-muted-foreground">
                            Apply for opportunities posted by alumni
                        </p>
                        <Button asChild className="mt-4 w-full" variant="outline">
                            <Link to="/jobs">
                                View Jobs <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Upcoming Events
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Participate</div>
                        <p className="text-xs text-muted-foreground">
                            Register for webinars and workshops
                        </p>
                        <Button asChild className="mt-4 w-full" variant="outline">
                            <Link to="/events">
                                View Events <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Add more sections like Recent Activity, Recommended Mentors etc. later */}
        </div>
    );
};

export default StudentDashboard;

