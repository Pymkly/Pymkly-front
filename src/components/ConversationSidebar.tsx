import { useState } from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
    MessageSquare,
    Search,
    Edit3,
    Trash2,
    MoreVertical,
    Pin,
    PinOff
} from 'lucide-react';

export interface Conversation {
    id: string;
    title: string;
    lastMessage: string;
    timestamp: Date;
    isActive: boolean;
    isPinned?: boolean;
}

interface ConversationSidebarProps {
    conversations: Conversation[];
    activeConversationId: string | null;
    onSelectConversation: (id: string) => void;
    onDeleteConversation: (id: string) => void;
    onRenameConversation: (id: string, newTitle: string) => void;
    onPinConversation: (id: string) => void;
}

export function ConversationSidebar({
                                        conversations,
                                        activeConversationId,
                                        onSelectConversation,
                                        onDeleteConversation,
                                        onRenameConversation,
                                        onPinConversation
                                    }: ConversationSidebarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');

    // Séparer les conversations épinglées et non-épinglées
    const filteredConversations = conversations.filter(conv =>
        conv.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pinnedConversations = filteredConversations.filter(conv => conv.isPinned);
    const unpinnedConversations = filteredConversations.filter(conv => !conv.isPinned);
    const sortedConversations = [...pinnedConversations, ...unpinnedConversations];

    const handleStartEdit = (conv: Conversation) => {
        setEditingId(conv.id);
        setEditTitle(conv.title);
    };

    const handleSaveEdit = () => {
        if (editingId && editTitle.trim()) {
            onRenameConversation(editingId, editTitle.trim());
        }
        setEditingId(null);
        setEditTitle('');
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditTitle('');
    };

    return (
        <div className="w-full md:w-80 lg:w-80 border-r bg-muted/10 flex flex-col h-full">
            {/* Header */}
            <div className="p-3 md:p-4 border-b">
                <h2 className="text-lg md:text-xl mb-4 font-geo">Conversations</h2>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="p-2 space-y-2">
                        {sortedConversations.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p className="text-sm">
                                    {searchQuery ? 'Aucune conversation trouvée' : 'Aucune conversation'}
                                </p>
                                {!searchQuery && (
                                    <p className="text-xs mt-2">
                                        Commencez une nouvelle conversation
                                    </p>
                                )}
                            </div>
                        ) : (
                            sortedConversations.map((conversation) => (
                                <div
                                    key={conversation.id}
                                    className={`group relative rounded-lg p-3 cursor-pointer transition-colors hover:bg-accent ${
                                        activeConversationId === conversation.id
                                            ? 'bg-accent border border-border'
                                            : ''
                                    }`}
                                    onClick={() => onSelectConversation(conversation.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-primary flex-shrink-0">
                                            {conversation.isPinned ? (
                                                <Pin className="w-4 h-4" />
                                            ) : (
                                                <MessageSquare className="w-4 h-4" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            {editingId === conversation.id ? (
                                                <Input
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleSaveEdit();
                                                        if (e.key === 'Escape') handleCancelEdit();
                                                    }}
                                                    onBlur={handleSaveEdit}
                                                    className="h-7 text-sm p-1"
                                                    autoFocus
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                <h4 className="font-medium truncate pr-1">{conversation.title}</h4>
                                            )}
                                        </div>

                                        {/* Menu à 3 points - toujours visible */}
                                        <div className="flex-shrink-0 ml-auto" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 w-8 p-0 border-border/50 hover:border-border hover:bg-accent"
                                                        aria-label="Options de conversation"
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleStartEdit(conversation);
                                                        }}
                                                    >
                                                        <Edit3 className="w-4 h-4 mr-2" />
                                                        Renommer
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onPinConversation(conversation.id);
                                                        }}
                                                    >
                                                        {conversation.isPinned ? (
                                                            <>
                                                                <PinOff className="w-4 h-4 mr-2" />
                                                                Désépingler
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Pin className="w-4 h-4 mr-2" />
                                                                Épingler
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onDeleteConversation(conversation.id);
                                                        }}
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Supprimer
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>
            {/* Footer */}
            <div className="p-4 border-t">
                <div className="text-xs text-muted-foreground text-center">
                    {conversations.length} conversation(s)
                </div>
            </div>
        </div>
    );
}