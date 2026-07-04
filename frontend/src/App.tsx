import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ThemeBackground } from "./components/ThemeBackground";
import { AuthProvider } from "./hooks/useAuth";
import { MoodThemeProvider } from "./hooks/useMoodTheme";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ResultsPage } from "./pages/ResultsPage";
import { SharedPlaylistPage } from "./pages/SharedPlaylistPage";

export default function App() {
  return (
    <AuthProvider>
      <MoodThemeProvider>
        <ThemeBackground>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/share/:shareId" element={<SharedPlaylistPage />} />
              <Route path="/shared/:shareId" element={<SharedPlaylistPage />} />
            </Routes>
          </Layout>
        </ThemeBackground>
      </MoodThemeProvider>
    </AuthProvider>
  );
}
