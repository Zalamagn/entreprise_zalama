"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import { BarChart2, TrendingUp, Users, Activity, Download, Calendar, Filter } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

// Statistiques générales
const stats = [
  { label: "Utilisateurs actifs", value: 1248, icon: <Users />, accent: "bg-blue-600" },
  { label: "Taux de conversion", value: "8.5%", icon: <TrendingUp />, accent: "bg-green-600" },
  { label: "Taux de satisfaction", value: "92%", icon: <Activity />, accent: "bg-purple-600" },
  { label: "Croissance mensuelle", value: "+12%", icon: <BarChart2 />, accent: "bg-amber-600" },
];

// Données pour le graphique d'évolution des utilisateurs
const usersData = [
  { mois: 'Jan', actifs: 980, nouveaux: 120, inactifs: 40 },
  { mois: 'Fév', actifs: 1050, nouveaux: 150, inactifs: 45 },
  { mois: 'Mar', actifs: 1120, nouveaux: 140, inactifs: 50 },
  { mois: 'Avr', actifs: 1180, nouveaux: 130, inactifs: 55 },
  { mois: 'Mai', actifs: 1248, nouveaux: 145, inactifs: 60 },
];

// Données pour le graphique de répartition des utilisateurs par rôle
const rolesData = [
  { name: 'Administrateurs', value: 12, color: '#3b82f6' },
  { name: 'Managers', value: 48, color: '#10b981' },
  { name: 'Employés', value: 980, color: '#f59e0b' },
  { name: 'Clients', value: 208, color: '#8b5cf6' },
];

// Données pour le graphique d'activité par jour de la semaine
const activityData = [
  { jour: 'Lun', activite: 85 },
  { jour: 'Mar', activite: 92 },
  { jour: 'Mer', activite: 78 },
  { jour: 'Jeu', activite: 95 },
  { jour: 'Ven', activite: 88 },
  { jour: 'Sam', activite: 45 },
  { jour: 'Dim', activite: 30 },
];

// Données pour le graphique de satisfaction
const satisfactionData = [
  { mois: 'Jan', satisfaction: 88 },
  { mois: 'Fév', satisfaction: 85 },
  { mois: 'Mar', satisfaction: 90 },
  { mois: 'Avr', satisfaction: 87 },
  { mois: 'Mai', satisfaction: 92 },
];

export default function StatistiquesPage() {
  // Utiliser useParams pour récupérer le slug de l'URL
  const params = useParams();
  const slug = params.slug as string;
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[var(--zalama-text)]">Statistiques</h1>
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
            <select 
              className="pl-4 pr-8 py-2 rounded-lg border border-[var(--zalama-border)] bg-[var(--zalama-bg-light)] text-[var(--zalama-text)] w-full sm:w-48 appearance-none"
            >
              <option value="30">Derniers 30 jours</option>
              <option value="60">Derniers 60 jours</option>
              <option value="90">Derniers 90 jours</option>
              <option value="180">Derniers 6 mois</option>
              <option value="365">Dernière année</option>
            </select>
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--zalama-border)] bg-[var(--zalama-bg-light)] text-[var(--zalama-text)]">
            <Filter className="h-4 w-4" />
            <span>Filtres</span>
          </button>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[var(--zalama-border)] bg-[var(--zalama-bg-light)] text-[var(--zalama-text)]">
          <Download className="h-4 w-4" />
          <span>Exporter les données</span>
        </button>
      </div>
      
      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        {/* Évolution des utilisateurs */}
        <div className="bg-[var(--zalama-card)] rounded-lg border border-[var(--zalama-border)] p-6">
          <h2 className="text-lg font-semibold text-[var(--zalama-text)] mb-4">Évolution des utilisateurs</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={usersData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--zalama-border)" />
                <XAxis dataKey="mois" stroke="var(--zalama-text)" />
                <YAxis stroke="var(--zalama-text)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--zalama-card)', 
                    borderColor: 'var(--zalama-border)' 
                  }}
                  labelStyle={{ color: 'var(--zalama-text)' }}
                />
                <Legend />
                <Area type="monotone" dataKey="actifs" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Utilisateurs actifs" />
                <Area type="monotone" dataKey="nouveaux" stackId="1" stroke="#10b981" fill="#10b981" name="Nouveaux utilisateurs" />
                <Area type="monotone" dataKey="inactifs" stackId="1" stroke="#ef4444" fill="#ef4444" name="Utilisateurs inactifs" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Répartition par rôle */}
        <div className="bg-[var(--zalama-card)] rounded-lg border border-[var(--zalama-border)] p-6">
          <h2 className="text-lg font-semibold text-[var(--zalama-text)] mb-4">Répartition par rôle</h2>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rolesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {rolesData.map((entry, index) => (
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
        
        {/* Activité par jour */}
        <div className="bg-[var(--zalama-card)] rounded-lg border border-[var(--zalama-border)] p-6">
          <h2 className="text-lg font-semibold text-[var(--zalama-text)] mb-4">Activité par jour de la semaine</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activityData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--zalama-border)" />
                <XAxis dataKey="jour" stroke="var(--zalama-text)" />
                <YAxis stroke="var(--zalama-text)" />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Activité']}
                  contentStyle={{ 
                    backgroundColor: 'var(--zalama-card)', 
                    borderColor: 'var(--zalama-border)' 
                  }}
                  labelStyle={{ color: 'var(--zalama-text)' }}
                />
                <Legend />
                <Bar dataKey="activite" fill="#3b82f6" name="Taux d'activité" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Satisfaction */}
        <div className="bg-[var(--zalama-card)] rounded-lg border border-[var(--zalama-border)] p-6">
          <h2 className="text-lg font-semibold text-[var(--zalama-text)] mb-4">Évolution de la satisfaction</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={satisfactionData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--zalama-border)" />
                <XAxis dataKey="mois" stroke="var(--zalama-text)" />
                <YAxis stroke="var(--zalama-text)" domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Satisfaction']}
                  contentStyle={{ 
                    backgroundColor: 'var(--zalama-card)', 
                    borderColor: 'var(--zalama-border)' 
                  }}
                  labelStyle={{ color: 'var(--zalama-text)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="satisfaction" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} name="Taux de satisfaction" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Tableau récapitulatif */}
      <div className="bg-[var(--zalama-card)] rounded-lg border border-[var(--zalama-border)] overflow-hidden mt-4">
        <div className="p-4 border-b border-[var(--zalama-border)]">
          <h2 className="text-lg font-semibold text-[var(--zalama-text)]">Récapitulatif des métriques clés</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--zalama-border)] bg-[var(--zalama-bg-light)]">
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--zalama-text)]/70 uppercase tracking-wider">Métrique</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[var(--zalama-text)]/70 uppercase tracking-wider">Valeur actuelle</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[var(--zalama-text)]/70 uppercase tracking-wider">Mois précédent</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[var(--zalama-text)]/70 uppercase tracking-wider">Variation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--zalama-border)]">
              <tr className="hover:bg-[var(--zalama-bg-light)]/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--zalama-text)]">Utilisateurs actifs</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-[var(--zalama-text)]">1 248</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-[var(--zalama-text)]">1 180</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-500">+5.8%</td>
              </tr>
              <tr className="hover:bg-[var(--zalama-bg-light)]/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--zalama-text)]">Taux de conversion</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-[var(--zalama-text)]">8.5%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-[var(--zalama-text)]">7.8%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-500">+9.0%</td>
              </tr>
              <tr className="hover:bg-[var(--zalama-bg-light)]/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--zalama-text)]">Taux de satisfaction</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-[var(--zalama-text)]">92%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-[var(--zalama-text)]">87%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-500">+5.7%</td>
              </tr>
              <tr className="hover:bg-[var(--zalama-bg-light)]/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--zalama-text)]">Temps moyen d&apos;utilisation</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-[var(--zalama-text)]">24 min</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-[var(--zalama-text)]">22 min</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-500">+9.1%</td>
              </tr>
              <tr className="hover:bg-[var(--zalama-bg-light)]/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--zalama-text)]">Taux de rebond</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-[var(--zalama-text)]">28%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-[var(--zalama-text)]">32%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-500">-12.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
