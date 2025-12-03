import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { UserCheck, Star, Briefcase, Clock, Search } from 'lucide-react';
import MentorshipRequestModal from '../components/MentorshipRequestModal';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

const MentorshipPage = () => {
    const { user } = useAuth();
    const [mentors, setMentors] = useState([]);
    const [filteredMentors, setFilteredMentors] = useState([]);
    const [myMentorships, setMyMentorships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDomain, setSelectedDomain] = useState('All');

    const domainOptions = [
        'All',
        'AI/ML',
        'Web Development',
        'Mobile Development',
        'Cloud Computing',
        'Cybersecurity',
        'Data Science',
        'DevOps',
        'Blockchain',
        'UI/UX Design',
        'Product Management',
        'Career Guidance',
        'Interview Preparation',
        'Resume Building',
        'Other'
    ];

    useEffect(() => {
        fetchMentors();
        fetchMyMentorships();
    }, []);

    useEffect(() => {
        filterMentors();
    }, [searchTerm, selectedDomain, mentors]);

    const fetchMentors = async () => {
        try {
            const { data } = await axios.get('/mentor-applications/verified/all');
            setMentors(data);
            setFilteredMentors(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const fetchMyMentorships = async () => {
        try {
            const { data } = await axios.get('/mentorships');
            setMyMentorships(data);
        } catch (error) {
            console.error('Error fetching mentorships:', error);
        }
    };

    const filterMentors = () => {
        let filtered = mentors;

        // Filter by domain
        if (selectedDomain && selectedDomain !== 'All') {
            filtered = filtered.filter(mentor =>
                mentor.domain && mentor.domain.includes(selectedDomain)
            );
        }

        // Filter by search term
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(mentor =>
                mentor.user?.name?.toLowerCase().includes(searchLower) ||
                mentor.currentCompany?.toLowerCase().includes(searchLower) ||
                mentor.currentRole?.toLowerCase().includes(searchLower)
            );
        }

        setFilteredMentors(filtered);
    };

    const handleRequestMentorship = (mentor) => {
        setSelectedMentor(mentor);
        setShowModal(true);
    };

    const renderStars = (rating) => {
        return (
            <div className="flex items-center space-x-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground/30'
                            }`}
                    />
                ))}
                <span className="text-xs text-muted-foreground ml-1.5 font-medium">
                    {rating > 0 ? rating.toFixed(1) : 'New'}
                </span>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2 text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Find a Mentor
                </h1>
                <p className="text-lg text-muted-foreground">
                    Connect with experienced alumni who can guide you in your career path.
                </p>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Search
                            </label>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, company, or role..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Domain
                            </label>
                            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select domain" />
                                </SelectTrigger>
                                <SelectContent>
                                    {domainOptions.map(domain => (
                                        <SelectItem key={domain} value={domain}>
                                            {domain}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-center">
                                    <Skeleton className="h-16 w-16 rounded-full" />
                                </div>
                                <div className="space-y-2 text-center mt-4">
                                    <Skeleton className="h-4 w-32 mx-auto" />
                                    <Skeleton className="h-3 w-24 mx-auto" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : filteredMentors.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <div className="bg-muted/50 p-4 rounded-full mb-4">
                        <UserCheck className="h-8 w-8 opacity-50" />
                    </div>
                    <p className="text-lg font-medium">No mentors found</p>
                    <p className="text-sm">
                        {searchTerm || selectedDomain !== 'All'
                            ? 'Try adjusting your search or filters.'
                            : 'No verified mentors available yet.'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredMentors.map((mentor) => (
                        <Card key={mentor._id} className="overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300">
                            <CardHeader className="pb-4">
                                <div className="flex flex-col items-center text-center">
                                    <Avatar className="h-20 w-20 border-4 border-background shadow-sm mb-4">
                                        <AvatarImage src={mentor.user?.profilePicture} alt={mentor.user?.name} />
                                        <AvatarFallback className="text-xl bg-primary/10 text-primary">
                                            {mentor.user?.name?.charAt(0) || 'M'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <CardTitle className="text-lg">{mentor.user?.name || 'Mentor'}</CardTitle>
                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                        <Briefcase className="h-3.5 w-3.5 mr-1" />
                                        {mentor.currentRole}
                                    </div>
                                    <div className="text-sm font-medium text-foreground/80 mt-0.5">
                                        {mentor.currentCompany}
                                    </div>
                                    <div className="mt-2">
                                        {renderStars(mentor.rating || 0)}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4 pb-4">
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Expertise</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {mentor.domain && mentor.domain.length > 0 ? (
                                            mentor.domain.slice(0, 3).map((domain, index) => (
                                                <Badge key={index} variant="secondary" className="font-normal">
                                                    {domain}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">No expertise listed</span>
                                        )}
                                        {mentor.domain && mentor.domain.length > 3 && (
                                            <Badge variant="outline" className="font-normal text-muted-foreground">
                                                +{mentor.domain.length - 3}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center text-sm text-muted-foreground bg-muted/30 p-2 rounded-md">
                                    <Clock className="h-4 w-4 mr-2 text-primary" />
                                    <span className="font-medium text-foreground">{mentor.availability?.hoursPerWeek || 0}</span>
                                    <span className="ml-1">hours/week available</span>
                                </div>

                                <div className="text-sm text-muted-foreground line-clamp-3">
                                    {mentor.bio}
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0 pb-6">
                                {user?.role === 'student' && (
                                    <Button
                                        className="w-full"
                                        onClick={() => handleRequestMentorship(mentor)}
                                        disabled={!mentor.user?._id}
                                    >
                                        <UserCheck className="mr-2 h-4 w-4" />
                                        Request Mentorship
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Mentorship Request Modal */}
            {selectedMentor && selectedMentor.user && (
                <MentorshipRequestModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    mentorId={selectedMentor.user._id}
                    mentorName={selectedMentor.user.name}
                    mentorDomains={selectedMentor.domain}
                />
            )}
        </div>
    );
};

export default MentorshipPage;

