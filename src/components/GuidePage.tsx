import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
    MessageSquare,
    Plus,
    Pin,
    Settings,
    History,
    Calendar,
    Mail,
    CheckSquare,
    Sparkles
} from 'lucide-react';

export function GuidePage() {
    return (
        <div className="h-full p-4 md:p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-geo mb-2">Guide d'utilisation</h1>
                    <p className="text-sm md:text-base text-muted-foreground">
                        Apprenez à utiliser TaskMaster AI pour améliorer votre productivité
                    </p>
                </div>

                <Tabs defaultValue="conversations">
                    <TabsList className="grid w-full grid-cols-4 mb-6">
                        <TabsTrigger value="conversations" className="text-xs md:text-sm">
                            <MessageSquare className="w-4 h-4 mr-1 md:mr-2" />
                            <span className="hidden sm:inline">Conversations</span>
                        </TabsTrigger>
                        <TabsTrigger value="ia" className="text-xs md:text-sm">
                            <Sparkles className="w-4 h-4 mr-1 md:mr-2" />
                            <span className="hidden sm:inline">IA</span>
                        </TabsTrigger>
                        <TabsTrigger value="historique" className="text-xs md:text-sm">
                            <History className="w-4 h-4 mr-1 md:mr-2" />
                            <span className="hidden sm:inline">Historique</span>
                        </TabsTrigger>
                        <TabsTrigger value="parametres" className="text-xs md:text-sm">
                            <Settings className="w-4 h-4 mr-1 md:mr-2" />
                            <span className="hidden sm:inline">Paramètres</span>
                        </TabsTrigger>
                    </TabsList>

                    <div>
                        {/* Tab Conversations */}
                        <TabsContent value="conversations" className="mt-0">
                            <div className="space-y-4 max-w-3xl mx-auto">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MessageSquare className="w-5 h-5" />
                                            Gérer vos conversations
                                        </CardTitle>
                                        <CardDescription>
                                            Organisez et naviguez entre vos conversations avec l'IA
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <h4 className="font-medium mb-2 flex items-center gap-2">
                                                <Plus className="w-4 h-4" />
                                                Créer une nouvelle conversation
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Cliquez sur le bouton <strong>"Nouvelle conversation"</strong> dans le header pour commencer
                                                une nouvelle discussion avec l'IA. Le titre sera généré automatiquement à partir de votre
                                                premier message.
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-medium mb-2 flex items-center gap-2">
                                                <Pin className="w-4 h-4" />
                                                Épingler une conversation
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Cliquez sur les trois points (⋮) à droite d'une conversation et sélectionnez
                                                <strong> "Épingler"</strong>. Les conversations épinglées restent en haut de la liste
                                                pour un accès rapide.
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-medium mb-2">
                                                Renommer et supprimer
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Utilisez le menu à trois points (⋮) pour <strong>renommer</strong> une conversation ou
                                                la <strong>supprimer</strong> définitivement.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-primary/5 border-primary/20">
                                    <CardHeader>
                                        <CardTitle>💡 Astuce</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm">
                                            Les conversations épinglées sont identifiées par une icône 📌 et apparaissent toujours en haut de votre liste.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Tab IA */}
                        <TabsContent value="ia" className="mt-0">
                            <div className="space-y-4 max-w-3xl mx-auto">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Sparkles className="w-5 h-5" />
                                            Utiliser l'IA pour la productivité
                                        </CardTitle>
                                        <CardDescription>
                                            Demandez à l'IA de vous aider à gérer vos tâches quotidiennes
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div>
                                            <h4 className="font-medium mb-2 flex items-center gap-2">
                                                <CheckSquare className="w-4 h-4" />
                                                Créer des tâches
                                            </h4>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                L'IA peut créer automatiquement des tâches dans Google Tasks. Exemples :
                                            </p>
                                            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 ml-2">
                                                <li>"Ajoute une tâche pour appeler le dentiste demain"</li>
                                                <li>"Crée une liste de courses avec du lait, du pain et des œufs"</li>
                                                <li>"Rappelle-moi de préparer la présentation avant vendredi"</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="font-medium mb-2 flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                Planifier des événements
                                            </h4>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                L'IA peut ajouter des événements à Google Calendar. Exemples :
                                            </p>
                                            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 ml-2">
                                                <li>"Planifie une réunion jeudi à 14h"</li>
                                                <li>"Ajoute mon rendez-vous chez le médecin lundi à 10h30"</li>
                                                <li>"Crée un événement pour l'anniversaire de Marie le 15 mars"</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="font-medium mb-2 flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                Gérer les emails
                                            </h4>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                L'IA peut vous aider avec vos emails Gmail. Exemples :
                                            </p>
                                            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 ml-2">
                                                <li>"Rédige un email professionnel pour demander un congé"</li>
                                                <li>"Envoie un email de remerciement à jean@example.com"</li>
                                                <li>"Quels sont mes emails importants non lus ?"</li>
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-primary/5 border-primary/20">
                                    <CardHeader>
                                        <CardTitle>💡 Astuce</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm">
                                            Soyez précis dans vos demandes ! Plus vous donnez de détails (date, heure, priorité),
                                            meilleurs seront les résultats de l'IA.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Tab Historique */}
                        <TabsContent value="historique" className="mt-0">
                            <div className="space-y-4 max-w-3xl mx-auto">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <History className="w-5 h-5" />
                                            Consulter l'historique
                                        </CardTitle>
                                        <CardDescription>
                                            Suivez toutes les actions effectuées par l'IA
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-sm text-muted-foreground">
                                            La page <strong>Historique</strong> affiche toutes les actions que l'IA a effectuées
                                            pour vous (tâches créées, événements planifiés, emails envoyés). Vous pouvez :
                                        </p>
                                        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 ml-2">
                                            <li>Filtrer par type d'action (Tâche, Événement, Email)</li>
                                            <li>Filtrer par période (Aujourd'hui, Cette semaine, Ce mois)</li>
                                            <li>Rechercher dans l'historique</li>
                                            <li>Voir les détails de chaque action</li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card className="bg-primary/5 border-primary/20">
                                    <CardHeader>
                                        <CardTitle>💡 Astuce</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm">
                                            Consultez régulièrement l'historique pour garder une trace de toutes vos actions
                                            et ne rien oublier !
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Tab Paramètres */}
                        <TabsContent value="parametres" className="mt-0">
                            <div className="space-y-4 max-w-3xl mx-auto">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Settings className="w-5 h-5" />
                                            Configurer les autorisations
                                        </CardTitle>
                                        <CardDescription>
                                            Gérez les accès de l'application à vos services Google
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-sm text-muted-foreground">
                                            Dans la page <strong>Paramètres</strong>, vous pouvez :
                                        </p>
                                        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 ml-2">
                                            <li>Activer/désactiver l'accès à <strong>Gmail</strong></li>
                                            <li>Activer/désactiver l'accès à <strong>Google Calendar</strong></li>
                                            <li>Activer/désactiver l'accès à <strong>Google Tasks</strong></li>
                                            <li>Modifier vos informations de profil</li>
                                        </ul>
                                        <p className="text-sm text-muted-foreground mt-4">
                                            <strong>Note :</strong> Une confirmation vous sera demandée avant d'activer ou
                                            désactiver une autorisation pour éviter les modifications accidentelles.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-primary/5 border-primary/20">
                                    <CardHeader>
                                        <CardTitle>💡 Astuce</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm">
                                            Vous pouvez désactiver temporairement une autorisation si vous n'avez pas besoin
                                            d'une fonctionnalité spécifique. Cela n'affectera pas vos données existantes.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-primary/20">
                                    <CardHeader>
                                        <CardTitle>🔒 Sécurité et confidentialité</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <ul className="text-sm space-y-2">
                                            <li>✅ Vos données restent privées et sécurisées</li>
                                            <li>✅ Aucune donnée n'est partagée avec des tiers</li>
                                            <li>✅ Vous pouvez révoquer les autorisations à tout moment</li>
                                            <li>✅ Toutes les communications sont chiffrées</li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
