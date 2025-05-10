"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import { FileText, CheckCircle, Clock, AlertCircle, Search, Filter, Calendar, Download, Plus, MoreHorizontal, User, Tag, MessageSquare } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';

// Données fictives pour les demandes
const demandesData = [
  { 
    id: "DEM-2025-001", 
    titre: "Demande de congés", 
    description: "Congés annuels du 15 au 30 juin 2025", 
    date: "02/05/2025", 
    type: "Congés", 
    demandeur: "Jean Dupont",
    statut: "En attente",
    priorite: "Normale",
    commentaires: 2
  },
  { 
    id: "DEM-2025-002", 
    titre: "Remboursement frais de déplacement", 
    description: "Mission client à Lyon du 25 au 27 avril 2025", 
    date: "30/04/2025", 
    type: "Remboursement", 
    demandeur: "Sophie Martin",
    statut: "Approuvée",
    priorite: "Normale",
    commentaires: 3
  },
  { 
    id: "DEM-2025-003", 
    titre: "Achat de matériel informatique", 
    description: "Demande d'un nouvel ordinateur portable pour le développement", 
    date: "28/04/2025", 
    type: "Matériel", 
    demandeur: "Thomas Petit",
    statut: "En cours de traitement",
    priorite: "Haute",
    commentaires: 5
  },
  { 
    id: "DEM-2025-004", 
    titre: "Formation React avancée", 
    description: "Demande de participation à la formation React avancée du 10 au 12 juin", 
    date: "25/04/2025", 
    type: "Formation", 
    demandeur: "Emma Leroy",
    statut: "Approuvée",
    priorite: "Normale",
    commentaires: 1
  },
  { 
    id: "DEM-2025-005", 
    titre: "Augmentation de salaire", 
    description: "Demande de réévaluation de salaire suite à l'évaluation annuelle", 
    date: "20/04/2025", 
    type: "RH", 
    demandeur: "Lucas Moreau",
    statut: "Refusée",
    priorite: "Normale",
    commentaires: 4
  },
  { 
    id: "DEM-2025-006", 
    titre: "Télétravail exceptionnel", 
    description: "Demande de télétravail pour la semaine du 5 au 9 mai", 
    date: "18/04/2025", 
    type: "Organisation", 
    demandeur: "Chloé Dubois",
    statut: "Approuvée",
    priorite: "Urgente",
    commentaires: 2
  },
  { 
    id: "DEM-2025-007", 
    titre: "Avance sur salaire", 
    description: "Demande d'avance sur salaire pour le mois de mai", 
    date: "15/04/2025", 
    type: "Finance", 
    demandeur: "Antoine Bernard",
    statut: "En attente",
    priorite: "Haute",
    commentaires: 0
  },
  { 
    id: "DEM-2025-008", 
    titre: "Changement d'équipe", 
    description: "Demande de transfert vers l'équipe de développement frontend", 
    date: "10/04/2025", 
    type: "RH", 
    demandeur: "Julie Robert",
    statut: "En cours de traitement",
    priorite: "Normale",
    commentaires: 6
  }
];

// Statistiques des demandes
const stats = [
  { label: "Total demandes", value: 42, icon: <FileText />, accent: "bg-blue-600" },
  { label: "En attente", value: 8, icon: <Clock />, accent: "bg-amber-600" },
  { label: "Approuvées", value: 28, icon: <CheckCircle />, accent: "bg-green-600" },
  { label: "Refusées", value: 6, icon: <AlertCircle />, accent: "bg-red-600" },
];

export default function DemandesPage() {
  // Utiliser useParams pour récupérer le slug de l'URL
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[var(--zalama-text)]">Demandes</h1>
      <p className="text-[var(--zalama-text)]/70">Entreprise: {slug}</p>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      
      {/* Barre d&apos;actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-2">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Rechercher une demande..." 
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
          <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[var(--zalama-border)] bg-[var(--zalama-bg-light)] text-[var(--zalama-text)]">
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[var(--zalama-blue)] text-white">
            <Plus className="h-4 w-4" />
            <span>Nouvelle demande</span>
          </button>
        </div>
      </div>
      
      {/* Liste des demandes */}
      <div className="space-y-4 mt-2">
        {demandesData.map((demande) => (
          <div 
            key={demande.id} 
            className="bg-[var(--zalama-card)] rounded-lg border border-[var(--zalama-border)] p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-[var(--zalama-text)]">{demande.titre}</h3>
                      <span className="text-xs text-[var(--zalama-text)]/60">{demande.id}</span>
                    </div>
                    <p className="mt-1 text-sm text-[var(--zalama-text)]/80">{demande.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                      demande.statut === 'En attente' 
                        ? 'bg-amber-100 text-amber-800' 
                        : demande.statut === 'Approuvée' 
                          ? 'bg-green-100 text-green-800' 
                          : demande.statut === 'Refusée'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                    }`}>
                      {demande.statut}
                    </span>
                    <button className="p-1 rounded-full hover:bg-[var(--zalama-bg-light)] text-[var(--zalama-text)]/70 hover:text-[var(--zalama-text)]">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--zalama-text)]/60">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    <span>{demande.demandeur}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{demande.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="h-3 w-3 mr-1" />
                    <span>{demande.type}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    <span>{demande.commentaires} commentaires</span>
                  </div>
                  <div className={`flex items-center px-2 py-0.5 rounded-full ${
                    demande.priorite === 'Urgente' 
                      ? 'bg-red-100 text-red-800' 
                      : demande.priorite === 'Haute' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-blue-100 text-blue-800'
                  }`}>
                    <span>Priorité: {demande.priorite}</span>
                  </div>
                </div>
              </div>
              <div className="flex md:flex-col gap-2 mt-3 md:mt-0">
                <button className="flex-1 md:w-full flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--zalama-blue)] text-white text-sm">
                  <CheckCircle className="h-3 w-3" />
                  <span>Approuver</span>
                </button>
                <button className="flex-1 md:w-full flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--zalama-border)] bg-[var(--zalama-bg-light)] text-[var(--zalama-text)] text-sm">
                  <AlertCircle className="h-3 w-3" />
                  <span>Refuser</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-[var(--zalama-text)]/70">
          Affichage de 1 à 8 sur 42 demandes
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
            3
          </button>
          <button className="px-3 py-1 rounded border border-[var(--zalama-border)] bg-[var(--zalama-bg-light)] text-[var(--zalama-text)]">
            4
          </button>
          <button className="px-3 py-1 rounded border border-[var(--zalama-border)] bg-[var(--zalama-bg-light)] text-[var(--zalama-text)]">
            5
          </button>
          <button className="px-3 py-1 rounded border border-[var(--zalama-border)] bg-[var(--zalama-bg-light)] text-[var(--zalama-text)]">
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}
