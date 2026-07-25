import { BookOpen, CalendarDays, Repeat, Settings, Star } from "lucide-react";
import { ActivityCard } from "./activity-card";
import { RoutineCard } from "./routine-card";
import { formatThaiDate } from "../utils";
import { CustomCalendar } from "./custom-calendar";
import type { IActivity, IRoutine } from "../interface";

interface MainDashboardViewProps {
    familyId: string;
    activeTab: "today" | "routines";
    setActiveTab: (tab: "today" | "routines") => void;
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    changeDate: (offset: number) => void;
    resetToToday: () => void;

    todaysTimeline: IActivity[];
    routinesList: IRoutine[];
    familyActivities: IActivity[];

    isCalendarOpen: boolean;
    setIsCalendarOpen: (show: boolean) => void;
    setShowSettings: (show: boolean) => void;
    setIsAddingAdhoc: (show: boolean) => void;
    setIsAddingRoutine: (show: boolean) => void;
    setEditingAdhocItem: (item: IActivity | null) => void;
    setEditingRoutineItem: (item: IRoutine | null) => void;

    handleDeleteAdhoc: (id: string) => void;
    handleDeleteRoutine: (id: string) => void;
}

export const MainDashboardView = ({
    familyId,
    activeTab,
    setActiveTab,
    selectedDate,
    setSelectedDate,
    changeDate,
    resetToToday,
    todaysTimeline,
    routinesList,
    familyActivities,
    isCalendarOpen,
    setIsCalendarOpen,
    setShowSettings,
    setIsAddingAdhoc,
    setIsAddingRoutine,
    setEditingAdhocItem,
    setEditingRoutineItem,
    handleDeleteAdhoc,
    handleDeleteRoutine,
}: MainDashboardViewProps) => {
    return (
        <div className="h-[100dvh] bg-slate-50 w-full relative shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <header className="bg-white px-6 pt-6 pb-4 shadow-sm z-10 rounded-b-3xl">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2.5 rounded-2xl">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-800 text-xl leading-tight tracking-tight">
                                KidSync
                            </h1>
                            <p className="text-xs text-slate-500 font-medium">
                                ตารางกิจกรรมของลูก
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowSettings(true)}
                        className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center hover:bg-slate-100 transition border border-slate-100"
                    >
                        <Settings className="w-5 h-5 text-slate-600" />
                    </button>
                </div>

                {/* แท็บสลับหน้า (Tabs Navigation) */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                    <button
                        onClick={() => setActiveTab("today")}
                        className={`flex-1 py-2.5 flex items-center justify-center gap-2 text-sm font-bold rounded-xl transition-all ${
                            activeTab === "today"
                                ? "bg-white shadow-sm text-blue-700"
                                : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        <CalendarDays className="w-4 h-4" /> ไทม์ไลน์
                    </button>
                    <button
                        onClick={() => setActiveTab("routines")}
                        className={`flex-1 py-2.5 flex items-center justify-center gap-2 text-sm font-bold rounded-xl transition-all ${
                            activeTab === "routines"
                                ? "bg-white shadow-sm text-amber-700"
                                : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        <Repeat className="w-4 h-4" /> ตารางประจำ
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 pb-24">
                {/* หน้าไทม์ไลน์รายวัน */}
                {activeTab === "today" && (
                    <div className="space-y-5 animate-in fade-in duration-300">
                        {/* ตัวเลือกวันที่ (Date Navigator) */}
                        <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                            <button
                                onClick={() => changeDate(-1)}
                                className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition relative z-20"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>

                            <button
                                onClick={() => setIsCalendarOpen(true)}
                                className="relative flex flex-col items-center justify-center flex-1 mx-2 group cursor-pointer"
                            >
                                <div className="flex items-center gap-2 text-slate-700">
                                    <CalendarDays className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-bold group-hover:text-blue-600 transition">
                                        {formatThaiDate(selectedDate)}
                                    </span>
                                </div>

                                <div className="relative z-20 mt-1 h-5 flex items-center justify-center">
                                    {selectedDate ===
                                    new Date().toISOString().split("T")[0] ? (
                                        <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                                            วันนี้
                                        </span>
                                    ) : (
                                        <div
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                resetToToday();
                                            }}
                                            className="text-[10px] bg-amber-100 text-amber-700 hover:bg-amber-200 font-bold px-3 py-0.5 rounded-full transition shadow-sm flex items-center gap-1 active:scale-95 cursor-pointer"
                                        >
                                            กลับมาวันนี้
                                        </div>
                                    )}
                                </div>
                            </button>

                            <button
                                onClick={() => changeDate(1)}
                                className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition relative z-20"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </div>

                        {todaysTimeline.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center text-center opacity-70">
                                <div className="text-6xl mb-4 grayscale opacity-50">
                                    🎈
                                </div>
                                <h3 className="text-base font-bold text-slate-700">
                                    ว่างเปล่า ไม่มีกิจกรรม
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    ตั้งค่าตารางประจำ หรือเพิ่มกิจกรรม
                                    <br />
                                    พิเศษสำหรับวันนี้ได้เลย
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                {todaysTimeline.map((activity) => (
                                    <ActivityCard
                                        key={
                                            activity.id +
                                            (activity.isRoutine ? "_r" : "")
                                        }
                                        activity={activity}
                                        onEdit={() =>
                                            activity.isRoutine
                                                ? null
                                                : setEditingAdhocItem(activity)
                                        }
                                        onDelete={() =>
                                            activity.isRoutine
                                                ? null
                                                : handleDeleteAdhoc(activity.id)
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* หน้าจัดการตารางประจำ */}
                {activeTab === "routines" && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between mb-2 px-1">
                            <p className="text-sm text-slate-500 font-medium">
                                กิจกรรมที่ทำเป็นประจำทุกสัปดาห์
                                (ไม่ต้องกรอกใหม่)
                            </p>
                        </div>

                        {routinesList.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center text-center opacity-70">
                                <div className="text-6xl mb-4 grayscale opacity-50">
                                    🔁
                                </div>
                                <h3 className="text-base font-bold text-slate-700">
                                    ยังไม่มีตารางประจำ
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    เช่น เวลาไปโรงเรียน หรือเรียนพิเศษ
                                    <br />
                                    ตั้งค่าครั้งเดียว ระบบจัดให้อัตโนมัติ
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {routinesList.map((routine) => (
                                    <RoutineCard
                                        key={routine.id}
                                        routine={routine}
                                        onEdit={() =>
                                            setEditingRoutineItem(routine)
                                        }
                                        onDelete={() =>
                                            handleDeleteRoutine(routine.id)
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Floating Action Button */}
            <div className="absolute bottom-6 w-full flex justify-center z-20 pointer-events-none">
                {activeTab === "today" ? (
                    <button
                        onClick={() => {
                            setEditingAdhocItem(null);
                            setIsAddingAdhoc(true);
                        }}
                        className="pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-4 shadow-lg shadow-blue-200/50 transform transition-transform active:scale-95 flex items-center gap-2"
                    >
                        <Star className="w-5 h-5 text-blue-100" />
                        <span className="font-bold">
                            เพิ่มกิจกรรมพิเศษวันนี้
                        </span>
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            setEditingRoutineItem(null);
                            setIsAddingRoutine(true);
                        }}
                        className="pointer-events-auto bg-amber-500 hover:bg-amber-600 text-white rounded-full px-6 py-4 shadow-lg shadow-amber-200/50 transform transition-transform active:scale-95 flex items-center gap-2"
                    >
                        <Repeat className="w-5 h-5 text-amber-100" />
                        <span className="font-bold">สร้างตารางประจำใหม่</span>
                    </button>
                )}
            </div>

            {/* Custom Calendar Modal */}
            {isCalendarOpen && (
                <CustomCalendar
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    familyActivities={familyActivities}
                    onClose={() => setIsCalendarOpen(false)}
                />
            )}
        </div>
    );
};
