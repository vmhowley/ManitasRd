import { useMemo } from "react";
import { Header } from "./components/layout/Header"
import AppRoutes from "./routes/AppRoutes"
import { BottomNav } from "./components/layout/BottomNav";
import { useTheme } from "./context/ThemeContext";
function App() {
  const { isDarkMode } = useTheme();
  const isMobile = useMemo(() => {
    return window.innerWidth < 768;
  }, []);
  
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100">
      {!isMobile ? <Header /> : <BottomNav />} 
      <AppRoutes />
      {/* <Footer/> */}
    </div>
  );
}

export default App
