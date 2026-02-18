import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center">Loading...</div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center">Not logged in</div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return <>
  <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-600 mb-6">Welcome, {user.email}!</p>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
    </>;
}
