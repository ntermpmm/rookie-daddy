import React, { useState, useEffect, useMemo } from "react";
import {
    BookOpen,
    Settings,
    CalendarDays,
    Repeat,
    Clock,
    Star,
    X,
    Copy,
    LogOut,
    CheckCircle2,
    Edit2,
} from "lucide-react";

// ข้อมูลประเภทกิจกรรมที่เหมาะสมกับเด็กวัยอนุบาล - ป.1
const ACTIVITY_TYPES = [
    {
        id: "school",
        label: "โรงเรียน",
        icon: "🎒",
        color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
        id: "homework",
        label: "ทำการบ้าน",
        icon: "📝",
        color: "bg-orange-100 text-orange-700 border-orange-200",
    },
    {
        id: "tutor",
        label: "เรียนเสริม",
        icon: "🎨",
        color: "bg-purple-100 text-purple-700 border-purple-200",
    },
    {
        id: "play",
        label: "กิจกรรม/เล่น",
        icon: "⚽",
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    {
        id: "doctor",
        label: "หาหมอ/สุขภาพ",
        icon: "🏥",
        color: "bg-rose-100 text-rose-700 border-rose-200",
    },
    {
        id: "routine",
        label: "กิจวัตร",
        icon: "🍽️",
        color: "bg-amber-100 text-amber-700 border-amber-200",
    },
];

const DAYS_OF_WEEK = [
    { id: 1, label: "จ.", value: "จันทร์" },
    { id: 2, label: "อ.", value: "อังคาร" },
    { id: 3, label: "พ.", value: "พุธ" },
    { id: 4, label: "พฤ.", value: "พฤหัสบดี" },
    { id: 5, label: "ศ.", value: "ศุกร์" },
    { id: 6, label: "ส.", value: "เสาร์" },
    { id: 0, label: "อา.", value: "อาทิตย์" },
];

// ฟังก์ชันแปลงวันที่ให้เป็นภาษาไทยแบบอ่านง่าย
const formatThaiDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
        "ม.ค.",
        "ก.พ.",
        "มี.ค.",
        "เม.ย.",
        "พ.ค.",
        "มิ.ย.",
        "ก.ค.",
        "ส.ค.",
        "ก.ย.",
        "ต.ค.",
        "พ.ย.",
        "ธ.ค.",
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`;
};

// จำลองฐานข้อมูลด้วย Local Storage เพื่อให้สามารถทดสอบได้อย่างสมบูรณ์แบบโดยไม่ต้องตั้งค่าฐานข้อมูล
const getStorageData = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : [];
    } catch (e) {
        return [];
    }
};

const setStorageData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event("storage")); // ทำให้แท็บอื่นอัปเดตแบบ Real-time (สำหรับทดสอบ)
};

const addStorageItem = (key, item) => {
    const data = getStorageData(key);
    const newItem = {
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: Date.now(),
    };
    setStorageData(key, [...data, newItem]);
};

const deleteStorageItem = (key, id) => {
    const data = getStorageData(key);
    setStorageData(
        key,
        data.filter((item) => item.id !== id),
    );
};

const updateStorageItem = (key, id, updatedFields) => {
    const data = getStorageData(key);
    const newData = data.map((item) =>
        item.id === id ? { ...item, ...updatedFields } : item,
    );
    setStorageData(key, newData);
};

export default function BabyApp() {
    const [user, setUser] = useState(null);
    const [familyId, setFamilyId] = useState("");
    const [inputFamilyId, setInputFamilyId] = useState("");
    const [isJoining, setIsJoining] = useState(false);

    // ตรวจสอบการ Login และรหัสครอบครัว
    useEffect(() => {
        let savedUser = localStorage.getItem("kidsync_user");
        if (!savedUser) {
            savedUser = "user_" + Math.random().toString(36).substr(2, 9);
            localStorage.setItem("kidsync_user", savedUser);
        }
        setUser(savedUser);

        const savedFamily = localStorage.getItem("kidsync_family");
        if (savedFamily) {
            setFamilyId(savedFamily);
        }
    }, []);

    const createFamily = () => {
        const newFamilyId = Math.random()
            .toString(36)
            .substr(2, 6)
            .toUpperCase();
        setFamilyId(newFamilyId);
        localStorage.setItem("kidsync_family", newFamilyId);
    };

    const joinFamily = () => {
        if (inputFamilyId.trim().length > 0) {
            setFamilyId(inputFamilyId.trim().toUpperCase());
            localStorage.setItem(
                "kidsync_family",
                inputFamilyId.trim().toUpperCase(),
            );
        }
    };

    // หน้าจอสำหรับเชื่อมต่อครอบครัว (Login / Join Family)
    if (!familyId) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 max-w-md mx-auto shadow-2xl">
                <div className="bg-white p-8 rounded-3xl shadow-sm w-full text-center border border-slate-100">
                    <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-10 h-10 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">
                        KidSync
                    </h1>
                    <p className="text-slate-500 mb-8 text-sm">
                        เชื่อมต่อตารางกิจกรรมของลูก
                        <br />
                        ให้พ่อแม่รู้ทุกความเคลื่อนไหว
                    </p>

                    <button
                        onClick={createFamily}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-blue-200 transition-transform active:scale-95 mb-4"
                    >
                        สร้างรหัสครอบครัวใหม่
                    </button>

                    <div className="relative flex items-center py-4">
                        <div className="flex-grow border-t border-slate-100"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-medium">
                            หรือ
                        </span>
                        <div className="flex-grow border-t border-slate-100"></div>
                    </div>

                    {!isJoining ? (
                        <button
                            onClick={() => setIsJoining(true)}
                            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-4 px-4 rounded-xl transition-colors border border-slate-200"
                        >
                            เข้าร่วมครอบครัวที่มีอยู่
                        </button>
                    ) : (
                        <div className="flex gap-2 animate-in fade-in slide-in-from-bottom-2">
                            <input
                                type="text"
                                placeholder="กรอกรหัส 6 หลัก"
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase text-center tracking-widest"
                                value={inputFamilyId}
                                onChange={(e) =>
                                    setInputFamilyId(e.target.value)
                                }
                                maxLength={6}
                            />
                            <button
                                onClick={joinFamily}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 rounded-xl shadow-md transition-colors"
                            >
                                ตกลง
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // หากมี Family ID แล้ว ให้แสดงหน้าแดชบอร์ด
    return (
        <MainDashboard
            user={user}
            familyId={familyId}
            setFamilyId={setFamilyId}
        />
    );
}

function MainDashboard({ user, familyId, setFamilyId }) {
    const [activities, setActivities] = useState([]);
    const [routines, setRoutines] = useState([]);

    const [isAddingAdhoc, setIsAddingAdhoc] = useState(false);
    const [isAddingRoutine, setIsAddingRoutine] = useState(false);
    const [editingAdhocItem, setEditingAdhocItem] = useState(null);
    const [editingRoutineItem, setEditingRoutineItem] = useState(null);
    const [showSettings, setShowSettings] = useState(false);

    const [activeTab, setActiveTab] = useState("today"); // 'today' or 'routines'
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0],
    );

    // ดึงข้อมูลเมื่อ Component ถูกโหลด หรือเมื่อมีการอัปเดต Storage
    useEffect(() => {
        const loadData = () => {
            setActivities(getStorageData(`activities_${familyId}`));
            setRoutines(getStorageData(`routines_${familyId}`));
        };

        loadData(); // Initial load
        window.addEventListener("storage", loadData); // Listen for changes from other tabs/modals

        return () => window.removeEventListener("storage", loadData);
    }, [familyId]);

    // ประมวลผลข้อมูลเพื่อนำมาแสดงในไทม์ไลน์รายวัน
    const todaysTimeline = useMemo(() => {
        const targetDate = new Date(selectedDate);
        const dayOfWeek = targetDate.getDay(); // 0 (Sun) to 6 (Sat)

        // 1. ดึงกิจกรรมพิเศษ (Ad-hoc) ที่ตรงกับวันที่เลือก
        const todaysAdhoc = activities
            .filter((act) => act.date === selectedDate)
            .map((a) => ({ ...a, isRoutine: false }));

        // 2. ดึงตารางประจำ (Routines) ที่กำหนดให้เกิดในวันของสัปดาห์นี้
        const todaysRoutines = routines
            .filter(
                (routine) => routine.days && routine.days.includes(dayOfWeek),
            )
            .map((r) => ({ ...r, isRoutine: true }));

        // 3. นำมารวมกัน และเรียงตามเวลา (เช้าไปเย็น)
        const combined = [...todaysAdhoc, ...todaysRoutines].sort((a, b) => {
            return a.time.localeCompare(b.time);
        });

        return combined;
    }, [activities, routines, selectedDate]);

    // ฟังก์ชันลบกิจกรรม
    const handleDeleteAdhoc = (activityId) => {
        deleteStorageItem(`activities_${familyId}`, activityId);
        setActivities(getStorageData(`activities_${familyId}`)); // อัปเดต State
    };

    const handleDeleteRoutine = (routineId) => {
        deleteStorageItem(`routines_${familyId}`, routineId);
        setRoutines(getStorageData(`routines_${familyId}`)); // อัปเดต State
    };

    // เปลี่ยนวันในปฏิทิน
    const changeDate = (offset) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + offset);
        setSelectedDate(d.toISOString().split("T")[0]);
    };

    const resetToToday = () => {
        setSelectedDate(new Date().toISOString().split("T")[0]);
    };

    return (
        <div className="min-h-screen bg-slate-50 max-w-md mx-auto relative shadow-2xl overflow-hidden flex flex-col">
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

                            <div className="relative flex flex-col items-center justify-center flex-1 mx-2 group">
                                {/* ซ่อน Date Input ไว้ด้านบนสุด เพื่อให้คลิกแล้วเปิดปฏิทิน (Native Datepicker) */}
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => {
                                        if (e.target.value)
                                            setSelectedDate(e.target.value);
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />

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
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                resetToToday();
                                            }}
                                            className="text-[10px] bg-amber-100 text-amber-700 hover:bg-amber-200 font-bold px-3 py-0.5 rounded-full transition shadow-sm flex items-center gap-1 active:scale-95 cursor-pointer"
                                        >
                                            กลับมาวันนี้
                                        </button>
                                    )}
                                </div>
                            </div>

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
                                        key={activity.id + activity.isRoutine}
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

                        {routines.length === 0 ? (
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
                                {routines
                                    .sort((a, b) =>
                                        a.time.localeCompare(b.time),
                                    )
                                    .map((routine) => (
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

            {/* Floating Action Button แบบ Contextual (เปลี่ยนตาม Tab ที่เลือก) */}
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

            {/* Modals สำหรับการเพิ่มข้อมูล */}
            {(isAddingAdhoc || editingAdhocItem) && (
                <AddAdhocModal
                    familyId={familyId}
                    initialDate={selectedDate}
                    editItem={editingAdhocItem}
                    onClose={() => {
                        setIsAddingAdhoc(false);
                        setEditingAdhocItem(null);
                        setActivities(getStorageData(`activities_${familyId}`)); // รีโหลดเพื่อให้แสดงผลทันที
                    }}
                />
            )}

            {(isAddingRoutine || editingRoutineItem) && (
                <AddRoutineModal
                    familyId={familyId}
                    editItem={editingRoutineItem}
                    onClose={() => {
                        setIsAddingRoutine(false);
                        setEditingRoutineItem(null);
                        setRoutines(getStorageData(`routines_${familyId}`)); // รีโหลด
                    }}
                />
            )}

            {showSettings && (
                <SettingsModal
                    user={user}
                    familyId={familyId}
                    setFamilyId={setFamilyId}
                    onCloseModal={() => setShowSettings(false)}
                />
            )}
        </div>
    );
}

function ActivityCard({ activity, onEdit, onDelete }) {
    const typeInfo =
        ACTIVITY_TYPES.find((t) => t.id === activity.type) || ACTIVITY_TYPES[0];

    return (
        <div className="relative flex items-start gap-3 group w-full">
            {/* Timeline Line/Dot */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 bg-white text-slate-400 shadow-sm shrink-0 z-10">
                <Clock className="w-4 h-4" />
            </div>

            {/* Card Content */}
            <div
                className={`flex-1 min-w-0 p-4 rounded-2xl shadow-sm border flex items-start gap-3 transition-all ${
                    activity.isRoutine
                        ? "bg-white border-slate-200"
                        : "bg-amber-50 border-amber-200 shadow-amber-100/50"
                }`}
            >
                <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${typeInfo.color}`}
                >
                    {typeInfo.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-slate-800 text-base">
                                {typeInfo.label}
                            </h3>
                            <span className="text-blue-600 font-bold text-sm">
                                {activity.time}
                            </span>
                        </div>

                        {!activity.isRoutine ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-md whitespace-nowrap ml-2">
                                <Star className="w-3 h-3" fill="currentColor" />{" "}
                                พิเศษ
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md whitespace-nowrap ml-2">
                                <Repeat className="w-3 h-3" /> ประจำ
                            </span>
                        )}
                    </div>
                    {activity.note && (
                        <p
                            className={`mt-2 text-xs break-words p-2.5 rounded-lg border ${activity.isRoutine ? "bg-slate-50 text-slate-600 border-slate-100" : "bg-white/60 text-amber-900 border-amber-100/50"}`}
                        >
                            {activity.note}
                        </p>
                    )}
                </div>
                {/* อนุญาตให้แก้ไขและลบได้เฉพาะกิจกรรมพิเศษ (Ad-hoc) เท่านั้น */}
                {!activity.isRoutine && (
                    <div className="flex flex-col items-center gap-1 flex-shrink-0 ml-1">
                        {onEdit && (
                            <button
                                onClick={onEdit}
                                className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-blue-500 transition rounded-full hover:bg-blue-50"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={onDelete}
                                className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-500 transition rounded-full hover:bg-red-50"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function RoutineCard({ routine, onEdit, onDelete }) {
    const typeInfo =
        ACTIVITY_TYPES.find((t) => t.id === routine.type) || ACTIVITY_TYPES[0];

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-start gap-4">
            <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${typeInfo.color}`}
            >
                {typeInfo.icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-slate-800 text-base">
                            {typeInfo.label}
                        </h3>
                        <div className="flex items-center gap-1 text-amber-600 font-bold text-sm mt-0.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{routine.time}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                            onClick={onEdit}
                            className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-blue-500 transition rounded-full hover:bg-blue-50"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onDelete}
                            className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 transition rounded-full hover:bg-red-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                    {DAYS_OF_WEEK.map((day) => {
                        const isActive =
                            routine.days && routine.days.includes(day.id);
                        return (
                            <span
                                key={day.id}
                                className={`text-[10px] px-2 py-1 rounded-md font-bold ${
                                    isActive
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-slate-50 text-slate-300"
                                }`}
                            >
                                {day.label}
                            </span>
                        );
                    })}
                </div>

                {routine.note && (
                    <p className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-slate-600 mt-2 text-xs break-words">
                        {routine.note}
                    </p>
                )}
            </div>
        </div>
    );
}

function AddAdhocModal({ familyId, initialDate, editItem, onClose }) {
    const now = new Date();
    const defaultTime = now.toTimeString().split(" ")[0].substring(0, 5);

    const [type, setType] = useState(editItem ? editItem.type : "doctor");
    const [date, setDate] = useState(editItem ? editItem.date : initialDate);
    const [time, setTime] = useState(editItem ? editItem.time : defaultTime);
    const [note, setNote] = useState(
        editItem && editItem.note ? editItem.note : "",
    );

    const handleSave = () => {
        if (editItem) {
            updateStorageItem(`activities_${familyId}`, editItem.id, {
                type,
                date,
                time,
                note,
            });
        } else {
            addStorageItem(`activities_${familyId}`, {
                type,
                date,
                time,
                note,
            });
        }
        onClose();
    };

    return (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col justify-end">
            <div className="bg-white w-full rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Star
                                className="w-6 h-6 text-blue-500"
                                fill="currentColor"
                            />{" "}
                            {editItem
                                ? "แก้ไขกิจกรรมพิเศษ"
                                : "เพิ่มกิจกรรมพิเศษ"}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                            เกิดขึ้นเฉพาะวันที่เลือก ไม่ซ้ำกับวันอื่น
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-5">
                    {/* เลือกวันที่ */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                วันที่
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                เวลา
                            </label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                            />
                        </div>
                    </div>

                    {/* เลือกประเภทกิจกรรม */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">
                            ประเภทกิจกรรม
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {ACTIVITY_TYPES.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setType(t.id)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                                        type === t.id
                                            ? "border-blue-500 bg-blue-50 shadow-sm"
                                            : "border-slate-100 bg-white hover:border-slate-200"
                                    }`}
                                >
                                    <span className="text-3xl mb-2">
                                        {t.icon}
                                    </span>
                                    <span
                                        className={`text-xs font-bold ${type === t.id ? "text-blue-700" : "text-slate-500"}`}
                                    >
                                        {t.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            รายละเอียด (ทางเลือก)
                        </label>
                        <input
                            type="text"
                            placeholder="เช่น นัดหมอฟัน, งานกีฬาโรงเรียน..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg transition-transform active:scale-95"
                    >
                        {editItem ? "บันทึกการแก้ไข" : "บันทึกกิจกรรมพิเศษ"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function AddRoutineModal({ familyId, editItem, onClose }) {
    const [type, setType] = useState(editItem ? editItem.type : "school");
    const [time, setTime] = useState(editItem ? editItem.time : "08:00");
    const [note, setNote] = useState(
        editItem && editItem.note ? editItem.note : "",
    );
    const [selectedDays, setSelectedDays] = useState(
        editItem ? editItem.days : [1, 2, 3, 4, 5],
    ); // ค่าเริ่มต้นคือ จันทร์-ศุกร์

    const toggleDay = (dayId) => {
        if (selectedDays.includes(dayId)) {
            if (selectedDays.length > 1) {
                // บังคับให้เลือกอย่างน้อย 1 วัน
                setSelectedDays(selectedDays.filter((d) => d !== dayId));
            }
        } else {
            setSelectedDays([...selectedDays, dayId]);
        }
    };

    const handleSave = () => {
        if (editItem) {
            updateStorageItem(`routines_${familyId}`, editItem.id, {
                type,
                time,
                days: selectedDays,
                note,
            });
        } else {
            addStorageItem(`routines_${familyId}`, {
                type,
                time,
                days: selectedDays,
                note,
            });
        }
        onClose();
    };

    return (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col justify-end">
            <div className="bg-white w-full rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Repeat className="w-6 h-6 text-amber-500" />{" "}
                            {editItem ? "แก้ไขตารางประจำ" : "สร้างตารางประจำ"}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                            กิจกรรมที่ทำเป็นประจำ จะถูกแสดงอัตโนมัติ
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-5">
                    {/* เลือกวันในสัปดาห์ที่เกิดซ้ำ */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">
                            ทำซ้ำทุกวันไหนบ้าง?
                        </label>
                        <div className="flex gap-2 justify-between">
                            {DAYS_OF_WEEK.map((day) => {
                                const isSelected = selectedDays.includes(
                                    day.id,
                                );
                                return (
                                    <button
                                        key={day.id}
                                        onClick={() => toggleDay(day.id)}
                                        className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                                            isSelected
                                                ? "bg-amber-500 text-white shadow-md shadow-amber-200"
                                                : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                        }`}
                                    >
                                        {day.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* เวลา */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            เวลาเริ่มกิจกรรม
                        </label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                        />
                    </div>

                    {/* เลือกประเภทกิจกรรม */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">
                            กิจกรรม
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {ACTIVITY_TYPES.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setType(t.id)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                                        type === t.id
                                            ? "border-amber-500 bg-amber-50 shadow-sm"
                                            : "border-slate-100 bg-white hover:border-slate-200"
                                    }`}
                                >
                                    <span className="text-3xl mb-2">
                                        {t.icon}
                                    </span>
                                    <span
                                        className={`text-xs font-bold ${type === t.id ? "text-amber-700" : "text-slate-500"}`}
                                    >
                                        {t.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            รายละเอียด (ทางเลือก)
                        </label>
                        <input
                            type="text"
                            placeholder="เช่น รถโรงเรียนมารับ, เรียนเปียโน..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-4 rounded-xl shadow-lg transition-transform active:scale-95"
                    >
                        {editItem ? "บันทึกการแก้ไข" : "บันทึกตารางประจำ"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function SettingsModal({ user, familyId, setFamilyId, onCloseModal }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(familyId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLogout = () => {
        localStorage.removeItem("kidsync_family"); // ลบรหัสครอบครัวออกจากเครื่อง
        setFamilyId(""); // ออกไปหน้าล็อคอิน
        onCloseModal();
    };

    return (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col justify-end">
            <div className="bg-white w-full rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">
                        ตั้งค่าครอบครัว
                    </h2>
                    <button
                        onClick={onCloseModal}
                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex flex-col items-center text-center">
                        <p className="text-sm text-blue-600 font-bold mb-2">
                            รหัสครอบครัวของคุณ (Family Code)
                        </p>
                        <div className="text-4xl font-mono font-bold text-blue-900 tracking-widest mb-4">
                            {familyId}
                        </div>

                        <button
                            onClick={handleCopy}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-colors ${
                                copied
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-white text-blue-700 shadow-sm hover:bg-blue-100"
                            }`}
                        >
                            {copied ? (
                                <CheckCircle2 className="w-4 h-4" />
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                            {copied
                                ? "คัดลอกรหัสแล้ว"
                                : "คัดลอกรหัส (ส่งให้พ่อ/แม่)"}
                        </button>
                        <p className="text-xs text-blue-500 mt-4 font-medium">
                            นำรหัสนี้ไปกรอกในเครื่องอื่น เพื่อแชร์ตารางเดียวกัน
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-4 px-4 rounded-xl transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        ออกจากครอบครัวนี้
                    </button>
                </div>
            </div>
        </div>
    );
}
