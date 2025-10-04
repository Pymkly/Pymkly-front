import { useState } from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Plus, 
  MessageSquare, 
  Search, 
  Calendar, 
  Mail, 
  CheckSquare, 
  MoreHorizontal,
  Edit3,
  Trash2
} from 'lucide-react';

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  category: 'general' | 'tasks' | 'calendar' | 'email';
  isActive: boolean;
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onCreateConversation: (title: string, category: Conversation['category']) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
}

export function ConversationSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation,
  onRenameConversation
}: ConversationSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [newChatCategory, setNewChatCategory] = useState<Conversation['category']>('general');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tasks': return <CheckSquare className="w-4 h-4" />;
      case 'calendar': return <Calendar className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tasks': return 'text-green-500';
      case 'calendar': return 'text-blue-500';
      case 'email': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'tasks': return 'Tâches';
      case 'calendar': return 'Calendrier';
      case 'email': return 'Email';
      default: return 'Général';
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateChat = () => {
    if (newChatTitle.trim()) {
      onCreateConversation(newChatTitle.trim(), newChatCategory);
      setNewChatTitle('');
      setNewChatCategory('general');
      setIsNewChatOpen(false);
    }
  };

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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl">Conversations</h2>
          <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nouveau</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvelle conversation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chat-title">Titre de la conversation</Label>
                  <Input
                    id="chat-title"
                    placeholder="Ex: Planification projet Q1"
                    value={newChatTitle}
                    onChange={(e) => setNewChatTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateChat()}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label>Catégorie</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { value: 'general', label: 'Général', icon: MessageSquare },
                      { value: 'tasks', label: 'Tâches', icon: CheckSquare },
                      { value: 'calendar', label: 'Calendrier', icon: Calendar },
                      { value: 'email', label: 'Email', icon: Mail }
                    ].map(({ value, label, icon: Icon }) => (
                      <Button
                        key={value}
                        variant={newChatCategory === value ? 'default' : 'outline'}
                        className="gap-2 justify-start"
                        onClick={() => setNewChatCategory(value as Conversation['category'])}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Button onClick={handleCreateChat} className="w-full">
                  Créer la conversation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Conversation List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">
                {searchQuery ? 'Aucune conversation trouvée' : 'Aucune conversation'}
              </p>
              {!searchQuery && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setIsNewChatOpen(true)}
                >
                  Créer une conversation
                </Button>
              )}
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group relative rounded-lg p-3 cursor-pointer transition-colors hover:bg-accent ${
                  activeConversationId === conversation.id 
                    ? 'bg-accent border border-border' 
                    : ''
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 ${getCategoryColor(conversation.category)}`}>
                    {getCategoryIcon(conversation.category)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {editingId === conversation.id ? (
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        onBlur={handleSaveEdit}
                        className="h-6 text-sm p-1"
                        autoFocus
                      />
                    ) : (
                      <h4 className="font-medium truncate">{conversation.title}</h4>
                    )}
                    
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {conversation.lastMessage}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="text-xs">
                        {getCategoryBadge(conversation.category)}
                      </Badge>
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        {conversation.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        // const menu = document.createElement('div');
                        // Simple context menu logic
                      }}
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                {/* Quick actions */}
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(conversation);
                    }}
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conversation.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground text-center">
          {conversations.length} conversation(s)
        </div>
      </div>
    </div>
  );
}