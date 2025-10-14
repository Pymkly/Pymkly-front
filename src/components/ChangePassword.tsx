import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Lock, Bot, Eye, EyeOff } from 'lucide-react';

interface ChangePasswordPageProps {
    onChangePassword: (password: string) => void;
}

export function ChangePassword({ onChangePassword }: ChangePasswordPageProps) {
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [check, setCheck] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false); // Pour register
    const [showRegisterPassword2, setShowRegisterPassword2] = useState(false); // Pour register

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password && password2) {
            if (password2 === password) {
                setCheck(false);
                onChangePassword(password);
            } else {
                setCheck(true);
            }
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
                        <CardTitle>Mot de passe</CardTitle>
                        <CardDescription>
                            Changez votre mot de passe en toute simplicité.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="register" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="register">Changer mot de passe</TabsTrigger>
                            </TabsList>

                            <TabsContent value="register">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="register-password">Nouveau mot de passe</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                            <Input
                                                id="register-password"
                                                type={showRegisterPassword2 ? 'text' : 'password'} // Toggle visibility
                                                placeholder="••••••••"
                                                value={password2}
                                                onChange={(e) => setPassword2(e.target.value)}
                                                className="pl-9 pr-10"
                                                required
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-2 top-2 h-7 w-7"
                                                onClick={() => setShowRegisterPassword2(!showRegisterPassword2)}
                                            >
                                                {showRegisterPassword2 ? (
                                                    <EyeOff className="h-4 w-4"/>
                                                ) : (
                                                    <Eye className="h-4 w-4"/>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="register-password">Retapez le mot de passe</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                            <Input
                                                id="register-password"
                                                type={showRegisterPassword ? 'text' : 'password'} // Toggle visibility
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="pl-9 pr-10"
                                                required
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-2 top-2 h-7 w-7"
                                                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                            >
                                                {showRegisterPassword ? (
                                                    <EyeOff className="h-4 w-4"/>
                                                ) : (
                                                    <Eye className="h-4 w-4"/>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                    {(check?<p className={"text-red-500"}>Vérifiez le mot de passe</p> : <></> )}
                                    <Button type="submit" className="w-full">
                                        Changer le mot de passe
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