"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Company, Admin, companies, authenticateAdmin, getCompanyById } from '@/data/companies';

// Interface pour le contexte d'authentification
interface AuthContextType {
  isAuthenticated: boolean;
  currentCompany: Company | null;
  currentAdmin: Admin | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const router = useRouter();

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    // Vérifier si le cookie d'authentification existe
    const hasCookie = document.cookie.split(';').some(item => item.trim().startsWith('zalama-auth='));
    const storedAdminId = localStorage.getItem('zalama-admin-id');
    
    if (hasCookie && storedAdminId) {
      const adminData = JSON.parse(localStorage.getItem('zalama-admin-data') || '{}');
      if (adminData && adminData.id) {
        setIsAuthenticated(true);
        setCurrentAdmin(adminData);
        
        // Récupérer les données de l'entreprise associée
        const company = getCompanyById(adminData.companyId);
        if (company) {
          setCurrentCompany(company);
        }
      }
    }
  }, []);

  // Fonction de connexion
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Vérifier les identifiants
      const admin = authenticateAdmin(email, password);
      
      if (admin) {
        // Récupérer les données de l'entreprise associée
        const company = getCompanyById(admin.companyId);
        
        if (company) {
          // Mettre à jour l'état d'authentification et les données
          setIsAuthenticated(true);
          setCurrentAdmin(admin);
          setCurrentCompany(company);
          
          // Sauvegarder les informations de connexion dans localStorage pour la persistance
          localStorage.setItem('zalama-admin-id', admin.id);
          localStorage.setItem('zalama-admin-data', JSON.stringify(admin));
          
          // Définir un cookie pour que le middleware puisse le détecter
          document.cookie = `zalama-auth=true; path=/; max-age=86400`; // expire dans 24h
          
          // Notification de succès
          toast.success(`Connexion réussie ! Bienvenue ${admin.name}`);
          
          // Forcer la redirection vers le dashboard
          window.location.href = '/dashboard';
          return true;
        } else {
          toast.error('Erreur: Entreprise non trouvée');
          return false;
        }
      } else {
        toast.error('Email ou mot de passe incorrect');
        return false;
      }
    } catch (error) {
      toast.error('Échec de la connexion. Veuillez réessayer.');
      return false;
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentCompany(null);
    setCurrentAdmin(null);
    
    // Supprimer les données du localStorage
    localStorage.removeItem('zalama-admin-id');
    localStorage.removeItem('zalama-admin-data');
    
    // Supprimer le cookie d'authentification
    document.cookie = 'zalama-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    toast.success('Vous êtes déconnecté.');
    window.location.href = '/login';
  };



  return (
    <AuthContext.Provider value={{ isAuthenticated, currentCompany, currentAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}
