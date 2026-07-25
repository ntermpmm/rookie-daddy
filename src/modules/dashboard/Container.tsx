import React from "react";
import { useDashboardController } from "./controller";
import { LoginView } from "./view/login-view";
import { MainDashboardView } from "./view/main-dashboard-view";
import { AddAdhocModal } from "./view/modals/add-adhoc-modal";
import { AddRoutineModal } from "./view/modals/add-routine-modal";
import { SettingsModal } from "./view/modals/settings-modal";

export const DashboardContainer = () => {
    const controller = useDashboardController();

    // If no familyId, show the Login/Join screen
    if (!controller.familyId) {
        return (
            <LoginView
                isJoining={controller.isJoining}
                inputFamilyId={controller.inputFamilyId}
                setInputFamilyId={controller.setInputFamilyId}
                setIsJoining={controller.setIsJoining}
                createFamily={controller.createFamily}
                joinFamily={controller.joinFamily}
            />
        );
    }

    return (
        <>
            <MainDashboardView
                familyId={controller.familyId}
                activeTab={controller.activeTab}
                setActiveTab={controller.setActiveTab}
                selectedDate={controller.selectedDate}
                setSelectedDate={controller.setSelectedDate}
                changeDate={controller.changeDate}
                resetToToday={controller.resetToToday}
                todaysTimeline={controller.todaysTimeline}
                routinesList={controller.routinesList}
                familyActivities={controller.familyActivities}
                isCalendarOpen={controller.isCalendarOpen}
                setIsCalendarOpen={controller.setIsCalendarOpen}
                setShowSettings={controller.setShowSettings}
                setIsAddingAdhoc={controller.setIsAddingAdhoc}
                setIsAddingRoutine={controller.setIsAddingRoutine}
                setEditingAdhocItem={controller.setEditingAdhocItem}
                setEditingRoutineItem={controller.setEditingRoutineItem}
                handleDeleteAdhoc={controller.deleteActivity}
                handleDeleteRoutine={controller.deleteRoutine}
            />

            {/* Modals */}
            {(controller.isAddingAdhoc || controller.editingAdhocItem) && (
                <AddAdhocModal
                    initialDate={controller.selectedDate}
                    editItem={controller.editingAdhocItem}
                    onClose={() => {
                        controller.setIsAddingAdhoc(false);
                        controller.setEditingAdhocItem(null);
                    }}
                    onSave={controller.addActivity}
                    onUpdate={controller.updateActivity}
                />
            )}

            {(controller.isAddingRoutine || controller.editingRoutineItem) && (
                <AddRoutineModal
                    editItem={controller.editingRoutineItem}
                    onClose={() => {
                        controller.setIsAddingRoutine(false);
                        controller.setEditingRoutineItem(null);
                    }}
                    onSave={controller.addRoutine}
                    onUpdate={controller.updateRoutine}
                />
            )}

            {controller.showSettings && (
                <SettingsModal
                    familyId={controller.familyId}
                    onCloseModal={() => controller.setShowSettings(false)}
                    onLogout={controller.logoutFamily}
                />
            )}
        </>
    );
};
