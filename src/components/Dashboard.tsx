import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './ui/sheet';
import { VisuallyHidden } from './ui/visually-hidden';
import { Bot, LogOut, Settings, Menu, Moon, Sun, History, Plus, BookOpen, ArrowLeft } from 'lucide-react';
import { ConversationSidebar, type Conversation } from './ConversationSidebar';
import { MainChatInterface, type ChatMessage } from './MainChatInterface';
import axios from 'axios';
import {config} from "../config/config.ts";
import { HistoryPage } from './HistoryPage';
import { SettingsPage } from './SettingsPage';
import { GuidePage } from './GuidePage';
import iconDark from '../assets/icone dark.png';

interface DashboardProps {
    userEmail: string;
    onLogout: () => void;
}

type Page = 'chat' | 'history' | 'settings' | 'guide';

export function Dashboard({ userEmail, onLogout }: DashboardProps) {
    const apiUrl = config["apiUrl"];
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<Page>('chat');
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('darkMode') === 'true';
        }
        return false;
    });

    // Initialiser avec quelques conversations de démonstration
    const [conversations, setConversations] = useState<Conversation[]>([
        {
            id: '1',
            title: 'Planification de la semaine',
            lastMessage: 'Parfait ! J\'ai créé les tâches pour vous.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            isActive: false,
            isPinned: true
        },
    ]);

    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [conversationMessages, setConversationMessages] = useState<Record<string, ChatMessage[]>>({});
    const [isTyping, setIsTyping] = useState(false);


    const loadConversation = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/threads`,
                {
                    headers : {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            const { threads } = response.data;
            setConversations(threads);
        } catch (error) {
            console.error('Erreur answer:', error);
        }
    }
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', isDarkMode.toString());
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const generateAIResponse = async (userMessage: string, conversationId: string | null): Promise<{ message: ChatMessage; thread_id: string; label: string | null }> => {

        try {
            let text = userMessage;
            const clientTime = new Date().toISOString(); // Ex: "2025-10-09T11:45:00.000Z"
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Ex: "Africa/Nairobi"
            const response = await axios.post(
                `${apiUrl}/answer`,
                { text, "thread_id": conversationId, clientTime, timeZone }, // Utilise l'UUID stocké
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            const { result, thread_id, suggestions, label } = response.data;
            console.log("response.data", response.data);
            
            localStorage.setItem('uuid', thread_id);
            return {
                message: {
                    id: Date.now().toString(),
                    content: result,
                    suggestions : suggestions,
                    isUser: false,
                    timestamp: new Date(),
                },
                thread_id,
                label: label || null
            };
        } catch (error) {
            console.error('Erreur answer:', error);
            return {
                message: {
                    id: Date.now().toString(),
                    content: (''+error).toString(),
                    isUser: false,
                    timestamp: new Date(),
                },
                thread_id: conversationId || '',
                label: null
            };
            // alert('Erreur : ' + (error.response?.data?.detail || 'Problème avec la requête'));
        }
    };

    const handleSelectConversation = async (id: string) => {

        setConversations(prev => prev.map(conv => ({
            ...conv,
            isActive: conv.id === id
        })));
        setActiveConversationId(id);
        await loadOneConversation(id);
    };

    const loadOneConversation = async (id:string) => {
        try {
            const response = await axios.get(
                `${apiUrl}/discussions?thread_id=${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            const { messages } = response.data;
            setConversationMessages(prev => ({
                ...prev,
                [id]: messages
            }));
            console.log(messages);
        } catch (error) {
            console.error('Erreur answer:', error);
            // alert('Erreur : ' + (error.response?.data?.detail || 'Problème avec la requête'));
        }
    }

    const handleCreateNewConversation = () => {
        // Créer une nouvelle conversation vide et la sélectionner
        const newConversationId = `temp_${Date.now().toString()}`;
        const newConversation: Conversation = {
            id: newConversationId,
            title: 'Nouvelle conversation',
            lastMessage: '',
            timestamp: new Date(),
            isActive: true,
            isPinned: false
        };

        setConversations(prev => [newConversation, ...prev]);
        setActiveConversationId(newConversationId);
        setConversationMessages(prev => ({
            ...prev,
            [newConversationId]: []
        }));
        setCurrentPage('chat');
        // Fermer le sidebar mobile si ouvert
        setIsSidebarOpen(false);
    };


    const handleDeleteConversation = (id: string) => {
        setConversations(prev => prev.filter(conv => conv.id !== id));
        setConversationMessages(prev => {
            const newMessages = { ...prev };
            delete newMessages[id];
            return newMessages;
        });

        if (activeConversationId === id) {
            setActiveConversationId(null);
        }
    };

    const handleRenameConversation = (id: string, newTitle: string) => {
        setConversations(prev => prev.map(conv =>
            conv.id === id ? { ...conv, title: newTitle } : conv
        ));
    };

    const handlePinConversation = (id: string) => {
        setConversations(prev => prev.map(conv =>
            conv.id === id ? { ...conv, isPinned: !conv.isPinned } : conv
        ));
    };

    const handleSendMessage = async (message: string, conversationId: string | null, placeholderId: string, next: () => void) => {
        // si la conversationId commence par temp_, c'est une conversation temporaire
        console.log("conversationId", conversationId);
        
        if (conversationId?.startsWith('temp_')) {
            conversationId = null;
        }
        // Créer le message utilisateur
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            content: message,
            isUser: true,
            timestamp: new Date()
        };

        // Déterminer l'ID de conversation à utiliser
        let targetConversationId = conversationId;

        // Si pas de conversation active, on laisse l'API créer le thread
        if (!conversationId) {
            // Créer une conversation temporaire pour afficher les messages
            const tempConversationId = Date.now().toString();
            targetConversationId = tempConversationId;
            
            // Initialiser la conversation temporaire
            setConversations(prev => [{
                id: tempConversationId,
                title: 'Nouvelle conversation',
                lastMessage: message,
                timestamp: new Date(),
                isActive: true
            }, ...prev]);
            setActiveConversationId(tempConversationId);
            setConversationMessages(prev => ({
                ...prev,
                [tempConversationId]: []
            }));
        }

        // Ajouter le message utilisateur
        setConversationMessages(prev => ({
            ...prev,
            [targetConversationId!]: [...(prev[targetConversationId!] || []), userMessage]
        }));

        // Ajouter un message placeholder pour le chargement
        setConversationMessages(prev => ({
            ...prev,
            [targetConversationId!]: [
                ...(prev[targetConversationId!] || []),
                { id: placeholderId, content: '', isUser: false, timestamp: new Date(), isPlaceholder: true },
            ],
        }));

        // Appeler l'API
        setIsTyping(true);
        try {
            const aiResponse = await generateAIResponse(message, conversationId);
            console.log("ai response ", aiResponse);

            // Si label n'est pas null, c'est une nouvelle conversation
            if (aiResponse.label && !conversationId) {
                // Mettre à jour l'ID de la conversation avec le thread_id réel
                const realThreadId = aiResponse.thread_id;
                
                // Mettre à jour la conversation avec le vrai ID et le label comme titre
                setConversations(prev => prev.map(conv =>
                    conv.id === targetConversationId
                        ? { ...conv, id: realThreadId, title: aiResponse.label!, lastMessage: aiResponse.message.content, timestamp: new Date() }
                        : conv
                ));

                // Mettre à jour les messages avec le vrai ID
                setConversationMessages(prev => {
                    const messages = prev[targetConversationId!] || [];
                    const newMessages = { ...prev };
                    delete newMessages[targetConversationId!];
                    newMessages[realThreadId] = messages.map(msg =>
                        msg.id === placeholderId ? aiResponse.message : msg
                    );
                    return newMessages;
                });

                // Mettre à jour l'ID de conversation active
                setActiveConversationId(realThreadId);
                
                // Charger la conversation complète depuis le serveur
                await loadConversation();
            } else {
                // Conversation existante, juste remplacer le placeholder
                setConversationMessages(prev => ({
                    ...prev,
                    [targetConversationId!]: prev[targetConversationId!].map(msg =>
                        msg.id === placeholderId ? aiResponse.message : msg
                    ),
                }));

                // Mettre à jour le dernier message de la conversation
                setConversations(prev => prev.map(conv =>
                    conv.id === targetConversationId
                        ? { ...conv, lastMessage: aiResponse.message.content, timestamp: new Date() }
                        : conv
                ));
            }

            console.log("Conversation message");
            console.log(conversationMessages);
            next();
        } catch (error) {
            // Gérer l'erreur
            setConversationMessages(prev => ({
                ...prev,
                [targetConversationId!]: prev[targetConversationId!].map(msg =>
                    msg.id === placeholderId ? { ...msg, content: 'Erreur lors de la réponse.', isPlaceholder: false } : msg
                ),
            }));
        } finally {
            setIsTyping(false);
        }
    };


    const handleActionClick = (action: any) => {
        // Simuler l'exécution de l'action
        const actionMessages = {
            task: 'Parfait ! J\'ai créé la tâche pour vous. Elle apparaîtra dans votre liste de tâches.',
            calendar: 'Excellent ! J\'ai ajouté l\'événement à votre calendrier. Vous recevrez un rappel.',
            email: 'Très bien ! J\'ai préparé un brouillon d\'email. Vous pouvez le modifier avant de l\'envoyer.',
            note: 'J\'ai sauvegardé votre note. Elle est maintenant disponible dans vos documents.'
        };

        if (activeConversationId) {
            const confirmMessage: ChatMessage = {
                id: Date.now().toString(),
                content: actionMessages[action.type as keyof typeof actionMessages] || 'Action effectuée avec succès !',
                isUser: false,
                timestamp: new Date(),
                suggestions: [
                    'Créer autre chose',
                    'Voir mes tâches',
                    'Planifier autre chose',
                    'Nouvelle conversation'
                ]
            };

            setConversationMessages(prev => ({
                ...prev,
                [activeConversationId]: [...(prev[activeConversationId] || []), confirmMessage]
            }));
        }
    };

    const userName = userEmail.split('@')[0];

    // Afficher la page appropriée
    if (currentPage === 'history') {
        return <HistoryPage onBack={() => setCurrentPage('chat')} />;
    }

    if (currentPage === 'guide') {
        return (
            <div className="h-screen flex flex-col">
                <div className="border-b bg-background p-3 md:p-4">
                    <div className="flex items-center gap-3 md:gap-4">
                        <Button variant="ghost" size="sm" onClick={() => setCurrentPage('chat')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-xl md:text-2xl font-geo">Guide</h1>
                            <p className="text-sm text-muted-foreground">
                                Apprenez à utiliser Tsisy AI
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-auto">
                    <GuidePage />
                </div>
            </div>
        );
    }

    if (currentPage === 'settings') {
        return (
            <SettingsPage
                userEmail={userEmail}
                onBack={() => setCurrentPage('chat')}
                onLogout={onLogout}
                isDarkMode={isDarkMode}
                onToggleDarkMode={toggleDarkMode}
            />
        );
    }

    useEffect(() => {
        loadConversation();
    }, []);

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <div className="border-b bg-background p-3 md:p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Mobile menu button */}
                        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="sm" className="md:hidden">
                                    <Menu className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-80">
                                <VisuallyHidden>
                                    <SheetTitle>Menu de navigation</SheetTitle>
                                    <SheetDescription>Accédez à vos conversations et fonctionnalités</SheetDescription>
                                </VisuallyHidden>
                                <ConversationSidebar
                                    conversations={conversations}
                                    activeConversationId={activeConversationId}
                                    onSelectConversation={(id) => {
                                        handleSelectConversation(id);
                                        setIsSidebarOpen(false);
                                    }}
                                    onDeleteConversation={handleDeleteConversation}
                                    onRenameConversation={handleRenameConversation}
                                    onPinConversation={handlePinConversation}
                                />
                            </SheetContent>
                        </Sheet>

                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center">
                                <img src={iconDark} alt="Tsisy" className="object-contain" />
                            </div>
                            <h1 className="text-lg md:text-xl font-geo">Tsisy</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 md:gap-2">
                        {/* Bouton Nouvelle conversation - visible sur toutes les tailles */}
                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleCreateNewConversation}
                            className="gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Nouvelle conversation</span>
                        </Button>

                        <div className="flex items-center gap-2 md:gap-3">
                            {/* Mobile Menu */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <button className="sm:hidden p-1 hover:bg-accent rounded-md transition-colors">
                                        <Avatar className="w-7 h-7">
                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                {userName.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-80">
                                    <VisuallyHidden>
                                        <SheetTitle>Menu utilisateur</SheetTitle>
                                        <SheetDescription>Gérez votre profil et vos paramètres</SheetDescription>
                                    </VisuallyHidden>
                                    <div className="flex flex-col gap-4 mt-8">
                                        <div className="flex items-center gap-3 pb-4 border-b">
                                            <Avatar className="w-12 h-12">
                                                <AvatarFallback className="bg-primary text-primary-foreground">
                                                    {userName.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{userName}</p>
                                                <p className="text-sm text-muted-foreground">{userEmail}</p>
                                            </div>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            className="justify-start gap-2"
                                            onClick={toggleDarkMode}
                                        >
                                            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                            Mode {isDarkMode ? 'clair' : 'sombre'}
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            className="justify-start gap-2"
                                            onClick={() => setCurrentPage('history')}
                                        >
                                            <History className="w-4 h-4" />
                                            Historique
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            className="justify-start gap-2"
                                            onClick={() => setCurrentPage('guide')}
                                        >
                                            <BookOpen className="w-4 h-4" />
                                            Guide
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            className="justify-start gap-2"
                                            onClick={() => setCurrentPage('settings')}
                                        >
                                            <Settings className="w-4 h-4" />
                                            Paramètres
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            className="justify-start gap-2 text-destructive hover:text-destructive"
                                            onClick={onLogout}
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Déconnexion
                                        </Button>
                                    </div>
                                </SheetContent>
                            </Sheet>

                            {/* Desktop Menu */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleDarkMode}
                                className="hidden sm:flex"
                            >
                                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentPage('history')}
                                className="hidden sm:flex gap-2"
                            >
                                <History className="w-4 h-4" />
                                <span className="hidden lg:inline">Historique</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentPage('guide')}
                                className="hidden sm:flex gap-2"
                            >
                                <BookOpen className="w-4 h-4" />
                                <span className="hidden lg:inline">Guide</span>
                            </Button>
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium">{userName}</p>
                                <p className="text-xs text-muted-foreground">En ligne</p>
                            </div>
                            <Avatar className="w-8 h-8 hidden sm:block">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    {userName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentPage('settings')}
                                className="hidden sm:flex"
                            >
                                <Settings className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onLogout}
                                className="hidden md:flex"
                            >
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Desktop Sidebar */}
                <div className="hidden md:block">
                    <ConversationSidebar
                        conversations={conversations}
                        activeConversationId={activeConversationId}
                        onSelectConversation={handleSelectConversation}
                        onDeleteConversation={handleDeleteConversation}
                        onRenameConversation={handleRenameConversation}
                        onPinConversation={handlePinConversation}
                    />
                </div>

                <MainChatInterface
                    conversationId={activeConversationId}
                    messages={activeConversationId ? conversationMessages[activeConversationId] || [] : []}
                    onSendMessage={handleSendMessage}
                    onActionClick={handleActionClick}
                    userName={userName}
                    isTyping={isTyping}
                />
            </div>
        </div>
    );
}
