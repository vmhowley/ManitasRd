import React from 'react';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';
import { Header } from './Header';
interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}
const isMobile = window.innerWidth < 768;

window.scrollTo(0,6)
export const Layout = ({ children, showFooter = false }: LayoutProps) => {
  return(
    <>
      <div className={`${isMobile ? 'mb-18' : 'my-20'} flex flex-col mt-9`}>
        {isMobile  && <Header />}
        <main className="mt-6">
          {children}
          </main>

        {showFooter && <Footer />}
        {isMobile && <BottomNav /> }
        {!isMobile &&  <TopBar/> }
        {/* Bottom navigation for mobile app experience */}
      </div>
    </>
  );
};