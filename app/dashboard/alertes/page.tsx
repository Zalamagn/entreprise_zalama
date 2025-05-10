"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, AlertTriangle, Bell, CheckCircle, Filter, Search, Clock, ArrowUpRight, Calendar, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import StatCard from '@/components/dashboard/StatCard';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Données fictives pour les alertes
const alertesData = [
  { 
    id: 1, 
    titre: "Pic de consommation CPU détecté", 
    description: "Le serveur principal a atteint 95% d'utilisation CPU pendant plus de 10 minutes.", 
    date: "02/05/2025 - 14:32", 
    type: "Critique", 
    source: "Système",
    statut: "Non résolue"
  },
  { 
    id: 2, 
    titre: "Tentative de connexion suspecte", 
    description: "Plusieurs tentatives de connexion échouées depuis une adresse IP inconnue.", 
    date: "02/05/2025 - 10:15", 
    type: "Sécurité", 
    source: "Authentification",
    statut: "En cours"
  },
  { 
    id: 3, 
    titre: "Mise à jour système disponible", 
    description: "Une mise à jour de sécurité importante est disponible pour votre système.", 
    date: "01/05/2025 - 18:45", 
    type: "Information", 
    source: "Système",
    statut: "Non résolue"
  },
  { 
    id: 4, 
    titre: "Espace disque faible", 
    description: "Le serveur de stockage n'a plus que 10% d'espace disque disponible.", 
    date: "01/05/2025 - 15:20", 
    type: "Avertissement", 
    source: "Stockage",
    statut: "En cours"
  },
  { 
    id: 5, 
    titre: "Erreur de paiement", 
    description: "La transaction #TR-2025-042 a échoué en raison d'un problème de carte bancaire.", 
    date: "30/04/2025 - 11:05", 
    type: "Avertissement", 
    source: "Paiement",
    statut: "Résolue"
  },
  { 
    id: 6, 
    titre: "Pic de trafic utilisateurs", 
    description: "Nombre d'utilisateurs simultanés supérieur à 500 pendant plus de 30 minutes.", 
    date: "29/04/2025 - 16:30", 
    type: "Information", 
    source: "Trafic",
    statut: "Résolue"
  },
  { 
    id: 7, 
    titre: "Échec de sauvegarde", 
    description: "La sauvegarde automatique quotidienne a échoué en raison d'une erreur réseau.", 
    date: "28/04/2025 - 03:15", 
    type: "Critique", 
    source: "Sauvegarde",
    statut: "Résolue"
  },
  { 
    id: 8, 
    titre: "Expiration de certificat SSL", 
    description: "Le certificat SSL pour le domaine example.com expire dans 7 jours.", 
    date: "27/04/2025 - 09:45", 
    type: "Avertissement", 
    source: "Sécurité",
    statut: "Non résolue"
  }
];

// Statistiques des alertes
const stats = [
  { label: "Alertes actives", value: 5, icon: <AlertCircle />, accent: "bg-red-600" },
  { label: "Critiques", value: 1, icon: <AlertTriangle />, accent: "bg-red-600" },
  { label: "Avertissements", value: 2, icon: <Bell />, accent: "bg-amber-600" },
  { label: "Informations", value: 2, icon: <CheckCircle />, accent: "bg-blue-600" },
];

// Données pour le graphique d'évolution des alertes
const evolutionData = [
  { jour: 'Lun', critiques: 2, avertissements: 3, informations: 4 },
  { jour: 'Mar', critiques: 1, avertissements: 2, informations: 5 },
  { jour: 'Mer', critiques: 0, avertissements: 4, informations: 3 },
  { jour: 'Jeu', critiques: 3, avertissements: 2, informations: 2 },
  { jour: 'Ven', critiques: 1, avertissements: 2, informations: 2 },
  { jour: 'Sam', critiques: 0, avertissements: 1, informations: 1 },
  { jour: 'Dim', critiques: 0, avertissements: 0, informations: 3 },
];

// Données pour le graphique de répartition des alertes par source
const sourceData = [
  { name: 'Système', value: 2, color: '#3b82f6' },
  { name: 'Sécurité', value: 2, color: '#ef4444' },
  { name: 'Stockage', value: 1, color: '#f59e0b' },
  { name: 'Paiement', value: 1, color: '#10b981' },
  { name: 'Trafic', value: 1, color: '#8b5cf6' },
  { name: 'Sauvegarde', value: 1, color: '#ec4899' },
];

export default function AlertesPage() {
  const { isAuthenticated, currentCompany } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Rediriger vers la page de login si l'utilisateur n'est pas authentifié
  useEffect(() => {
    if (!isAuthenticated || !currentCompany) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, currentCompany, router]);

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Chargement des alertes...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[var(--zalama-text)]">Alertes</h1>
      <p className="text-[var(--zalama-text)]/70 mb-4">Entreprise: {currentCompany?.name}</p>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      
      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        {/* Évolution des alertes */}
        <div className="bg-[var(--zalama-card)] rounded-lg border border-[var(--zalama-border)] p-6">
          <h2 className="text-lg font-semibold text-[var(--zalama-text)] mb-4">Évolution des alertes (7 derniers jours)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={evolutionData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--zalama-border)" />
                <XAxis dataKey="jour" stroke="var(--zalama-text)" />
                <YAxis stroke="var(--zalama-text)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--zalama-card)', 
                    borderColor: 'var(--zalama-border)' 
                  }}
                  labelStyle={{ color: 'var(--zalama-text)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="critiques" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 8 }} name="Critiques" />
                <Line type="monotone" dataKey="avertissements" stroke="#f59e0b" strokeWidth={2} name="Avertissements" />
                <Line type="monotone" dataKey="informations" stroke="#3b82f6" strokeWidth={2} name="Informations" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Répartition par source */}
        <div className="bg-[var(--zalama-card)] rounded-lg border border-[var(--zalama-border)] p-6">
          <h2 className="text-lg font-semibold text-[var(--zalama-text)] mb-4">Répartition par source</h2>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--zalama-card)', 
                    borderColor: 'var(--zalama-border)' 
                  }}
                  labelStyle={{ color: 'var(--zalama-text)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Barre d&apos;actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-2">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Rechercher une alerte..." 
              className="pl-10 pr-4 py-2 rounded-lg border border-[var(--zalama-border)] bg-[var(--zalama-bg-light)] text-[var(--zalama-text)] w-full sm:w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--zalama-border)] bg-[var(--zalama-bg-light)] text-[var(--zalama-text)]">
            <Filter className="h-4 w-4" />
            <span>Filtres</span>
          </button>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[var(--zalama-border)] bg-[var(--zalama-bg-light)] text-[var(--zalama-text)]">
            <Calendar className="h-4 w-4" />
            <span>Historique</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[var(--zalama-blue)] text-white">
            <CheckCircle className="h-4 w-4" />
            <span>Tout marquer comme lu</span>
          </button>
        </div>
      </div>
      
      {/* Liste des alertes */}
      <div className="space-y-4 mt-2">
        {alertesData.map((alerte) => (
          <div 
            key={alerte.id} 
            className="bg-[var(--zalama-card)] rounded-lg border border-[var(--zalama-border)] p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {alerte.type === 'Critique' && <AlertCircle className="h-6 w-6 text-red-500" />}
                {alerte.type === 'Avertissement' && <AlertTriangle className="h-6 w-6 text-amber-500" />}
                {alerte.type === 'Information' && <Bell className="h-6 w-6 text-blue-500" />}
                {alerte.type === 'Sécurité' && <AlertTriangle className="h-6 w-6 text-purple-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-semibold text-[var(--zalama-text)]">{alerte.titre}</h3>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                      alerte.statut === 'Non résolue' 
                        ? 'bg-red-100 text-red-800' 
                        : alerte.statut === 'En cours' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {alerte.statut}
                    </span>
                    <button className="p-1 rounded-full hover:bg-[var(--zalama-bg-light)] text-[var(--zalama-text)]/70 hover:text-[var(--zalama-text)]">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-sm text-[var(--zalama-text)]/80">{alerte.description}</p>
                <div className="mt-2 flex items-center text-xs text-[var(--zalama-text)]/60">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{alerte.date}</span>
                  </div>
                  <span className="mx-2">•</span>
                  <div>Source: {alerte.source}</div>
                  <div className="ml-auto">
                    <button className="flex items-center text-[var(--zalama-blue)] hover:underline">
                      <span>Voir les détails</span>
                      <ArrowUpRight className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-[var(--zalama-text)]/70">
          Affichage de 1 à 8 sur 15 alertes
        </div>
        <div className="flex gap-1">
          <button className="px-3 py-1 rounded border border-[var(--zalama-border)] bg-[var(--zalama-bg-light)] text-[var(--zalama-text)]">
            Précédent
          </button>
          <button className="px-3 py-1 rounded border border-[var(--zalama-border)] bg-[var(--zalama-blue)] text-white">
            1
          </button>
          <button className="px-3 py-1 rounded border border-[var(--zalama-border)] bg-[var(--zalama-bg-light)] text-[var(--zalama-text)]">
            2
          </button>
          <button className="px-3 py-1 rounded border border-[var(--zalama-border)] bg-[var(--zalama-bg-light)] text-[var(--zalama-text)]">
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}
