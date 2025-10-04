import { useState, useEffect } from 'react';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import axios from 'axios';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const FRONTEND_URL = "http://localhost:5173";
    const handleLogin = async (email: string, password: string) => {
        setUserEmail(email);
        console.log(email, password);

        try {
            const response = await axios.post('http://localhost:8000/login', {
                username: email,
                password: password,
            }, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            const { access_token, message, next_step } = response.data;
            // Stocker le token
            localStorage.setItem('token', access_token);
            localStorage.setItem('user_email', email);
            setIsAuthenticated(true);

            // Gérer le consentement Google si proposé
            if (next_step) {
                // if (window.confirm("Voulez-vous lier votre Google Calendar maintenant ?")) {
                    window.location.href = "http://localhost:8000"+next_step;
                // }
            }
        } catch (error) {
            console.error('Erreur login:', error);
            // @ts-ignore
            alert('Erreur de connexion : ' + (error.response?.data?.detail || 'Vérifiez vos identifiants'));
        }
    };

    const handleRegister = async (email: string, password: string, name: string) => {
        setUserEmail(email);
        console.log(email, password, name);

        try {
            const response = await axios.post('http://localhost:8000/register', {
                nom_complet: name,
                email: email,
                mot_de_passe: password,
            });
            const { access_token, message, next_step} = response.data;
            // Stocker le token
            localStorage.setItem('token', access_token);
            localStorage.setItem('user_email', email);
            setIsAuthenticated(true);

            // Gérer le consentement Google si proposé
            if (next_step) {
                // if (window.confirm("Voulez-vous lier votre Google Calendar maintenant ?")) {
                    window.location.href = "http://localhost:8000"+next_step;
                // }
            }
        } catch (error) {
            console.error('Erreur inscription:', error);
            // @ts-ignore
            alert('Erreur d\'inscription : ' + (error.response?.data?.detail || 'Vérifiez vos données'));
        }
    };


    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserEmail('');
    };
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const newToken = urlParams.get('token');
        const message = urlParams.get('message');
        if (newToken) {
            localStorage.setItem('token', newToken);
            let user_email = localStorage.getItem("user_email");
            if (user_email) {
                setUserEmail(user_email);
            }
            setIsAuthenticated(true);
            console.log(message)
            // Nettoyer l'URL
            window.history.replaceState({}, document.title, FRONTEND_URL);
        }
    }, []);
    return (
        <div className="size-full">
            {isAuthenticated ? (
                <Dashboard userEmail={userEmail} onLogout={handleLogout} />
            ) : (
                <AuthPage onLogin={handleLogin} onRegister={handleRegister} />
            )}
        </div>
    );
}