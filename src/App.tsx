import { useState, useEffect } from 'react';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import axios from 'axios';
import {config} from "./config/config.ts";
import {ChangePassword} from "./components/ChangePassword.tsx";

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChangePassword, setIsChangePassword] = useState(false);
    const [isInvalidChangePassword, setIsInvalidChangePassword] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [token, setToken] = useState('');
    const FRONTEND_URL = config["FRONTEND_URL"];
    const apiUrl = config["apiUrl"];
    const handleLogin = async (email: string, password: string) => {
        setUserEmail(email);
        console.log(email, password);

        try {
            const response = await axios.post(`${apiUrl}/login`, {
                username: email,
                password: password,
            }, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            const { access_token, next_step } = response.data;
            // Stocker le token
            localStorage.setItem('token', access_token);
            localStorage.setItem('user_email', email);
            setIsAuthenticated(true);

            // Gérer le consentement Google si proposé
            if (next_step) {
                // if (window.confirm("Voulez-vous lier votre Google Calendar maintenant ?")) {
                    window.location.href = `${apiUrl}${next_step}`;
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
            const response = await axios.post(`${apiUrl}/register`, {
                nom_complet: name,
                email: email,
                mot_de_passe: password,
            });
            const { access_token, next_step} = response.data;
            // Stocker le token
            localStorage.setItem('token', access_token);
            localStorage.setItem('user_email', email);
            setIsAuthenticated(true);

            // Gérer le consentement Google si proposé
            if (next_step) {
                // if (window.confirm("Voulez-vous lier votre Google Calendar maintenant ?")) {
                //     window.location.href = `${apiUrl}${next_step}`;
                if (window.confirm("Voulez-vous lier votre Google Calendar maintenant ?")) {
                    const width = 500;
                    const height = 600;
                    const left = (window.screen.width - width) / 2;
                    const top = (window.screen.height - height) / 2;
                    const popup = window.open(
                        `${apiUrl}${next_step}`,
                        'GoogleAuth',
                        `width=${width},height=${height},top=${top},left=${left},resizable=yes`
                    );

                    // Vérifie si la popup est bloquée
                    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
                        alert('Veuillez autoriser les popups pour cette action.');
                        return;
                    }

                    // Gestion du callback (à implémenter dans un useEffect ou listener)
                    const checkPopup = setInterval(() => {
                        if (popup.closed) {
                            clearInterval(checkPopup);
                            // Rafraîchir ou vérifier le statut (ex: appel API)
                            console.log('Popup fermée, vérifiez la connexion');
                        }
                    }, 500);
                }
                // }
            }
        } catch (error) {
            console.error('Erreur inscription:', error);
            // @ts-ignore
            alert('Erreur d\'inscription : ' + (error.response?.data?.detail || 'Vérifiez vos données'));
        }
    };

    const handleChangePassword = async (password : string) => {
        try {
            const response = await axios.post(`${apiUrl}/change-password`, {
                token: token,
                mot_de_passe: password,
            });
            const { access_token, email} = response.data;
            // Stocker le token
            localStorage.setItem('token', access_token);
            localStorage.setItem('user_email', email);
            setUserEmail(email);
            setIsAuthenticated(true);
            window.history.replaceState({}, document.title, FRONTEND_URL);
            setIsChangePassword(false);
        } catch (error) {
            console.error('Erreur changement mot de passe:', error);
            // @ts-ignore
            alert('Erreur durant le changement de mot de passe : ' + (error.response?.data?.detail || 'Vérifiez vos données'));
        }
    }
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
        const resetToken = urlParams.get('reset-token');
        console.log(resetToken);
        if (resetToken) {
            setToken(resetToken);
            axios.get(`${apiUrl}/token-password-checking?token=${resetToken}`)
                .then(resp => {
                    console.log(resp)
                    setIsChangePassword(true);
                })
                .catch(err => {
                    console.log(err)
                    setIsInvalidChangePassword(true);
            })
        }

    }, []);
    return (
        <div className="size-full">
            {isAuthenticated ? (
                <Dashboard userEmail={userEmail} onLogout={handleLogout} />
            ) : (
                isChangePassword? <ChangePassword onChangePassword={handleChangePassword}/>:<AuthPage isInvalidToken={isInvalidChangePassword} onLogin={handleLogin} onRegister={handleRegister} />
            )}
        </div>
    );
}