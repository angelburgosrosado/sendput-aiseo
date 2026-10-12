"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  demoOrganizations,
  demoProjects,
  demoUsers,
  DemoOrganization,
  DemoProject,
  DemoUser,
} from "@/lib/demo-data";

interface AppContextType {
  organizations: DemoOrganization[];
  currentOrg: DemoOrganization;
  setCurrentOrg: (org: DemoOrganization) => void;
  projects: DemoProject[];
  currentProject: DemoProject;
  setCurrentProject: (proj: DemoProject) => void;
  currentUser: DemoUser;
  setCurrentUser: (user: DemoUser) => void;
  userRole: DemoUser["role"];
  setUserRole: (role: DemoUser["role"]) => void;
  dateRange: "7d" | "30d" | "90d";
  setDateRange: (range: "7d" | "30d" | "90d") => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  isModeledDataMode: boolean;
  setIsModeledDataMode: (val: boolean) => void;
  canEdit: boolean;
  canManageTeam: boolean;
  canManageIntegrations: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [organizations] = useState<DemoOrganization[]>(demoOrganizations);
  const [currentOrg, setCurrentOrg] = useState<DemoOrganization>(demoOrganizations[0]);

  const [projects, setProjects] = useState<DemoProject[]>(demoProjects);
  const [currentProject, setCurrentProject] = useState<DemoProject>(demoProjects[0]);

  const [currentUser, setCurrentUser] = useState<DemoUser>(demoUsers[0]);
  const [userRole, setUserRole] = useState<DemoUser["role"]>(demoUsers[0].role);

  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d">("30d");
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isModeledDataMode, setIsModeledDataMode] = useState(true);

  // When organization changes, update project selection to match org
  useEffect(() => {
    const orgProjects = demoProjects.filter((p) => p.orgId === currentOrg.id);
    if (orgProjects.length > 0) {
      setProjects(orgProjects);
      if (!orgProjects.some((p) => p.id === currentProject.id)) {
        setCurrentProject(orgProjects[0]);
      }
    }
  }, [currentOrg]);

  // Keyboard shortcut for Cmd+K command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const canEdit = userRole === "OWNER" || userRole === "ADMIN" || userRole === "ANALYST";
  const canManageTeam = userRole === "OWNER" || userRole === "ADMIN";
  const canManageIntegrations = userRole === "OWNER";

  return (
    <AppContext.Provider
      value={{
        organizations,
        currentOrg,
        setCurrentOrg,
        projects,
        currentProject,
        setCurrentProject,
        currentUser,
        setCurrentUser,
        userRole,
        setUserRole,
        dateRange,
        setDateRange,
        commandPaletteOpen,
        setCommandPaletteOpen,
        isModeledDataMode,
        setIsModeledDataMode,
        canEdit,
        canManageTeam,
        canManageIntegrations,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
