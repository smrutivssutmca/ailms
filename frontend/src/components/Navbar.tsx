import React, { useEffect, useState } from "react";
import { Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

interface NavbarProps {
  user?: { name: string } | null;
}

const Navbar: React.FC<NavbarProps> = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) setUser(parsed);
        else setUser(null);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleLogoClick = () => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) navigate('/dashboard');
        else navigate('/');
      } catch {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleLogoClick}> 
            <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SkillShift</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <div className="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center text-white font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <Button variant="outline" className="rounded-full bg-transparent ml-2" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Button variant="outline" className="rounded-full bg-transparent" onClick={() => navigate("/login")}>Sign In</Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
