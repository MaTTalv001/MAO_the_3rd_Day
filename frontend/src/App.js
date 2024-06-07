import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { AuthProvider } from "./providers/auth";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import ParticlesComponent from "./components/Particles";
import "./App.css";

const App = () => {
  return (
    <div
      id="app-container"
      style={{ position: "relative", width: "100%", height: "100vh" }}
    >
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <AppRoutes />
          <ParticlesComponent />
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
};

export default App;
