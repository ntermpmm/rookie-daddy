export type ActivityType =
    | "school"
    | "homework"
    | "tutor"
    | "play"
    | "doctor"
    | "routine"
    | "other";

export interface ActivityTypeInfo {
    id: ActivityType;
    label: string;
    icon: string;
    color: string;
}

export const ACTIVITY_TYPES: ActivityTypeInfo[] = [
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
    {
        id: "other",
        label: "อื่นๆ",
        icon: "📌",
        color: "bg-slate-100 text-slate-700 border-slate-200",
    },
];

export const DAYS_OF_WEEK = [
    { id: 1, label: "จ.", value: "จันทร์" },
    { id: 2, label: "อ.", value: "อังคาร" },
    { id: 3, label: "พ.", value: "พุธ" },
    { id: 4, label: "พฤ.", value: "พฤหัสบดี" },
    { id: 5, label: "ศ.", value: "ศุกร์" },
    { id: 6, label: "ส.", value: "เสาร์" },
    { id: 0, label: "อา.", value: "อาทิตย์" },
];

export interface IActivity {
    id: string;
    type: ActivityType;
    date: string; // YYYY-MM-DD
    endDate?: string; // YYYY-MM-DD for multi-day events
    time: string; // HH:mm
    durationMinutes?: number; // Duration of the activity in minutes
    note: string;
    createdAt: number;
    isRoutine?: boolean;
    frequency?: "weekly" | "biweekly";
}

export interface IRoutine {
    id: string;
    type: ActivityType;
    time: string; // HH:mm
    durationMinutes?: number; // Duration of the routine in minutes
    days: number[]; // 0-6 corresponding to Date.getDay()
    frequency?: "weekly" | "biweekly";
    startDate?: string; // YYYY-MM-DD (Used for biweekly logic)
    note: string;
    createdAt: number;
}
