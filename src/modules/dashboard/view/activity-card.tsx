import { Clock, Star, Repeat, Edit2, X, CalendarDays } from "lucide-react";
import { ACTIVITY_TYPES, type IActivity } from "../interface";
import { motion } from "framer-motion";
import { formatThaiDateShort } from "../utils";

const getEndTime = (time: string, durationMinutes = 60) => {
    if (durationMinutes === 1440) return "ทั้งวัน";
    const [h, m] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(h, m + durationMinutes);
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

interface ActivityCardProps {
    activity: IActivity;
    onEdit?: () => void;
    onDelete?: () => void;
    status?: "past" | "now" | "next" | null;
}

export const ActivityCard = ({ activity, onEdit, onDelete, status }: ActivityCardProps) => {
    const typeInfo = ACTIVITY_TYPES.find((t) => t.id === activity.type) || ACTIVITY_TYPES[0];

    return (
        <div className={`group relative flex gap-4 ${status === "past" ? "opacity-60" : ""} transition-opacity duration-500`}>
            {/* Timeline Line & Dot */}
            <div className="flex flex-col items-center mt-1 z-10 relative">
                <div
                    className={`w-4 h-4 rounded-full border-[3px] border-white shadow-sm flex-shrink-0 ${
                        status === "now"
                            ? "bg-blue-600 animate-pulse shadow-blue-400 shadow-md ring-4 ring-blue-100"
                            : status === "next"
                            ? "bg-amber-500 animate-pulse shadow-amber-400 shadow-sm"
                            : "bg-slate-300"
                    }`}
                />
            </div>

            {/* Card Content */}
            <div
                className={`flex-1 min-w-0 p-4 rounded-2xl shadow-sm border flex items-start gap-3 transition-all ${
                    status === "now"
                        ? "border-blue-300 shadow-md shadow-blue-100 bg-white"
                        : status === "next"
                        ? "border-amber-200 shadow-sm shadow-amber-50 bg-white"
                        : activity.isRoutine
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
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-bold text-slate-800 text-base">
                                {typeInfo.label}
                            </h3>
                            <span className="flex items-center text-blue-600 font-bold text-sm mt-1">
                                <Clock className="w-3 h-3 mr-1" />
                                {activity.time} {activity.durationMinutes !== 1440 ? `- ${getEndTime(activity.time, activity.durationMinutes)}` : '(ทั้งวัน)'}
                            </span>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-col items-end gap-1">
                            {!activity.isRoutine ? (
                                <div className="flex flex-col items-end gap-1">
                                    <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-md whitespace-nowrap ml-2">
                                        <Star className="w-3 h-3" fill="currentColor" />{" "}
                                        พิเศษ
                                    </span>
                                    {activity.endDate && activity.endDate !== activity.date && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded-md whitespace-nowrap ml-2">
                                            <CalendarDays className="w-3 h-3" />
                                            {formatThaiDateShort(activity.date)} - {formatThaiDateShort(activity.endDate)}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-end gap-1">
                                    <span className="flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md whitespace-nowrap ml-2">
                                        <Repeat className="w-3 h-3" /> ประจำ
                                    </span>
                                    {activity.frequency === "biweekly" && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded-md whitespace-nowrap ml-2">
                                            เว้นสัปดาห์
                                        </span>
                                    )}
                                </div>
                            )}
                            
                            {status === "now" && (
                                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1 animate-in fade-in">
                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                                    ตอนนี้
                                </span>
                            )}
                            {status === "next" && (
                                <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1 animate-in fade-in">
                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                                    ต่อไป
                                </span>
                            )}
                        </div>
                    </div>
                    {activity.note && (
                        <p
                            className={`mt-2 text-xs break-words p-2.5 rounded-lg border ${
                                activity.isRoutine
                                    ? "bg-slate-50 text-slate-600 border-slate-100"
                                    : "bg-white/60 text-amber-900 border-amber-100/50"
                            }`}
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
};
