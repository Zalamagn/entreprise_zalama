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
    const storedAuth = localStorage.getItem('zalama-auth');
    const storedAdminId = localStorage.getItem('zalama-admin-id');
    
    if (storedAuth === 'true' && storedAdminId) {
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
        setIsAuthenticated(true);
        setCurrentAdmin(admin);
        
        // Sauvegarder les informations de connexion
        localStorage.setItem('zalama-auth', 'true');
        localStorage.setItem('zalama-admin-id', admin.id);
        localStorage.setItem('zalama-admin-data', JSON.stringify(admin));
        
        // Récupérer les données de l'entreprise associée
        const company = getCompanyById(admin.companyId);
        if (company) {
          setCurrentCompany(company);
          toast.success(`Connexion réussie ! Bienvenue ${admin.name}`);
          router.push('/dashboard');
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
    localStorage.removeItem('zalama-auth');
    localStorage.removeItem('zalama-admin-id');
    localStorage.removeItem('zalama-admin-data');
    toast.success('Vous êtes déconnecté.');
    router.push('/login');
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
