import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full bg-slate-900 text-white py-6 border-t border-slate-800">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm font-medium tracking-wide">
                    Designed & Developed by <span className="text-primary font-bold">ADINATH GORE</span>
                </p>
                <p className="text-xs text-slate-400 mt-2">
                    &copy; {new Date().getFullYear()} StudentNetwork. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
