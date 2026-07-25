import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IActivity, IRoutine } from "../modules/dashboard/interface";

interface DashboardState {
    user: string | null;
    familyId: string;
    activities: Record<string, IActivity[]>; // Keyed by familyId
    routines: Record<string, IRoutine[]>; // Keyed by familyId
    
    // Actions
    initUser: () => void;
    setFamilyId: (id: string) => void;
    logoutFamily: () => void;
    
    addActivity: (familyId: string, activity: Omit<IActivity, "id" | "createdAt">) => void;
    updateActivity: (familyId: string, activityId: string, updates: Partial<IActivity>) => void;
    deleteActivity: (familyId: string, activityId: string) => void;
    
    addRoutine: (familyId: string, routine: Omit<IRoutine, "id" | "createdAt">) => void;
    updateRoutine: (familyId: string, routineId: string, updates: Partial<IRoutine>) => void;
    deleteRoutine: (familyId: string, routineId: string) => void;
}

export const useDashboardStore = create<DashboardState>()(
    persist(
        (set, get) => ({
            user: null,
            familyId: "",
            activities: {},
            routines: {},

            initUser: () => {
                if (!get().user) {
                    set({ user: "user_" + Math.random().toString(36).substring(2, 11) });
                }
            },
            
            setFamilyId: (id) => set({ familyId: id }),
            
            logoutFamily: () => set({ familyId: "" }),
            
            addActivity: (familyId, activity) => set((state) => {
                const currentActivities = state.activities[familyId] || [];
                const newActivity: IActivity = {
                    ...activity,
                    id: Math.random().toString(36).substring(2, 11),
                    createdAt: Date.now(),
                };
                return {
                    activities: {
                        ...state.activities,
                        [familyId]: [...currentActivities, newActivity],
                    }
                };
            }),
            
            updateActivity: (familyId, activityId, updates) => set((state) => {
                const currentActivities = state.activities[familyId] || [];
                return {
                    activities: {
                        ...state.activities,
                        [familyId]: currentActivities.map(a => a.id === activityId ? { ...a, ...updates } : a),
                    }
                };
            }),
            
            deleteActivity: (familyId, activityId) => set((state) => {
                const currentActivities = state.activities[familyId] || [];
                return {
                    activities: {
                        ...state.activities,
                        [familyId]: currentActivities.filter(a => a.id !== activityId),
                    }
                };
            }),
            
            addRoutine: (familyId, routine) => set((state) => {
                const currentRoutines = state.routines[familyId] || [];
                const newRoutine: IRoutine = {
                    ...routine,
                    id: Math.random().toString(36).substring(2, 11),
                    createdAt: Date.now(),
                };
                return {
                    routines: {
                        ...state.routines,
                        [familyId]: [...currentRoutines, newRoutine],
                    }
                };
            }),
            
            updateRoutine: (familyId, routineId, updates) => set((state) => {
                const currentRoutines = state.routines[familyId] || [];
                return {
                    routines: {
                        ...state.routines,
                        [familyId]: currentRoutines.map(r => r.id === routineId ? { ...r, ...updates } : r),
                    }
                };
            }),
            
            deleteRoutine: (familyId, routineId) => set((state) => {
                const currentRoutines = state.routines[familyId] || [];
                return {
                    routines: {
                        ...state.routines,
                        [familyId]: currentRoutines.filter(r => r.id !== routineId),
                    }
                };
            })
        }),
        {
            name: "kidsync-storage",
        }
    )
);
