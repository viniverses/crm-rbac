import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrganizationConfig {
  id: string;
  name: string;
  logo?: string;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
  settings?: {
    timezone?: string;
    language?: string;
    dateFormat?: string;
  };
}

interface OrganizationConfigStore {
  config: OrganizationConfig | null;
  currentOrganization: Organization | null;
  setConfig: (config: OrganizationConfig) => void;
  updateConfig: (partialConfig: Partial<OrganizationConfig>) => void;
  resetConfig: () => void;
  setCurrentOrganization: (organization: Organization) => void;
  clearCurrentOrganization: () => void;
}

export const useOrganizationConfig = create<OrganizationConfigStore>()(
  persist(
    (set) => ({
      config: null,
      currentOrganization: null,
      setConfig: (config) => set({ config }),
      updateConfig: (partialConfig) =>
        set((state) => ({
          config: state.config ? { ...state.config, ...partialConfig } : null,
        })),
      resetConfig: () => set({ config: null }),
      setCurrentOrganization: (organization) => set({ currentOrganization: organization }),
      clearCurrentOrganization: () => set({ currentOrganization: null }),
    }),
    {
      name: 'organization-config-storage',
    },
  ),
);
