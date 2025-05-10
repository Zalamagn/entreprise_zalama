"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Search, Filter, Mail, Phone, Eye, Download, ChevronDown, Building2, Calendar, Clock } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

// Données fictives pour les employés
const employeesData = [
  { 
    id: 1, 
    nom: "Dupont", 
    prenom: "Jean", 
    email: "jean.dupont@example.com", 
    telephone: "06 12 34 56 78", 
    poste: "Développeur Frontend", 
    departement: "Technique", 
    dateEmbauche: "15/03/2022",
    statut: "Actif"
  },
  { 
    id: 2, 
    nom: "Martin", 
    prenom: "Sophie", 
    email: "sophie.martin@example.com", 
    telephone: "06 23 45 67 89", 
    poste: "Designer UX/UI", 
    departement: "Création", 
    dateEmbauche: "05/06/2021",
    statut: "Actif"
  },
  { 
    id: 3, 
    nom: "Petit", 
    prenom: "Thomas", 
    email: "thomas.petit@example.com", 
    telephone: "06 34 56 78 90", 
    poste: "Chef de projet", 
    departement: "Management", 
    dateEmbauche: "10/01/2020",
    statut: "Actif"
  },
  { 
    id: 4, 
    nom: "Leroy", 
    prenom: "Emma", 
    email: "emma.leroy@example.com", 
    telephone: "06 45 67 89 01", 
    poste: "Développeur Backend", 
    departement: "Technique", 
    dateEmbauche: "22/09/2022",
    statut: "Actif"
  }
];

// Statistiques pour le tableau de bord
const stats = [
  {
    label: "Total des employés",
    value: "248",
    icon: <Users className="h-5 w-5" />,
    accent: "bg-blue-600"
  },
  {
    label: "Nouveaux ce mois",
    value: "12",
    icon: <Calendar className="h-5 w-5" />,
    accent: "bg-green-600"
  },
  {
    label: "Ancienneté moyenne",
    value: "3.5 ans",
    icon: <Clock className="h-5 w-5" />,
    accent: "bg-amber-600"
  },
  {
    label: "Taux de rétention",
    value: "94%",
    icon: <Building2 className="h-5 w-5" />,
    accent: "bg-purple-600"
  }
];

// Interface pour le type d'employé
interface Employee {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  poste: string;
  departement: string;
  dateEmbauche: string;
  statut: string;
}

// Départements disponibles
const departments = [
  "Technique",
  "Marketing",
  "Ventes",
  "Finance",
  "Ressources Humaines",
  "Management",
  "Création",
  "Support"
];

// Statuts disponibles
const statuses = ["Actif", "Congé", "Inactif"];

export default function EmployesPage() {
  const { isAuthenticated, currentCompany, currentAdmin } = useAuth();
  const router = useRouter();
  
  // Rediriger vers la page de login si l'utilisateur n'est pas authentifié
  useEffect(() => {
    if (!isAuthenticated || !currentCompany) {
      router.push('/login');
    }
  }, [isAuthenticated, currentCompany, router]);
  
  // États pour la gestion des employés
  const [employees, setEmployees] = useState<Employee[]>(employeesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  
  // Charger les données des employés depuis l'entreprise connectée
  useEffect(() => {
    if (currentCompany) {
      // Dans une application réelle, nous chargerions les employés depuis une API
      // Pour cette démo, nous utilisons les données fictives
      setEmployees(employeesData);
      toast.success(`Données des employés de ${currentCompany.name} chargées`);
    }
  }, [currentCompany]);
  
  // Filtrer les employés en fonction des critères de recherche
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchTerm === "" ||
      employee.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.poste.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === null || employee.departement === selectedDepartment;
    const matchesStatus = selectedStatus === null || employee.statut === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });
  
  // Pagination
  const employeesPerPage = 8;
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  
  // Gérer les changements de page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  // Ouvrir le modal de visualisation des détails
  const openViewModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewModalOpen(true);
  };
  
  // Fermer le modal de visualisation
  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedEmployee(null);
  };
  
  // Exporter les données au format CSV
  const handleExportCSV = () => {
    if (!currentCompany) return;
    
    const headers = ["ID", "Nom", "Prénom", "Email", "Téléphone", "Poste", "Département", "Date d'embauche", "Statut"];
    const csvData = [
      headers.join(","),
      ...employees.map(employee => [
        employee.id,
        employee.nom,
        employee.prenom,
        employee.email,
        employee.telephone,
        employee.poste,
        employee.departement,
        employee.dateEmbauche,
        employee.statut
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `employes_${currentCompany.name.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Données exportées avec succès');
  };
  
  return (
    <div className="py-4">
      
      {/* En-tête avec le nom de l'entreprise */}
      {currentCompany && (
        <div className="bg-[var(--zalama-card)] rounded-lg border border-[var(--zalama-border)] p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[var(--zalama-text)]">Employés de {currentCompany.name}</h2>
              <p className="text-sm text-[var(--zalama-text)]/70 mt-1">Gestion des ressources humaines</p>
            </div>
            <div className="bg-[var(--zalama-blue)]/10 text-[var(--zalama-blue)] text-sm font-medium px-3 py-1 rounded-full">
              {currentCompany.employeesCount} employés au total
            </div>
          </div>
        </div>
      )}
      
      {/* Statistiques */}
      <div className="bg-[var(--zalama-card)] rounded-lg border border-[var(--zalama-border)] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[var(--zalama-text)] mb-4">Statistiques des employés</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
      
      {/* Barre d'actions */}
      <div className="bg-[var(--zalama-card)] rounded-lg border border-[var(--zalama-border)] p-2 mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--zalama-text)]/50 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Rechercher un employé..." 
                className="pl-10 pr-4 py-2 rounded-lg border border-[var(--zalama-border)] bg-[var(--zalama-bg-light)]/50 text-[var(--zalama-text)] w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filtre par département */}
            <div className="relative">
              <button 
                onClick={() => setIsDepartmentDropdownOpen(!isDepartmentDropdownOpen)}
                className="flex items-center gap-2 px-2 py-2 rounded-lg border border-[var(--zalama-border)] bg-[var(--zalama-bg-light)]/50 text-[var(--zalama-text)]"
              >
                <Filter className="h-4 w-4" />
                <span>{selectedDepartment || "Département"}</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              
              {isDepartmentDropdownOpen && (
                <div className="absolute z-10 mt-1 w-56 rounded-md shadow-lg bg-[var(--zalama-card)] border border-[var(--zalama-border)]">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setSelectedDepartment(null);
                        setIsDepartmentDropdownOpen(false);
                      }}
                      className="block w-full text-left px-2 py-2 text-sm text-[var(--zalama-text)] hover:bg-[var(--zalama-bg-light)]"
                    >
                      Tous les départements
                    </button>
                    {departments.map((dept) => (
                      <button
                        key={dept}
                        onClick={() => {
                          setSelectedDepartment(dept);
                          setIsDepartmentDropdownOpen(false);
                        }}
                        className="block w-full text-left px-2 py-2 text-sm text-[var(--zalama-text)] hover:bg-[var(--zalama-bg-light)]"
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Filtre par statut */}
            <div className="relative">
              <button 
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="flex items-center gap-2 px-2 py-2 rounded-lg border border-[var(--zalama-border)] bg-[var(--zalama-bg-light)]/50 text-[var(--zalama-text)]"
              >
                <Filter className="h-4 w-4" />
                <span>{selectedStatus || "Statut"}</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              
              {isStatusDropdownOpen && (
                <div className="absolute z-10 mt-1 w-56 rounded-md shadow-lg bg-[var(--zalama-card)] border border-[var(--zalama-border)]">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setSelectedStatus(null);
                        setIsStatusDropdownOpen(false);
                      }}
                      className="block w-full text-left px-2 py-2 text-sm text-[var(--zalama-text)] hover:bg-[var(--zalama-bg-light)]"
                    >
                      Tous les statuts
                    </button>
                    {statuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatus(status);
                          setIsStatusDropdownOpen(false);
                        }}
                        className="block w-full text-left px-2 py-2 text-sm text-[var(--zalama-text)] hover:bg-[var(--zalama-bg-light)]"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Bouton d'exportation */}
          <div className="flex gap-2">
            <button 
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[var(--zalama-border)] bg-[var(--zalama-bg-light)]/50 text-[var(--zalama-text)]"
            >
              <Download className="h-4 w-4" />
              <span>Exporter en CSV</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Tableau des employés */}
      <div className="bg-[var(--zalama-card)] rounded-lg border border-[var(--zalama-border)] overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-[var(--zalama-border)] bg-[var(--zalama-bg-light)]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--zalama-text)]/70 uppercase tracking-wider w-[18%]">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--zalama-text)]/70 uppercase tracking-wider w-[18%]">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--zalama-text)]/70 uppercase tracking-wider w-[14%]">Poste</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--zalama-text)]/70 uppercase tracking-wider w-[14%]">Département</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--zalama-text)]/70 uppercase tracking-wider w-[14%]">Date d&apos;embauche</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--zalama-text)]/70 uppercase tracking-wider w-[10%]">Statut</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--zalama-text)]/70 uppercase tracking-wider w-[12%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--zalama-border)]">
              {currentEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-[var(--zalama-bg-light)]/50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-[var(--zalama-blue)]/10 flex items-center justify-center text-[var(--zalama-blue)] font-medium flex-shrink-0">
                        {employee.prenom[0]}{employee.nom[0]}
                      </div>
                      <div className="ml-3 overflow-hidden">
                        <div className="text-sm font-medium text-[var(--zalama-text)] truncate">{employee.prenom} {employee.nom}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis">
                    <div className="text-sm text-[var(--zalama-text)]">
                      <div className="flex items-center gap-1 overflow-hidden">
                        <Mail className="h-3 w-3 text-[var(--zalama-text)]/70 flex-shrink-0" />
                        <span className="truncate">{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 overflow-hidden">
                        <Phone className="h-3 w-3 text-[var(--zalama-text)]/70 flex-shrink-0" />
                        <span className="truncate">{employee.telephone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis">
                    <div className="text-sm text-[var(--zalama-text)] truncate">{employee.poste}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis">
                    <div className="text-sm text-[var(--zalama-text)] truncate">{employee.departement}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis">
                    <div className="text-sm text-[var(--zalama-text)] truncate">{employee.dateEmbauche}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      employee.statut === 'Actif' 
                        ? 'bg-green-100 text-green-800' 
                        : employee.statut === 'Congé' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {employee.statut}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openViewModal(employee)}
                        className="p-1 rounded-full hover:bg-[var(--zalama-bg-light)] text-[var(--zalama-text)]/70 hover:text-[var(--zalama-text)]"
                        title="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="py-3 p-2 flex items-center justify-between border-t border-[var(--zalama-border)]">
          <div className="text-sm text-[var(--zalama-text)]/70">
            Affichage de {indexOfFirstEmployee + 1} à {Math.min(indexOfLastEmployee, filteredEmployees.length)} sur {filteredEmployees.length} employés
          </div>
          <div className="flex gap-1">
            <button 
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border border-[var(--zalama-border)] ${currentPage === 1 ? 'bg-[var(--zalama-bg-light)]/50 text-[var(--zalama-text)]/50 cursor-not-allowed' : 'bg-[var(--zalama-bg-light)] text-[var(--zalama-text)] hover:bg-[var(--zalama-bg-light)]/80 cursor-pointer'}`}
            >
              Précédent
            </button>
            
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded border border-[var(--zalama-border)] ${currentPage === i + 1 ? 'bg-[var(--zalama-blue)] text-white' : 'bg-[var(--zalama-bg-light)] text-[var(--zalama-text)] hover:bg-[var(--zalama-bg-light)]/80'}`}
              >
                {i + 1}
              </button>
            ))}
            
            <button 
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border border-[var(--zalama-border)] ${currentPage === totalPages ? 'bg-[var(--zalama-bg-light)]/50 text-[var(--zalama-text)]/50 cursor-not-allowed' : 'bg-[var(--zalama-bg-light)] text-[var(--zalama-text)] hover:bg-[var(--zalama-bg-light)]/80 cursor-pointer'}`}
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
      
      {/* Modal de visualisation des détails */}
      {isViewModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[var(--zalama-card)] rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b border-[var(--zalama-border)]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--zalama-text)]">
                  Détails de l&apos;employé
                </h3>
                <button 
                  onClick={closeViewModal}
                  className="p-1 rounded-full hover:bg-[var(--zalama-bg-light)] text-[var(--zalama-text)]/70 hover:text-[var(--zalama-text)]"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-[var(--zalama-blue)]/10 flex items-center justify-center text-[var(--zalama-blue)] text-xl font-medium flex-shrink-0">
                  {selectedEmployee.prenom[0]}{selectedEmployee.nom[0]}
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-[var(--zalama-text)]">{selectedEmployee.prenom} {selectedEmployee.nom}</h2>
                  <p className="text-[var(--zalama-text)]/70">{selectedEmployee.poste}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-[var(--zalama-text)]/70 mb-2">Informations personnelles</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-[var(--zalama-text)]/70 mr-2" />
                      <span className="text-[var(--zalama-text)]">{selectedEmployee.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-[var(--zalama-text)]/70 mr-2" />
                      <span className="text-[var(--zalama-text)]">{selectedEmployee.telephone}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-[var(--zalama-text)]/70 mb-2">Informations professionnelles</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 text-[var(--zalama-text)]/70 mr-2" />
                      <span className="text-[var(--zalama-text)]">{selectedEmployee.departement}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-[var(--zalama-text)]/70 mr-2" />
                      <span className="text-[var(--zalama-text)]">Embauché le {selectedEmployee.dateEmbauche}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-4 w-4 text-[var(--zalama-text)]/70 mr-2 flex items-center justify-center">
                        <div className={`h-3 w-3 rounded-full ${
                          selectedEmployee.statut === 'Actif' 
                            ? 'bg-green-500' 
                            : selectedEmployee.statut === 'Congé' 
                              ? 'bg-yellow-500' 
                              : 'bg-red-500'
                        }`}></div>
                      </div>
                      <span className="text-[var(--zalama-text)]">Statut: {selectedEmployee.statut}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-[var(--zalama-border)] pt-4">
                <p className="text-sm text-[var(--zalama-text)]/70">
                  Note: Les informations des employés sont en lecture seule. Pour toute modification, veuillez contacter le service RH.
                </p>
              </div>
            </div>
            
            <div className="p-4 border-t border-[var(--zalama-border)] flex justify-end">
              <button 
                onClick={closeViewModal}
                className="px-4 py-2 bg-[var(--zalama-bg-light)] text-[var(--zalama-text)] rounded-md hover:bg-[var(--zalama-bg-light)]/80 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
