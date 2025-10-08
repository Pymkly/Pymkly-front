import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Bot, LogOut, Settings, Menu } from 'lucide-react';
import { ConversationSidebar, type Conversation } from './ConversationSidebar';
import { MainChatInterface, type ChatMessage } from './MainChatInterface';
import axios from 'axios';
import {config} from "../config/config.ts";

interface DashboardProps {
  userEmail: string;
  onLogout: () => void;
}

export function Dashboard({ userEmail, onLogout }: DashboardProps) {
  const apiUrl = config["apiUrl"];
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Planification projet Q1',
      lastMessage: 'Je vais vous aider à organiser votre projet pour le premier trimestre...',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      category: 'general',
      isActive: false
    },
  ]);

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<Record<string, ChatMessage[]>>({
  });

  const [isTyping, setIsTyping] = useState(false);
  console.log(isTyping);

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
  const generateAIResponse = async (userMessage: string, conversationId: string): Promise<ChatMessage> => {

    try {
      let text = userMessage;
      const response = await axios.post(
          `${apiUrl}/answer`,
          { text, "thread_id": conversationId }, // Utilise l'UUID stocké
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
      );
      const { result, thread_id } = response.data;
      localStorage.setItem('uuid', thread_id);
      return {
        id: Date.now().toString(),
        content: result,
        isUser: false,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Erreur answer:', error);
      return {
        id: Date.now().toString(),
        content: (''+error).toString(),
        isUser: false,
        timestamp: new Date(),
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

  const handleCreateConversation = async (title: string, category: Conversation['category']) => {


    try {
      const response = await axios.post(
          `${apiUrl}/threads`,
          {
            "label" : title
          },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
      );
      const { id } = response.data;
      const newConversation: Conversation = {
        id: id,
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
    } catch (error) {
      console.error('Erreur answer:', error);
      // alert('Erreur : ' + (error.response?.data?.detail || 'Problème avec la requête'));
    }
    

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

  const handleSendMessage = async (message: string, conversationId: string, next : () => void) => {
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

    const placeholderId = `placeholder-${Date.now()}`;
    setConversationMessages(prev => ({
      ...prev,
      [conversationId]: [
        ...(prev[conversationId] || []),
        { id: placeholderId, content: '', isUser: false, timestamp: new Date(), isPlaceholder: true },
      ],
    }));

    // Mettre à jour la conversation
    // setConversations(prev => prev.map(conv =>
    //   conv.id === conversationId
    //     ? { ...conv, lastMessage: message, timestamp: new Date() }
    //     : conv
    // ));

    // Simuler l'IA qui tape
    setIsTyping(true);
    try {
      const aiResponse = await generateAIResponse(message, conversationId);

      // setConversationMessages(prev => ({
      //   ...prev,
      //   [conversationId]: [...(prev[conversationId] || []), aiResponse]
      //   // [conversationId]: [...(prev[conversationId] || []), userMessage, aiResponse]
      // }));

      setConversationMessages(prev => ({
        ...prev,
        [conversationId]: prev[conversationId].map(msg =>
            msg.id === placeholderId ? aiResponse : msg,
        ),
      }));

      setIsTyping(false);
      next();
    } catch (error) {
      // Gérer l'erreur si besoin
      setConversationMessages(prev => ({
        ...prev,
        [conversationId]: prev[conversationId].map(msg =>
            msg.id === placeholderId ? { ...msg, content: 'Erreur lors de la réponse.', isPlaceholder: false } : msg,
        ),
      }));
    } finally {
      setIsTyping(false); // Si tu réutilises isTyping, sinon retire
      next();
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