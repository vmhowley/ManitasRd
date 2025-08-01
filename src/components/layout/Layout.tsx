import React from 'react';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';
import { Header } from './Header';
import { useAuth } from '../../context/AuthContext';
interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export const Layout = ({ children, showFooter = false }: LayoutProps) => {
  const { user } = useAuth();
  const isMobile = window.innerWidth < 768;
  return (
    <div className="flex flex-col pb-20 ">
      {!isMobile && <TopBar />}{" "}
      {isMobile && user && <Header />}
      <main className="mt-6">
        {children}
      </main>

      {showFooter && <Footer />}
      {isMobile && <BottomNav />}{" "}
      {/* Bottom navigation for mobile app experience */}
    </div>
  );
};