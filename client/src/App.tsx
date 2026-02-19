import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";

const FolderView = lazy(() => import("./pages/FolderView"));
const SharedFolderView = lazy(() => import("./pages/SharedFolderView"));

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 grid place-items-center">
      <div className="h-8 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}

function HomeRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-stone-50 dark:bg-stone-900">
        <div className="text-stone-500">Loading...</div>
      </div>
    );
  }
  return user ? <Navigate to="/dashboard" replace /> : <Landing />;
}

function App() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/folder/:id"
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <FolderView />
                </Suspense>
              }
            />
            <Route
              path="/share/:token"
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <SharedFolderView />
                </Suspense>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
