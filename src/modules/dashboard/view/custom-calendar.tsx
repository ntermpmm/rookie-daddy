import { useState } from "react";
import { ChevronLeft, ChevronRight, X, CalendarDays, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { ACTIVITY_TYPES, type IActivity } from "../interface";
import { formatThaiDate } from "../utils";

interface CustomCalendarProps {
    selectedDate: string; // YYYY-MM-DD
    onSelectDate: (date: string) => void;
    familyActivities: IActivity[];
    onClose: () => void;
}

export const CustomCalendar = ({
    selectedDate,
    onSelectDate,
    familyActivities,
    onClose,
}: CustomCalendarProps) => {
    // Current month view state (default to the selected date's month)
    const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

    // Helpers to generate the calendar grid
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday...
    };

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    // Create array for blank spaces before the 1st of the month
    const blanks = Array.from({ length: firstDay }, (_, i) => i);
    // Create array for the days of the month
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const changeMonth = (offset: number) => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() + offset);
        setCurrentMonth(newMonth);
    };

    // Check if a specific date string has any ad-hoc activities
    const hasActivity = (dateStr: string) => {
        return familyActivities.some((act) => {
            if (act.date === dateStr) return true;
            if (act.endDate && dateStr >= act.date && dateStr <= act.endDate) return true;
            return false;
        });
    };

    const handleDateSelect = (dateStr: string) => {
        onSelectDate(dateStr);
        onClose();
    };

    const now = new Date();
    const localTodayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const monthNames = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    const dayNames = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col justify-end"
            onClick={onClose}
        >
            <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="bg-white w-full rounded-t-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">
                        เลือกวันที่
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4 bg-slate-50 rounded-2xl p-2 border border-slate-100">
                    <button
                        onClick={() => changeMonth(-1)}
                        className="p-2 text-slate-500 hover:bg-white rounded-xl transition shadow-sm border border-transparent hover:border-slate-200"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-slate-800">
                        {monthNames[month]} {year + 543}
                    </span>
                    <button
                        onClick={() => changeMonth(1)}
                        className="p-2 text-slate-500 hover:bg-white rounded-xl transition shadow-sm border border-transparent hover:border-slate-200"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {dayNames.map((day) => (
                        <div key={day} className="text-xs font-bold text-slate-400 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {blanks.map((blank) => (
                        <div key={`blank-${blank}`} className="h-12"></div>
                    ))}

                    {days.map((day) => {
                        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const isSelected = selectedDate === dateStr;
                        const isToday = localTodayStr === dateStr;
                        const hasAdhoc = hasActivity(dateStr);

                        return (
                            <button
                                key={day}
                                onClick={() => handleDateSelect(dateStr)}
                                className={`relative h-12 w-full flex flex-col items-center justify-center rounded-xl font-medium text-sm transition-all active:scale-95 ${
                                    isSelected
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                        : isToday
                                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                                        : "hover:bg-slate-50 text-slate-700"
                                }`}
                            >
                                <span>{day}</span>
                                {hasAdhoc && (
                                    <span
                                        className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${
                                            isSelected ? "bg-white" : "bg-amber-500"
                                        }`}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </motion.div>
        </motion.div>
    );
};
