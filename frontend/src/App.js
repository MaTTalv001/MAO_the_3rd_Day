import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { AuthProvider } from "./providers/auth";
import { Header } from "./components/Header";
import "./App.css";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
