import { useState } from 'react';
import axios from '../utils/axios';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ShieldCheck, ShieldAlert, Send, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EmailVerificationBanner = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [sendingVerification, setSendingVerification] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    // Don't show if user is verified or banner is dismissed
    if (!user || user.isEmailVerified || dismissed) {
        return null;
    }

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

    return (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900">
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                                    Email Not Verified
                                </h3>
                                <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                                    Please verify your email address to secure your account and access all features.
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-amber-100 dark:hover:bg-amber-900"
                                onClick={() => setDismissed(true)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 bg-white dark:bg-amber-950 border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900"
                            onClick={handleResendVerification}
                            disabled={sendingVerification}
                        >
                            {sendingVerification ? (
                                <>Sending...</>
                            ) : (
                                <>
                                    <Send className="h-3 w-3 mr-2" />
                                    Send Verification Email
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default EmailVerificationBanner;
