import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Mail, Lock, User, Bot } from 'lucide-react';

interface AuthPageProps {
    onLogin: (email: string) => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            onLogin(email);
        }
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && name) {
            onLogin(email);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-6 md:mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-primary rounded-full mb-4">
                        <Bot className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl md:text-3xl mb-2">TaskMaster AI</h1>
                    <p className="text-muted-foreground text-sm md:text-base px-2">Votre assistant IA pour la gestion de tâches, calendrier et emails</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Bienvenue</CardTitle>
                        <CardDescription>
                            Connectez-vous ou créez un compte pour commencer
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login">Connexion</TabsTrigger>
                                <TabsTrigger value="register">Inscription</TabsTrigger>
                            </TabsList>

                            <TabsContent value="login">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="login-email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="login-email"
                                                type="email"
                                                placeholder="votre@email.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="pl-9"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="login-password">Mot de passe</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="login-password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="pl-9"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full">
                                        Se connecter
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="register">
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="register-name">Nom complet</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="register-name"
                                                type="text"
                                                placeholder="Votre nom"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="pl-9"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="register-email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="register-email"
                                                type="email"
                                                placeholder="votre@email.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="pl-9"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="register-password">Mot de passe</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="register-password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="pl-9"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full">
                                        Créer un compte
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <p className="text-center text-xs md:text-sm text-muted-foreground mt-4 md:mt-6 px-4">
                    En vous connectant, vous acceptez nos conditions d'utilisation
                </p>
            </div>
        </div>
    );
}