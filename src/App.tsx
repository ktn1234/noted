import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";

import RootLayout from "./components/RootLayout";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import Protected from "./components/Protected";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <RootLayout>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route
                index
                element={
                  <Protected>
                    <HomePage />
                  </Protected>
                }
              />
              <Route
                path="/settings"
                element={
                  <Protected>
                    <SettingsPage />
                  </Protected>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </RootLayout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
