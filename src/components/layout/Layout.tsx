import React from "react";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";
import { TopBar } from "./TopBar";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}
const isMobile = window.innerWidth < 768;

export const Layout = ({ children, showFooter = false }: LayoutProps) => {
  return (
    <>
      <div className="my-20">
        {isMobile ? <Header /> : <TopBar />}
        <main className="">{children}</main>
        {isMobile ? <BottomNav /> : <TopBar />}
        {/* Bottom navigation for mobile app experience */}
      </div>
    </>
  );
};
