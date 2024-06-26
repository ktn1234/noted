import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import ThemeProvider from "./contexts/ThemeProvider";
import AuthProvider from "./contexts/AuthProvider";

import RootLayout from "./components/RootLayout";

import AuthPage from "./pages/AuthPage";
import VerifyPage from "./pages/VerifyPage";

// import Signup from "./pages/SignupPage";
// import ResendConfirmationPage from "./pages/ResendConfirmationPage";

import Protected from "./components/Protected";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotificationsPage from "./pages/NotificationsPage";

import queryclient from "./lib/react-query";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <QueryClientProvider client={queryclient}>
            <RootLayout>
              <Routes>
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/auth/verify" element={<VerifyPage />} />
                {/* <Route path="/auth/signup" element={<Signup />} /> */}
                {/* <Route
                path="/auth/resend-confirmation"
                element={<ResendConfirmationPage />}
              /> */}
                <Route
                  element={
                    <Protected>
                      <Outlet />
                    </Protected>
                  }
                >
                  <Route index element={<HomePage />} />
                  <Route path="/profiles/:username" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route
                    path="/notifications"
                    element={<NotificationsPage />}
                  />
                </Route>
              </Routes>
            </RootLayout>
            <ReactQueryDevtools />
          </QueryClientProvider>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
