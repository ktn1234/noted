import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
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
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route
                element={
                  <Protected>
                    <Outlet />
                  </Protected>
                }
              >
                <Route index element={<HomePage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </RootLayout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
