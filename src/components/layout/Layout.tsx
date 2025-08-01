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

window.scrollTo(0,6)
export const Layout = ({ children, showFooter = false }: LayoutProps) => {
  const { user } = useAuth();
  const isMobile = window.innerWidth < 768;
  console.log(window.scrollY);
  return(
    <>
      <TopBar />
      <div className={`${window.screenY > 2 ? 'hidden' : ''} flex flex-col pb-20 pt-14`}>
        {isMobile && user && <Header />}
        <main className="mt-6">{children}</main>

        {showFooter && <Footer />}
        {/* {isMobile && <BottomNav />}{" "} */}
        {/* Bottom navigation for mobile app experience */}
      </div>
    </>
  );
};