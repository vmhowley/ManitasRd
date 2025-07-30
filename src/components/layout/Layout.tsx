import React from 'react';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export const Layout = ({ children, showFooter = true }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pb-16 md:pb-0"> {/* Padding bottom for mobile to accommodate the bottom nav */}
        {children}
      </main>
      {showFooter && <Footer />}
      <BottomNav /> {/* Bottom navigation for mobile app experience */}
    </div>
  );
};