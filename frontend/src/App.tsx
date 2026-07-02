import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { ThemeBackground } from "./components/ThemeBackground";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ResultsPage } from "./pages/ResultsPage";
import { SharedPlaylistPage } from "./pages/SharedPlaylistPage";

export default function App() {
  return (
    <ThemeBackground>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/shared/:shareId" element={<SharedPlaylistPage />} />
        </Routes>
      </main>
    </ThemeBackground>
  );
}

