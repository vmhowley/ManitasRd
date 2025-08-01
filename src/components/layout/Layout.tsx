import React from 'react';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export const Layout = ({ children, showFooter = false }: LayoutProps) => {
  const isMobile = window.innerWidth < 768;
  return (
    <div className="flex flex-col ">
      {!isMobile && <TopBar />}{" "}
      {isMobile &&<Header />}
      <main className="flex-grow pb-8 md:pb-0">
        {/* Padding bottom for mobile to accommodate the bottom nav */}
        {children}
      </main>
      {showFooter && <Footer />}
      {isMobile && <BottomNav />}{" "}
      {/* Bottom navigation for mobile app experience */}
    </div>
  );
};