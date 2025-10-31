import { useState } from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import {
    Calendar,
    Mail,
    CheckSquare,
    FileText,
    ArrowLeft,
    Filter,
    Search,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Action {
    id: string;
    type: 'task' | 'calendar' | 'email' | 'note';
    title: string;
    description: string;
    timestamp: Date;
    status: 'success' | 'failed' | 'pending';
    data?: any;
}

interface HistoryPageProps {
    onBack: () => void;
}

export function HistoryPage({ onBack }: HistoryPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Données de démonstration
    const [actions] = useState<Action[]>([
        {
            id: '1',
            type: 'task',
            title: 'Tâche créée: Finaliser rapport Q1',
            description: 'Tâche créée avec priorité haute pour finaliser le rapport du premier trimestre',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            status: 'success',
            data: { priority: 'high', deadline: '2025-10-25' }
        },
        {
            id: '2',
            type: 'calendar',
            title: 'Événement ajouté: Réunion équipe',
            description: 'Réunion d\'équipe planifiée pour jeudi 23 octobre à 14h00',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            status: 'success',
            data: { date: '2025-10-23', time: '14:00' }
        },
        {
            id: '3',
            type: 'email',
            title: 'Brouillon créé: Email client',
            description: 'Brouillon d\'email professionnel préparé pour le client ABC Corp',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            status: 'success',
            data: { recipient: 'client@abccorp.com' }
        },
        {
            id: '4',
            type: 'task',
            title: 'Tâche créée: Réviser présentation',
            description: 'Tâche créée pour réviser la présentation du projet',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
            status: 'success',
            data: { priority: 'medium' }
        },
        {
            id: '5',
            type: 'calendar',
            title: 'Événement ajouté: Appel client',
            description: 'Appel planifié avec le client pour discuter du projet',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            status: 'success',
            data: { date: '2025-10-22', time: '10:00' }
        },
        {
            id: '6',
            type: 'note',
            title: 'Note sauvegardée: Idées brainstorming',
            description: 'Notes de la session de brainstorming sauvegardées',
            timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
            status: 'success'
        }
    ]);

    const getActionIcon = (type: string) => {
        switch (type) {
            case 'task': return <CheckSquare className="w-5 h-5" />;
            case 'calendar': return <Calendar className="w-5 h-5" />;
            case 'email': return <Mail className="w-5 h-5" />;
            case 'note': return <FileText className="w-5 h-5" />;
            default: return <FileText className="w-5 h-5" />;
        }
    };

    const getActionColor = (type: string) => {
        switch (type) {
            case 'task': return 'text-primary';
            case 'calendar': return 'text-blue-500';
            case 'email': return 'text-purple-500';
            case 'note': return 'text-amber-500';
            default: return 'text-muted-foreground';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
            case 'pending': return <Clock className="w-4 h-4 text-amber-500" />;
            default: return null;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'task': return 'Tâche';
            case 'calendar': return 'Calendrier';
            case 'email': return 'Email';
            case 'note': return 'Note';
            default: return type;
        }
    };

    const filteredActions = actions.filter(action => {
        const matchesSearch =
            action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            action.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || action.type === filterType;
        const matchesStatus = filterStatus === 'all' || action.status === filterStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

    const formatRelativeTime = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'À l\'instant';
        if (diffMins < 60) return `Il y a ${diffMins} min`;
        if (diffHours < 24) return `Il y a ${diffHours}h`;
        if (diffDays === 1) return 'Hier';
        if (diffDays < 7) return `Il y a ${diffDays} jours`;
        return date.toLocaleDateString('fr-FR');
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
                        <h1 className="text-xl md:text-2xl font-geo">Historique des Actions</h1>
                        <p className="text-sm text-muted-foreground">
                            Toutes les actions effectuées par l'IA
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="border-b bg-background p-3 md:p-4">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher une action..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les types</SelectItem>
                                <SelectItem value="task">Tâches</SelectItem>
                                <SelectItem value="calendar">Calendrier</SelectItem>
                                <SelectItem value="email">Emails</SelectItem>
                                <SelectItem value="note">Notes</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous</SelectItem>
                                <SelectItem value="success">Réussi</SelectItem>
                                <SelectItem value="pending">En cours</SelectItem>
                                <SelectItem value="failed">Échoué</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Actions List */}
            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="p-3 md:p-4">
                        <div className="max-w-4xl mx-auto space-y-3">
                            {filteredActions.length === 0 ? (
                                <div className="text-center py-12">
                                    <Filter className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                                    <p className="text-muted-foreground">
                                        Aucune action trouvée
                                    </p>
                                </div>
                            ) : (
                                filteredActions.map((action) => (
                                    <Card key={action.id} className="hover:bg-accent/50 transition-colors">
                                        <CardContent className="p-4">
                                            <div className="flex gap-4">
                                                <div className={`flex-shrink-0 ${getActionColor(action.type)}`}>
                                                    {getActionIcon(action.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <h3 className="font-medium">{action.title}</h3>
                                                        {getStatusIcon(action.status)}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-3">
                                                        {action.description}
                                                    </p>
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <Badge variant="outline" className="text-xs">
                                                            {getTypeLabel(action.type)}
                                                        </Badge>
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Clock className="w-3 h-3" />
                                                            {formatRelativeTime(action.timestamp)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
