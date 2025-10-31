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

                    // Variable pour stocker l'interval de vérification
                    let checkPopup: ReturnType<typeof setInterval> | null = null;
                    
                    // Écouter les messages de la popup
                    const handleMessage = (event: MessageEvent) => {
                        // Vérifier l'origine pour la sécurité
                        const allowedOrigin = FRONTEND_URL.startsWith('http') 
                            ? new URL(FRONTEND_URL).origin 
                            : window.location.origin;
                        if (event.origin !== allowedOrigin) {
                            return;
                        }
                        
                        if (event.data?.type === 'oauth_success' || event.data?.type === 'close_popup') {
                            if (checkPopup) {
                                clearInterval(checkPopup);
                            }
                            window.removeEventListener('message', handleMessage);
                            
                            if (event.data.token) {
                                localStorage.setItem('token', event.data.token);
                            }
                            
                            // Fermer la popup depuis le parent (car window.close() ne fonctionne pas après redirection)
                            if (popup && !popup.closed) {
                                try {
                                    popup.close();
                                } catch (e) {
                                    console.error('Erreur lors de la fermeture de la popup:', e);
                                }
                            }
                            
                            // Afficher le message du backend ou un message par défaut
                            const successMessage = event.data.message || 'Auth Google réussie';
                            console.log('OAuth réussi:', successMessage);
                            
                            // Afficher une notification de succès
                            if (event.data?.type === 'oauth_success') {
                                alert(successMessage || 'Google Calendar lié avec succès !');
                            }
                            
                            // Optionnel : rafraîchir la page ou mettre à jour l'état
                            // window.location.reload();
                        }
                    };
                    
                    window.addEventListener('message', handleMessage);
                    
                    // Vérifier périodiquement si la popup est fermée
                    checkPopup = setInterval(() => {
                        if (popup.closed) {
                            if (checkPopup) {
                                clearInterval(checkPopup);
                            }
                            window.removeEventListener('message', handleMessage);
                            console.log('Popup fermée');
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
        const oauthSuccess = urlParams.get('oauth_success');
        // get action parameter
        const action = urlParams.get('action');
        // Vérifier si c'est une authentification Google réussie (soit via oauth_success, soit via message)
        const isGoogleAuthSuccess = oauthSuccess || 
            (message && (message.includes('Google') || message.includes('google') || message.includes('Auth Google')));
        
        // Si on est dans une popup OAuth et qu'on a reçu un token avec un message de succès Google
        if (newToken && isGoogleAuthSuccess && window.opener) {
            // Envoyer un message au parent que l'auth Google est réussie
            // Le parent fermera la popup car window.close() ne fonctionne pas après redirection
            try {
                const targetOrigin = FRONTEND_URL.startsWith('http') 
                    ? new URL(FRONTEND_URL).origin 
                    : window.location.origin;
                window.opener.postMessage({ 
                    type: 'oauth_success', 
                    token: newToken,
                    message: message || 'Auth Google réussie',
                    closePopup: true // Indiquer au parent de fermer la popup
                }, targetOrigin);
            } catch (e) {
                console.error('Erreur lors de l\'envoi du message au parent:', e);
            }
            
            // Ne pas continuer le traitement normal si c'est dans une popup
            return;
        }
        
        // Si action == "close", informer le parent de fermer la popup
        if (action === "close" && window.opener) {
            try {
                const targetOrigin = FRONTEND_URL.startsWith('http') 
                    ? new URL(FRONTEND_URL).origin 
                    : window.location.origin;
                window.opener.postMessage({ 
                    type: 'close_popup'
                }, targetOrigin);
            } catch (e) {
                console.error('Erreur lors de l\'envoi du message au parent:', e);
            }
            return;
        }
        
        // Traitement normal si on a un token (pas dans une popup)
        if (newToken) {
            localStorage.setItem('token', newToken);
            let user_email = localStorage.getItem("user_email");
            if (user_email) {
                setUserEmail(user_email);
            }
            setIsAuthenticated(true);
            console.log(message || 'Token reçu');
            
            // Si c'est un succès Google en mode normal (pas popup), afficher le message
            if (isGoogleAuthSuccess) {
                console.log('Auth Google réussie:', message);
            }
            
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