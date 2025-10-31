import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from './ui/alert-dialog';
import {
    ArrowLeft,
    User,
    Mail,
    Calendar,
    CheckSquare,
    Shield,
    Bell,
    Palette,
    Save,
    LogOut
} from 'lucide-react';

interface SettingsPageProps {
    userEmail: string;
    onBack: () => void;
    onLogout: () => void;
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
}

export function SettingsPage({
                                 userEmail,
                                 onBack,
                                 onLogout,
                                 isDarkMode,
                                 onToggleDarkMode
                             }: SettingsPageProps) {
    const [name, setName] = useState(userEmail.split('@')[0]);
    const [email, setEmail] = useState(userEmail);

    // Permissions
    const [gmailEnabled, setGmailEnabled] = useState(false);
    const [calendarEnabled, setCalendarEnabled] = useState(false);
    const [tasksEnabled, setTasksEnabled] = useState(false);

    // Notifications
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [taskReminders, setTaskReminders] = useState(true);
    const [calendarReminders, setCalendarReminders] = useState(true);

    // Modals de confirmation
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        type: 'gmail' | 'calendar' | 'tasks' | null;
        action: 'enable' | 'disable' | null;
    }>({ open: false, type: null, action: null });

    const handleSaveProfile = () => {
        // Simuler la sauvegarde
        console.log('Profil sauvegardé:', { name, email });
    };

    const handleTogglePermission = (type: 'gmail' | 'calendar' | 'tasks', currentState: boolean) => {
        setConfirmDialog({
            open: true,
            type,
            action: currentState ? 'disable' : 'enable'
        });
    };

    const confirmPermissionChange = () => {
        if (!confirmDialog.type) return;

        const isEnabling = confirmDialog.action === 'enable';

        switch (confirmDialog.type) {
            case 'gmail':
                setGmailEnabled(isEnabling);
                // Ici on ajouterait la logique OAuth pour Gmail
                break;
            case 'calendar':
                setCalendarEnabled(isEnabling);
                // Ici on ajouterait la logique OAuth pour Calendar
                break;
            case 'tasks':
                setTasksEnabled(isEnabling);
                // Ici on ajouterait la logique OAuth pour Tasks
                break;
        }

        setConfirmDialog({ open: false, type: null, action: null });
    };

    const getServiceName = () => {
        switch (confirmDialog.type) {
            case 'gmail': return 'Gmail';
            case 'calendar': return 'Google Calendar';
            case 'tasks': return 'Google Tasks';
            default: return '';
        }
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <div className="border-b bg-background p-3 md:p-4">
                <div className="flex items-center gap-3 md:gap-4">
                    <Button variant="ghost" size="sm" onClick={onBack}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-xl md:text-2xl font-geo">Paramètres</h1>
                        <p className="text-sm text-muted-foreground">
                            Gérez votre compte et vos préférences
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="p-3 md:p-6">
                        <div className="max-w-3xl mx-auto space-y-6">

                            {/* Profil */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Profil
                                    </CardTitle>
                                    <CardDescription>
                                        Gérez vos informations personnelles
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4 mb-6">
                                        <Avatar className="w-20 h-20">
                                            <AvatarFallback className="text-2xl">
                                                {name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-medium">{name}</h3>
                                            <p className="text-sm text-muted-foreground">{email}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nom</Label>
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Votre nom"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="votre@email.com"
                                        />
                                    </div>

                                    <Button onClick={handleSaveProfile} className="gap-2">
                                        <Save className="w-4 h-4" />
                                        Sauvegarder les modifications
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Autorisations */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        Autorisations
                                    </CardTitle>
                                    <CardDescription>
                                        Gérez les accès de l'application à vos services Google
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Gmail */}
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Mail className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Gmail</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {gmailEnabled
                                                        ? 'Connecté - Gestion des emails activée'
                                                        : 'Connectez Gmail pour gérer vos emails'}
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={gmailEnabled}
                                            onCheckedChange={() => handleTogglePermission('gmail', gmailEnabled)}
                                        />
                                    </div>

                                    {/* Google Calendar */}
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                                <Calendar className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Google Calendar</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {calendarEnabled
                                                        ? 'Connecté - Gestion du calendrier activée'
                                                        : 'Connectez Google Calendar pour planifier'}
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={calendarEnabled}
                                            onCheckedChange={() => handleTogglePermission('calendar', calendarEnabled)}
                                        />
                                    </div>

                                    {/* Google Tasks */}
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                                <CheckSquare className="w-5 h-5 text-amber-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Google Tasks</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {tasksEnabled
                                                        ? 'Connecté - Gestion des tâches activée'
                                                        : 'Connectez Google Tasks pour synchroniser'}
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={tasksEnabled}
                                            onCheckedChange={() => handleTogglePermission('tasks', tasksEnabled)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Notifications */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bell className="w-5 h-5" />
                                        Notifications
                                    </CardTitle>
                                    <CardDescription>
                                        Configurez vos préférences de notification
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">Notifications par email</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Recevoir des résumés quotidiens
                                            </p>
                                        </div>
                                        <Switch
                                            checked={emailNotifications}
                                            onCheckedChange={setEmailNotifications}
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">Rappels de tâches</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Recevoir des rappels pour les tâches
                                            </p>
                                        </div>
                                        <Switch
                                            checked={taskReminders}
                                            onCheckedChange={setTaskReminders}
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">Rappels de calendrier</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Recevoir des rappels pour les événements
                                            </p>
                                        </div>
                                        <Switch
                                            checked={calendarReminders}
                                            onCheckedChange={setCalendarReminders}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Apparence */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Palette className="w-5 h-5" />
                                        Apparence
                                    </CardTitle>
                                    <CardDescription>
                                        Personnalisez l'apparence de l'application
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">Mode sombre</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Utiliser le thème sombre
                                            </p>
                                        </div>
                                        <Switch
                                            checked={isDarkMode}
                                            onCheckedChange={onToggleDarkMode}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Zone de danger */}
                            <Card className="border-destructive/50">
                                <CardHeader>
                                    <CardTitle className="text-destructive">Zone de danger</CardTitle>
                                    <CardDescription>
                                        Actions irréversibles
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        variant="destructive"
                                        onClick={onLogout}
                                        className="gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Se déconnecter
                                    </Button>
                                </CardContent>
                            </Card>

                        </div>
                    </div>
                </ScrollArea>
            </div>

            {/* Modal de confirmation */}
            <AlertDialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ open: false, type: null, action: null })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {confirmDialog.action === 'enable' ? 'Activer' : 'Désactiver'} {getServiceName()}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmDialog.action === 'enable' ? (
                                <>
                                    Vous allez être redirigé vers Google pour autoriser l'accès à {getServiceName()}.
                                    L'application pourra accéder à vos données pour vous aider dans vos tâches quotidiennes.
                                </>
                            ) : (
                                <>
                                    Êtes-vous sûr de vouloir désactiver l'accès à {getServiceName()} ?
                                    Certaines fonctionnalités ne seront plus disponibles.
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmPermissionChange}>
                            {confirmDialog.action === 'enable' ? 'Continuer' : 'Désactiver'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
