import { useState, useEffect } from 'react';
import { getUser, logout, handleAuthCallback } from '@netlify/identity';
import HomePage from './pages/home';
import LoginPage from './pages/login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function init() {
      try {
        await handleAuthCallback();
      } catch {
        // No callback in URL - normal page load
      }
      const user = await getUser();
      setIsAuthenticated(!!user);
    }
    init();
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="App">
      <HomePage onLogout={handleLogout} />
    </div>
  );
}

export default App;
