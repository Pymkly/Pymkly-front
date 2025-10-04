import { useState } from 'react';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    const handleLogin = (email: string) => {
        setUserEmail(email);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserEmail('');
    };

    return (
        <div className="size-full">
            {isAuthenticated ? (
                <Dashboard userEmail={userEmail} onLogout={handleLogout} />
            ) : (
                <AuthPage onLogin={handleLogin} />
            )}
        </div>
    );
}