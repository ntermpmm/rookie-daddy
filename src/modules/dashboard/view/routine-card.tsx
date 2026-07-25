import { Clock, Edit2, X } from "lucide-react";
import { ACTIVITY_TYPES, DAYS_OF_WEEK, type IRoutine } from "../interface";

const getEndTime = (time: string, durationMinutes = 60) => {
    if (durationMinutes === 1440) return "ทั้งวัน";
    const [h, m] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(h, m + durationMinutes);
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

interface RoutineCardProps {
    routine: IRoutine;
    onEdit?: () => void;
    onDelete?: () => void;
}

export const RoutineCard = ({ routine, onEdit, onDelete }: RoutineCardProps) => {
    const typeInfo = ACTIVITY_TYPES.find((t) => t.id === routine.type) || ACTIVITY_TYPES[0];

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
                            <span>{routine.time} {routine.durationMinutes !== 1440 ? `- ${getEndTime(routine.time, routine.durationMinutes)}` : '(ทั้งวัน)'}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                        {onEdit && (
                            <button
                                onClick={onEdit}
                                className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-blue-500 transition rounded-full hover:bg-blue-50"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={onDelete}
                                className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 transition rounded-full hover:bg-red-50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                    {DAYS_OF_WEEK.map((day) => {
                        const isActive = routine.days && routine.days.includes(day.id);
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
                    {routine.frequency === "biweekly" && (
                        <span className="text-[10px] px-2 py-1 ml-2 rounded-md font-bold bg-purple-100 text-purple-700">
                            เว้นสัปดาห์
                        </span>
                    )}
                </div>

                {routine.note && (
                    <p className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-slate-600 mt-2 text-xs break-words">
                        {routine.note}
                    </p>
                )}
            </div>
        </div>
    );
};
