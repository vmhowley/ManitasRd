import { TopBar } from "./components/layout/TopBar"
import AppRoutes from "./routes/AppRoutes"
import { BottomNav } from "./components/layout/BottomNav";
import { Layout } from "./components/layout";
interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}
function App({ children }: LayoutProps) {

  return (
    <>
      <Layout children={children} />

      <AppRoutes />
    </>
  );
}

export default App
