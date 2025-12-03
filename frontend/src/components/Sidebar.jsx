import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Briefcase,
    Heart,
    Megaphone,
    UserCircle,
    MessageCircle,
    Image,
    Newspaper,
    Award,
    BookOpen,
    HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area'; // Assuming I might add this later, but for now standard div

const Sidebar = ({ className }) => {
    const { user } = useAuth();
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: `/${user?.role}-dashboard`, icon: LayoutDashboard },
        { name: 'My Profile', href: '/profile', icon: UserCircle },
        { name: 'Messages', href: '/messages', icon: MessageCircle },
        { name: 'Alumni Directory', href: '/directory', icon: Users },
        { name: 'Events', href: '/events', icon: Calendar },
        { name: 'Jobs', href: '/jobs', icon: Briefcase },
        { name: 'Mentorship', href: '/mentorship', icon: Users },
        { name: 'Donations', href: '/donations', icon: Heart },
        { name: 'Announcements', href: '/announcements', icon: Megaphone },
        { name: 'News & Updates', href: '/news', icon: Newspaper },
        { name: 'Gallery', href: '/gallery', icon: Image },
        { name: 'Success Stories', href: '/success-stories', icon: Award },
        { name: 'Career Resources', href: '/career-resources', icon: BookOpen },
        { name: 'FAQ', href: '/faq', icon: HelpCircle },
    ];

    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Menu
                    </h2>
                    <div className="space-y-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Button
                                    key={item.name}
                                    variant={isActive ? "secondary" : "ghost"}
                                    className="w-full justify-start"
                                    asChild
                                >
                                    <Link to={item.href}>
                                        <item.icon className="mr-2 h-4 w-4" />
                                        {item.name}
                                    </Link>
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;


