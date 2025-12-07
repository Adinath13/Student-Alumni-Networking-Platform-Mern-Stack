import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area" // I need to create ScrollArea or just use div
import { Toaster } from "@/components/ui/toaster"

const Layout = ({ children }) => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white font-sans antialiased flex flex-col">
            <Navbar onMenuClick={() => setSidebarOpen(true)} />

            <div className="flex flex-1">
                {user && (
                    <>
                        {/* Desktop Sidebar */}
                        <aside className="hidden w-64 border-r bg-background/95 backdrop-blur md:block">
                            <div className="h-full py-6 pl-8 pr-6">
                                <Sidebar />
                            </div>
                        </aside>

                        {/* Mobile Sidebar (Sheet) */}
                        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                            <SheetContent side="left" className="p-0 w-64">
                                <div className="h-full py-6 pl-8 pr-6">
                                    <Sidebar />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </>
                )}

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
                    {children}
                </main>
            </div>
            <Footer />
            <Toaster />
        </div>
    );
};

export default Layout;

