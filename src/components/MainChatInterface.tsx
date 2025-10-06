import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import {
  Send,
  Bot,
  User,
  CheckSquare,

} from 'lucide-react';

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
  actions?: Array<{
    type: 'task' | 'calendar' | 'email' | 'note';
    label: string;
    data: any;
  }>;
}

interface MainChatInterfaceProps {
  conversationId: string | null;
  messages: ChatMessage[];
  onSendMessage: (message: string, conversationId: string) => void;
  onActionClick: (action: any) => void;
  userName: string;
}

export function MainChatInterface({
                                    conversationId,
                                    messages,
                                    onSendMessage,
                                    userName
                                  }: MainChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim() || !conversationId) return;

    onSendMessage(input.trim(), conversationId);
    setInput('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const welcomeMessage = {
    id: 'welcome',
    content: `Bonjour ! Je suis votre assistant IA spécialisé dans la gestion de tâches, la planification et l'organisation d'emails. Comment puis-je vous aider aujourd'hui ?`,
    isUser: false,
    timestamp: new Date(),
    suggestions: [
      'Créer une nouvelle tâche urgente',
      'Planifier une réunion pour demain',
      'M\'aider à organiser mes emails',
      'Créer un planning pour la semaine',
      'Rédiger un email professionnel',
      'Définir mes priorités du jour'
    ]
  };

  const quickActions = [
    {
      icon: CheckSquare,
      label: 'Nouveau',
      prompt: 'Je veux créer une nouvelle tâche'
    },
  ];

  if (!conversationId) {
    return (
        <div className="flex-1 flex items-center justify-center bg-muted/5 p-4">
          <div className="text-center max-w-md w-full">
            <Bot className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg md:text-xl mb-2">Bienvenue sur TaskMaster AI</h3>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              Sélectionnez une conversation existante ou créez-en une nouvelle pour commencer à discuter avec votre assistant IA.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                  <Card key={index} className="cursor-pointer hover:bg-accent transition-colors">
                    <CardContent className="p-3 md:p-4 text-center">
                      <action.icon className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-2" />
                      <p className="text-xs md:text-sm font-medium">{action.label}</p>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </div>
        </div>
    );
  }

  const displayMessages = messages.length === 0 ? [welcomeMessage] : messages;

  return (
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 border-b p-3 md:p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="w-4 h-4 md:w-5 md:h-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm md:text-base">Assistant IA TaskMaster</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                {isTyping ? 'En train d\'écrire...' : 'En ligne • Spécialisé en productivité'}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-3 md:p-4">
              <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
                {displayMessages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-2 md:gap-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!message.isUser && (
                          <Avatar className="w-7 h-7 md:w-8 md:h-8 flex-shrink-0">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              <Bot className="w-3 h-3 md:w-4 md:h-4" />
                            </AvatarFallback>
                          </Avatar>
                      )}

                      <div className={`max-w-[85%] md:max-w-[80%] ${message.isUser ? 'order-first' : ''}`}>
                        <div
                            className={`rounded-lg p-3 md:p-4 ${
                                message.isUser
                                    ? 'bg-primary text-primary-foreground ml-auto'
                                    : 'bg-muted'
                            }`}
                        >
                          <p className="whitespace-pre-wrap text-sm md:text-base">{message.content}</p>
                        </div>

                        {message.suggestions && (
                            <div className="flex flex-wrap gap-1 md:gap-2 mt-2 md:mt-3">
                              {message.suggestions.map((suggestion, index) => (
                                  <Badge
                                      key={index}
                                      variant="outline"
                                      className="cursor-pointer hover:bg-accent transition-colors text-xs"
                                      onClick={() => handleSuggestionClick(suggestion)}
                                  >
                                    {suggestion}
                                  </Badge>
                              ))}
                            </div>
                        )}

                        <p className="text-xs text-muted-foreground mt-1 md:mt-2">
                          {message.timestamp && message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>

                      {message.isUser && (
                          <Avatar className="w-7 h-7 md:w-8 md:h-8 flex-shrink-0">
                            <AvatarFallback>
                              <User className="w-3 h-3 md:w-4 md:h-4" />
                            </AvatarFallback>
                          </Avatar>
                      )}
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-2 md:gap-4">
                      <Avatar className="w-7 h-7 md:w-8 md:h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="w-3 h-3 md:w-4 md:h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg p-3 md:p-4">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                )}

                {/* Invisible element to scroll to */}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Input - Fixed at bottom */}
        <div className="flex-shrink-0 border-t bg-background p-3 md:p-4">
          <div className="max-w-4xl mx-auto">
            {/* Quick Actions */}
            <div className="flex gap-1 md:gap-2 mb-3 md:mb-4 overflow-x-auto pb-2 md:pb-0">
              {quickActions.map((action, index) => (
                  <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="gap-1 md:gap-2 flex-shrink-0"
                      onClick={() => setInput(action.prompt)}
                  >
                    <action.icon className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="text-xs md:text-sm">{action.label}</span>
                  </Button>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                  placeholder="Demandez-moi de créer une tâche, planifier un événement..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 text-sm md:text-base"
              />
              <Button onClick={handleSend} size="icon" disabled={!input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-2 text-center hidden md:block">
              L'IA peut faire des erreurs. Vérifiez les informations importantes.
            </p>
          </div>
        </div>
      </div>
  );
}