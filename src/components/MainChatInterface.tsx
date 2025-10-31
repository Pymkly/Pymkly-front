import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import {
    Send,
    Bot,
    User,
    Calendar,
    Mail,
    CheckSquare,
    FileText,
} from 'lucide-react';

export interface ChatMessage {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
    suggestions?: string[];
    isPlaceholder?: boolean;
    actions?: Array<{
        type: 'task' | 'calendar' | 'email' | 'note';
        label: string;
        data: any;
    }>;
}

interface MainChatInterfaceProps {
    conversationId: string | null;
    messages: ChatMessage[];
    onSendMessage: (message: string, conversationId: string | null, placeholderId: string, next: () => void) => void;
    onActionClick: (action: any) => void;
    userName: string;
    isTyping?: boolean;
}

export function MainChatInterface({
                                      conversationId,
                                      messages,
                                      onSendMessage,
                                      userName,
                                      isTyping = false
                                  }: MainChatInterfaceProps) {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [startWrite, setStartWrite] = useState(false);
    const [currentTypingId, setCurrentTypingId] = useState<string | null>(null); // ID du message en cours d'écriture
    const [displayedContent, setDisplayedContent] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingInterval = useRef<number | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isLoading]);

    useEffect(() => {
        if (!isLoading && startWrite) {
            const lastMessage = messages[messages.length - 1];
            setCurrentTypingId(lastMessage.id);
            if (lastMessage && !lastMessage.isUser && lastMessage.content) {
                const words = lastMessage.content.split(' ');
                let wordIndex = 0;
                if (typingInterval.current !== null) clearInterval(typingInterval.current);
                typingInterval.current = setInterval(() => {
                    setDisplayedContent(words.slice(0, wordIndex + 1).join(' ') + (wordIndex < words.length - 1 ? ' ' : ''));
                    wordIndex++;
                    if (wordIndex >= words.length) {
                        clearInterval(typingInterval.current!);
                        setDisplayedContent('');
                        setCurrentTypingId(null);
                        setStartWrite(false);
                    }
                    scrollToBottom();
                }, 50); // Délai entre chaque mot (300ms, ajustable)
            }
        }
        return () => {
            if (typingInterval.current) clearInterval(typingInterval.current);
        };
    }, [isLoading, messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        setIsLoading(true);

        const placeholderId = `placeholder-${Date.now()}`;
        onSendMessage(input.trim(), conversationId, placeholderId, ()=> {
            console.log("tonga eto am next")
            console.log(placeholderId);
            setIsLoading(false);
            setStartWrite(true);
            // const lastMessage = messages[messages.length - 1];
            // setCurrentTypingId(lastMessage.id);
        });
        setInput('');
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInput(suggestion);
    };

    const welcomeMessage = {
        id: 'welcome',
        content: `Bonjour ${userName} ! 👋\n\nJe suis votre assistant IA spécialisé dans la gestion de tâches, la planification et l'organisation d'emails. Je voyage avec vous sans soucis sur vos activités !\n\nComment puis-je vous aider aujourd'hui ?`,
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
            label: 'Nouvelle tâche',
            prompt: 'Je veux créer une nouvelle tâche'
        },
        {
            icon: Calendar,
            label: 'Planifier',
            prompt: 'Je veux planifier un événement'
        },
        {
            icon: Mail,
            label: 'Email',
            prompt: 'Je veux composer un email'
        },
        {
            icon: FileText,
            label: 'Note',
            prompt: 'Je veux prendre une note'
        }
    ];

    const displayMessages = (conversationId && messages.length > 0) ? messages : [welcomeMessage];

    return (
        <div className="flex-1 flex flex-col h-full">
            {/* Header */}
            <div className="flex-shrink-0 border-b p-3 md:p-4 bg-background/95 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Bot className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
                    </div>
                    <div>
                        <h3 className="text-sm md:text-base font-geo">Assistant IA</h3>
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
                            {displayMessages.map((message, index) => (
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
                                                    ? 'bg-primary text-primary-foreground ml-auto shadow-sm'
                                                    : 'bg-card border shadow-sm'
                                            }`}
                                        >
                                            {/*<p className="whitespace-pre-wrap text-sm md:text-base">{message.content}</p>*/}
                                            {isLoading && index === displayMessages.length - 1 && !message.isUser ? (
                                                // <div className="flex items-center space-x-1">
                                                //   <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                                //   <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                                                //        style={{animationDelay: '0.2s'}}></div>
                                                //   <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                                                //        style={{animationDelay: '0.4s'}}></div>
                                                //   <span className="ml-2 text-sm md:text-base text-gray-500  animate-pulse">Chargement...</span>
                                                // </div>
                                                <div className="flex items-center space-x-1">
                                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-high-bounce"></div>
                                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-high-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-high-bounce" style={{ animationDelay: '0.4s' }}></div>
                                                    {/*<span className="ml-2 text-sm md:text-base text-gray-500">Chargement...</span>*/}
                                                </div>
                                            ) : (
                                                <ReactMarkdown
                                                    components={{
                                                        p: ({children}) => (
                                                            <p className="text-sm md:text-base mb-0">{children}</p>
                                                        ),
                                                    }}
                                                    rehypePlugins={[rehypeRaw, rehypeStringify]}
                                                >
                                                    {message.id === currentTypingId ? displayedContent : message.content}
                                                    {/*{`${message.id === currentTypingId}` }*/}
                                                </ReactMarkdown>
                                            )}
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
            <div className="flex-shrink-0 border-t bg-background/95 backdrop-blur-sm p-3 md:p-4">
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
                        <textarea
                            placeholder="Demandez-moi de créer une tâche, planifier un événement..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
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