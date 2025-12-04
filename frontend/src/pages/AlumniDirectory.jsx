import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { Search, MapPin, Briefcase, Award } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const AlumniDirectory = () => {
    const [alumni, setAlumni] = useState([]);
    const [mentorApplications, setMentorApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            console.log('🔄 Fetching alumni data...');
            console.log('API Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:5001/api');

            const [alumniRes, mentorRes] = await Promise.all([
                axios.get('/alumni'),
                axios.get('/mentor-applications/verified/all')
            ]);

            console.log('✅ Alumni data received:', {
                count: alumniRes.data.length,
                sample: alumniRes.data[0] ? {
                    name: alumniRes.data[0].user?.name,
                    company: alumniRes.data[0].currentCompany
                } : 'No data'
            });
            console.log('✅ Mentor applications received:', mentorRes.data.length);

            setAlumni(alumniRes.data);
            setMentorApplications(mentorRes.data);
            setLoading(false);
        } catch (error) {
            console.error('❌ Error fetching data:');
            console.error('   Message:', error.message);
            console.error('   Response:', error.response?.data);
            console.error('   Status:', error.response?.status);
            console.error('   Full error:', error);

            toast({
                title: "Error Loading Data",
                description: error.response?.data?.message || error.message || "Failed to load alumni directory. Please check your connection.",
                variant: "destructive"
            });

            setLoading(false);
        }
    };

    const isMentor = (alumniUserId) => {
        return mentorApplications.some(
            app => app.user?._id === alumniUserId && app.status === 'approved'
        );
    };

    const handleAlumniClick = (profile) => {
        if (isMentor(profile.user._id)) {
            navigate('/mentorship');
        } else {
            toast({
                title: "Info",
                description: "This alumni is not an approved mentor",
            });
        }
    };

    const filteredAlumni = alumni.filter(profile =>
        (profile.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (profile.currentCompany || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (profile.skills || []).some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Alumni Directory</h1>
                    <p className="text-muted-foreground">
                        Connect with alumni from your network.
                    </p>
                </div>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search alumni..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="overflow-hidden">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-3 w-3/4" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredAlumni.map((profile) => {
                        const isApprovedMentor = isMentor(profile.user._id);
                        return (
                            <Card
                                key={profile._id}
                                className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                onClick={() => handleAlumniClick(profile)}
                            >
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 border-2 border-background">
                                            <AvatarImage src={profile.user.profilePicture} alt={profile.user.name} />
                                            <AvatarFallback>{profile.user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                                                {profile.user.name}
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                {profile.designation}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    {isApprovedMentor && (
                                        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                                            <Award className="h-3 w-3 mr-1" />
                                            Mentor
                                        </Badge>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-4 pt-4">
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="h-4 w-4 text-muted-foreground/70" />
                                            <span>{profile.currentCompany || 'Not specified'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground/70" />
                                            <span>{profile.location || 'Location not set'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 pt-2">
                                        {profile.skills.slice(0, 3).map((skill, index) => (
                                            <Badge key={index} variant="outline" className="text-xs font-normal">
                                                {skill}
                                            </Badge>
                                        ))}
                                        {profile.skills.length > 3 && (
                                            <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                                                +{profile.skills.length - 3}
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AlumniDirectory;

