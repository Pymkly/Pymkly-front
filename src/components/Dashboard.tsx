import { useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Bot, LogOut, Settings, Menu } from 'lucide-react';
import { ConversationSidebar, type Conversation } from './ConversationSidebar';
import { MainChatInterface, type ChatMessage } from './MainChatInterface';

interface DashboardProps {
  userEmail: string;
  onLogout: () => void;
}

export function Dashboard({ userEmail, onLogout }: DashboardProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Planification projet Q1',
      lastMessage: 'Je vais vous aider à organiser votre projet pour le premier trimestre...',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      category: 'tasks',
      isActive: false
    },
    {
      id: '2',
      title: 'Organisation réunion équipe',
      lastMessage: 'Parfait ! J\'ai créé l\'événement dans votre calendrier pour jeudi prochain.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      category: 'calendar',
      isActive: false
    },
    {
      id: '3',
      title: 'Gestion emails clients',
      lastMessage: 'Voici un modèle d\'email professionnel pour répondre à vos clients...',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      category: 'email',
      isActive: false
    }
  ]);

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<Record<string, ChatMessage[]>>({
    '1': [
      {
        id: 'msg1',
        content: 'Bonjour ! Je souhaite organiser mon projet pour le Q1. Pouvez-vous m\'aider ?',
        isUser: true,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 'msg2',
        content: 'Bien sûr ! Je vais vous aider à planifier votre projet Q1. Commençons par définir vos objectifs principaux et les tâches prioritaires.',
        isUser: false,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000),
        suggestions: [
          'Créer une liste de tâches prioritaires',
          'Définir un calendrier de projet',
          'Organiser les réunions d\'équipe',
          'Suivre l\'avancement du projet'
        ]
      }
    ],
    '2': [
      {
        id: 'msg3',
        content: 'Je dois organiser une réunion d\'équipe pour jeudi prochain à 14h',
        isUser: true,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: 'msg4',
        content: 'Parfait ! Je peux vous aider à organiser cette réunion. Voici ce que je propose :',
        isUser: false,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000 + 15000),
        actions: [
          {
            type: 'calendar',
            label: 'Créer l\'événement',
            data: {
              title: 'Réunion équipe',
              date: 'jeudi prochain',
              time: '14:00'
            }
          }
        ]
      }
    ],
    '3': [
      {
        id: 'msg5',
        content: 'J\'ai besoin d\'aide pour rédiger des emails professionnels à mes clients',
        isUser: true,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: 'msg6',
        content: 'Je peux vous aider à rédiger des emails professionnels efficaces. Quel type d\'email souhaitez-vous créer ?',
        isUser: false,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 45000),
        suggestions: [
          'Email de suivi commercial',
          'Réponse à une réclamation',
          'Proposition de rendez-vous',
          'Email de remerciement'
        ]
      }
    ]
  });

  const [isTyping, setIsTyping] = useState(false);
  console.log(isTyping);
  const generateAIResponse = (userMessage: string): ChatMessage => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Détection d'intention pour les tâches
    if (lowerMessage.includes('tâche') || lowerMessage.includes('task') || lowerMessage.includes('faire') || lowerMessage.includes('travail')) {
      return {
        id: Date.now().toString(),
        content: 'Je peux vous aider à créer et organiser vos tâches. Voici ce que je propose basé sur votre demande :',
        isUser: false,
        timestamp: new Date(),
        actions: [{
          type: 'task',
          label: 'Créer cette tâche',
          data: {
            title: userMessage.includes('urgent') ? 'Tâche urgente' : 'Nouvelle tâche',
            description: userMessage,
            priority: userMessage.includes('urgent') ? 'high' : 'medium'
          }
        }],
        suggestions: [
          'Créer une tâche urgente',
          'Planifier une tâche pour demain',
          'Organiser mes priorités',
          'Créer une checklist'
        ]
      };
    }
    
    // Détection d'intention pour le calendrier
    if (lowerMessage.includes('rendez-vous') || lowerMessage.includes('réunion') || lowerMessage.includes('événement') || lowerMessage.includes('planifier')) {
      return {
        id: Date.now().toString(),
        content: 'Je peux vous aider à planifier cet événement. Voulez-vous que je l\'ajoute à votre calendrier ?',
        isUser: false,
        timestamp: new Date(),
        actions: [{
          type: 'calendar',
          label: 'Ajouter au calendrier',
          data: {
            title: 'Nouvel événement',
            description: userMessage
          }
        }],
        suggestions: [
          'Planifier pour demain',
          'Créer une réunion récurrente',
          'Programmer un rappel',
          'Organiser un événement'
        ]
      };
    }
    
    // Détection d'intention pour les emails
    if (lowerMessage.includes('email') || lowerMessage.includes('mail') || lowerMessage.includes('envoyer') || lowerMessage.includes('rédiger')) {
      return {
        id: Date.now().toString(),
        content: 'Je peux vous aider à rédiger cet email. Quel type d\'email souhaitez-vous créer ?',
        isUser: false,
        timestamp: new Date(),
        actions: [{
          type: 'email',
          label: 'Créer un brouillon',
          data: {
            subject: 'Nouvel email',
            body: userMessage
          }
        }],
        suggestions: [
          'Email professionnel',
          'Email de suivi',
          'Réponse formelle',
          'Email de remerciement'
        ]
      };
    }
    
    // Réponse générale
    return {
      id: Date.now().toString(),
      content: 'Je suis là pour vous aider avec la gestion de vos tâches, la planification de vos événements et la rédaction d\'emails. Que souhaitez-vous faire ?',
      isUser: false,
      timestamp: new Date(),
      suggestions: [
        'Créer une nouvelle tâche',
        'Planifier un événement',
        'Rédiger un email',
        'Organiser ma journée',
        'Prendre des notes',
        'Gérer mes priorités'
      ]
    };
  };

  const handleSelectConversation = (id: string) => {
    setConversations(prev => prev.map(conv => ({
      ...conv,
      isActive: conv.id === id
    })));
    setActiveConversationId(id);
  };

  const handleCreateConversation = (title: string, category: Conversation['category']) => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title,
      lastMessage: 'Conversation créée',
      timestamp: new Date(),
      category,
      isActive: false
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setConversationMessages(prev => ({
      ...prev,
      [newConversation.id]: []
    }));
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

  const handleSendMessage = async (message: string, conversationId: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date()
    };

    // Ajouter le message utilisateur
    setConversationMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), userMessage]
    }));

    // Mettre à jour la conversation
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, lastMessage: message, timestamp: new Date() }
        : conv
    ));

    // Simuler l'IA qui tape
    setIsTyping(true);

    // Simuler un délai de réponse
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      
      setConversationMessages(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), userMessage, aiResponse]
      }));

      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, lastMessage: aiResponse.content }
          : conv
      ));

      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
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
                <ConversationSidebar
                  conversations={conversations}
                  activeConversationId={activeConversationId}
                  onSelectConversation={(id) => {
                    handleSelectConversation(id);
                    setIsSidebarOpen(false);
                  }}
                  onCreateConversation={handleCreateConversation}
                  onDeleteConversation={handleDeleteConversation}
                  onRenameConversation={handleRenameConversation}
                />
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              <h1 className="text-lg md:text-xl font-semibold">TaskMaster AI</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">Assistant IA actif</p>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
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
            onCreateConversation={handleCreateConversation}
            onDeleteConversation={handleDeleteConversation}
            onRenameConversation={handleRenameConversation}
          />
        </div>
        
        <MainChatInterface
          conversationId={activeConversationId}
          messages={activeConversationId ? conversationMessages[activeConversationId] || [] : []}
          onSendMessage={handleSendMessage}
          onActionClick={handleActionClick}
          userName={userName}
        />
      </div>
    </div>
  );
}