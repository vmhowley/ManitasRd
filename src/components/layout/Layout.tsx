import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export const Layout = ({ children, showFooter = true }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pb-16 md:pb-0"> {/* Added padding bottom for mobile to accommodate the bottom nav */}
        {children}
      </main>
      {showFooter && <Footer />}
      <BottomNav /> {/* Added BottomNav component */}
    </div>
  );
};