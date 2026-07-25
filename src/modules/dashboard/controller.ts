import { useState, useMemo, useEffect } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import type { IActivity, IRoutine } from "./interface";
import type { ConfirmAction } from "./view/modals/confirm-modal";

export const useDashboardController = () => {
    const {
        user,
        familyId,
        activities,
        routines,
        initUser,
        setFamilyId,
        logoutFamily,
        addActivity,
        updateActivity,
        deleteActivity,
        addRoutine,
        updateRoutine,
        deleteRoutine,
    } = useDashboardStore();

    const [inputFamilyId, setInputFamilyId] = useState("");
    const [isJoining, setIsJoining] = useState(false);

    const getLocalTodayStr = () => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };

    // Dashboard States
    const [activeTab, setActiveTab] = useState<"today" | "routines">("today");
    const [selectedDate, setSelectedDate] = useState(getLocalTodayStr());

    // Modal States
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isAddingAdhoc, setIsAddingAdhoc] = useState(false);
    const [isAddingRoutine, setIsAddingRoutine] = useState(false);
    const [editingAdhocItem, setEditingAdhocItem] = useState<IActivity | null>(null);
    const [editingRoutineItem, setEditingRoutineItem] = useState<IRoutine | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

    const requestConfirm = (action: ConfirmAction) => {
        setConfirmAction(action);
    };

    useEffect(() => {
        initUser();
    }, [initUser]);

    // Derived State: Today's Timeline
    const todaysTimeline = useMemo(() => {
        if (!familyId) return [];
        
        const currentActivities = activities[familyId] || [];
        const currentRoutines = routines[familyId] || [];
        
        const targetDate = new Date(selectedDate);
        const dayOfWeek = targetDate.getDay();

        const todaysAdhoc = currentActivities
            .filter((act) => act.date === selectedDate || (act.endDate && selectedDate >= act.date && selectedDate <= act.endDate))
            .map((a) => ({ ...a, isRoutine: false }));

        const todaysRoutines = currentRoutines
            .filter((routine) => {
                if (!routine.days.includes(dayOfWeek)) return false;
                
                if (routine.frequency === "biweekly" && routine.startDate) {
                    const target = new Date(selectedDate);
                    target.setHours(0, 0, 0, 0);
                    
                    const start = new Date(routine.startDate);
                    start.setHours(0, 0, 0, 0);
                    
                    // If target date is before the start date, routine hasn't started yet
                    if (target.getTime() < start.getTime()) return false;
                    
                    const getMonday = (d: Date) => {
                        const copy = new Date(d);
                        const day = copy.getDay() || 7; // Convert Sunday (0) to 7
                        if (day !== 1) copy.setHours(-24 * (day - 1));
                        return copy.getTime();
                    };
                    
                    const targetMonday = getMonday(target);
                    const startMonday = getMonday(start);
                    
                    const diffWeeks = Math.floor((targetMonday - startMonday) / (1000 * 60 * 60 * 24 * 7));
                    
                    // If diffWeeks is odd, it's the alternate week, so we skip it
                    if (diffWeeks % 2 !== 0) return false;
                }
                
                return true;
            })
            .map((r) => ({ ...r as any, isRoutine: true as const }));

        return [...todaysAdhoc, ...todaysRoutines].sort((a, b) =>
            a.time.localeCompare(b.time),
        );
    }, [activities, routines, selectedDate, familyId]);

    const routinesList = useMemo(() => {
        if (!familyId) return [];
        return (routines[familyId] || []).sort((a, b) => a.time.localeCompare(b.time));
    }, [routines, familyId]);

    // Handlers: Login / Joining
    const createFamily = () => {
        const newFamilyId = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();
        setFamilyId(newFamilyId);
    };

    const joinFamily = () => {
        if (inputFamilyId.trim().length > 0) {
            setFamilyId(inputFamilyId.trim().toUpperCase());
        }
    };

    // Handlers: Date Navigation
    const changeDate = (offset: number) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + offset);
        setSelectedDate(d.toISOString().split("T")[0]);
    };

    const resetToToday = () => {
        setSelectedDate(getLocalTodayStr());
    };

    // Return everything needed by the views
    return {
        // Auth State
        user,
        familyId,
        inputFamilyId,
        isJoining,
        setInputFamilyId,
        setIsJoining,
        createFamily,
        joinFamily,
        logoutFamily,

        // Dashboard State
        activeTab,
        setActiveTab,
        selectedDate,
        setSelectedDate,
        changeDate,
        resetToToday,
        todaysTimeline,
        routinesList,
        familyActivities: activities[familyId] || [],

        // Modal State & Toggles
        isCalendarOpen,
        setIsCalendarOpen,
        isAddingAdhoc,
        setIsAddingAdhoc,
        isAddingRoutine,
        setIsAddingRoutine,
        editingAdhocItem,
        setEditingAdhocItem,
        editingRoutineItem,
        setEditingRoutineItem,
        showSettings,
        setShowSettings,
        confirmAction,
        setConfirmAction,
        requestConfirm,

        // Data Mutations
        addActivity: (activity: any) => addActivity(familyId, activity),
        updateActivity: (id: string, updates: any) => updateActivity(familyId, id, updates),
        deleteActivity: (id: string) => deleteActivity(familyId, id),

        addRoutine: (routine: any) => addRoutine(familyId, routine),
        updateRoutine: (id: string, updates: any) => updateRoutine(familyId, id, updates),
        deleteRoutine: (id: string) => deleteRoutine(familyId, id),
    };
};
