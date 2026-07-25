import { Clock, Star, Repeat, Edit2, X } from "lucide-react";
import { ACTIVITY_TYPES, type IActivity } from "../interface";

interface ActivityCardProps {
    activity: IActivity;
    onEdit?: () => void;
    onDelete?: () => void;
}

export const ActivityCard = ({ activity, onEdit, onDelete }: ActivityCardProps) => {
    const typeInfo = ACTIVITY_TYPES.find((t) => t.id === activity.type) || ACTIVITY_TYPES[0];

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
