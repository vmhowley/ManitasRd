import AppRoutes from "./routes/AppRoutes"
import { Layout } from "./components/layout";
function App() {
 window.scrollTo(0, 0);
  return (
    <>
      <Layout >
      <AppRoutes />
      </Layout>
    </>
  );
}

export default App
