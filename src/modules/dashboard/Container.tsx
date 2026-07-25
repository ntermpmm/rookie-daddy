import React from "react";
import { useDashboardController } from "./controller";
import { LoginView } from "./view/login-view";
import { MainDashboardView } from "./view/main-dashboard-view";
import { AddAdhocModal } from "./view/modals/add-adhoc-modal";
import { AddRoutineModal } from "./view/modals/add-routine-modal";
import { SettingsModal } from "./view/modals/settings-modal";
import { ConfirmModal } from "./view/modals/confirm-modal";
import { AnimatePresence } from "framer-motion";

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
                handleDeleteAdhoc={(id) => {
                    controller.requestConfirm({
                        title: "ลบกิจกรรม?",
                        message: "คุณแน่ใจหรือไม่ว่าต้องการลบกิจกรรมนี้ออกจากไทม์ไลน์?",
                        danger: true,
                        confirmText: "ลบกิจกรรม",
                        onConfirm: () => controller.deleteActivity(id)
                    });
                }}
                handleDeleteRoutine={(id) => {
                    controller.requestConfirm({
                        title: "ลบตารางประจำ?",
                        message: "กิจกรรมนี้จะหายไปจากทุกสัปดาห์ คุณแน่ใจหรือไม่?",
                        danger: true,
                        confirmText: "ลบตาราง",
                        onConfirm: () => controller.deleteRoutine(id)
                    });
                }}
            />

            {/* Modals wrapped with AnimatePresence for exit animations */}
            <AnimatePresence>
                {(controller.isAddingAdhoc || controller.editingAdhocItem) && (
                    <AddAdhocModal
                        key="adhoc-modal"
                        initialDate={controller.selectedDate}
                        editItem={controller.editingAdhocItem}
                        onClose={() => {
                            controller.setIsAddingAdhoc(false);
                            controller.setEditingAdhocItem(null);
                        }}
                        onSave={controller.addActivity}
                        onUpdate={controller.updateActivity}
                        requestConfirm={controller.requestConfirm}
                    />
                )}

                {(controller.isAddingRoutine || controller.editingRoutineItem) && (
                    <AddRoutineModal
                        key="routine-modal"
                        editItem={controller.editingRoutineItem}
                        onClose={() => {
                            controller.setIsAddingRoutine(false);
                            controller.setEditingRoutineItem(null);
                        }}
                        onSave={controller.addRoutine}
                        onUpdate={controller.updateRoutine}
                        requestConfirm={controller.requestConfirm}
                    />
                )}

                {controller.showSettings && (
                    <SettingsModal
                        key="settings-modal"
                        familyId={controller.familyId}
                        onCloseModal={() => controller.setShowSettings(false)}
                        onLogout={() => {
                            controller.requestConfirm({
                                title: "ออกจากครอบครัว?",
                                message: "คุณจะต้องกรอกรหัสผ่านใหม่เพื่อกลับเข้าสู่ครอบครัวนี้อีกครั้ง คุณแน่ใจหรือไม่?",
                                danger: true,
                                confirmText: "ออกจากครอบครัว",
                                onConfirm: () => {
                                    controller.logoutFamily();
                                    controller.setShowSettings(false);
                                }
                            });
                        }}
                    />
                )}

                {controller.confirmAction && (
                    <ConfirmModal
                        key="confirm-modal"
                        action={controller.confirmAction}
                        onClose={() => controller.setConfirmAction(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};
