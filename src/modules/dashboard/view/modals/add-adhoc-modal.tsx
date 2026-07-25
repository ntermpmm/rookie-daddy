import { useState } from "react";
import { Star, X } from "lucide-react";
import { motion } from "framer-motion";
import {
    ACTIVITY_TYPES,
    type IActivity,
    type ActivityType,
} from "../../interface";
import type { ConfirmAction } from "./confirm-modal";

interface AddAdhocModalProps {
    initialDate: string;
    editItem: IActivity | null;
    onClose: () => void;
    onSave: (activity: any) => void;
    onUpdate: (id: string, updates: any) => void;
    requestConfirm: (action: ConfirmAction) => void;
}

export const AddAdhocModal = ({
    initialDate,
    editItem,
    onClose,
    onSave,
    onUpdate,
    requestConfirm,
}: AddAdhocModalProps) => {
    const now = new Date();
    const defaultTime = now.toTimeString().split(" ")[0].substring(0, 5);

    const [type, setType] = useState<ActivityType>(
        editItem ? editItem.type : "doctor",
    );
    const [date, setDate] = useState(editItem ? editItem.date : initialDate);
    const [time, setTime] = useState(editItem ? editItem.time : defaultTime);
    const [durationMinutes, setDurationMinutes] = useState<number>(
        editItem?.durationMinutes || 60,
    );
    const [isMultiDay, setIsMultiDay] = useState<boolean>(!!editItem?.endDate);
    const [endDate, setEndDate] = useState<string>(
        editItem?.endDate || initialDate,
    );

    const [note, setNote] = useState(
        editItem && editItem.note ? editItem.note : "",
    );

    const handleSave = () => {
        const activityData = {
            type,
            date,
            time,
            durationMinutes,
            endDate: isMultiDay ? endDate : undefined,
            note,
        };

        if (editItem) {
            requestConfirm({
                title: "บันทึกการแก้ไข?",
                message: "คุณต้องการบันทึกการเปลี่ยนแปลงกิจกรรมนี้ใช่หรือไม่?",
                confirmText: "บันทึก",
                onConfirm: () => {
                    onUpdate(editItem.id, activityData);
                    onClose();
                },
            });
        } else {
            onSave(activityData);
            onClose();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col justify-end"
        >
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="bg-white w-full rounded-t-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />
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
                    {/* วันที่ เวลา และระยะเวลา */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="min-w-0">
                                <label className="block text-sm font-bold text-slate-700 mb-2 truncate">
                                    วันที่เริ่มต้น
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium appearance-none"
                                />
                            </div>
                            <div className="min-w-0">
                                <label className="block text-sm font-bold text-slate-700 mb-2 truncate">
                                    เวลา
                                </label>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium appearance-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    ระยะเวลา
                                </label>
                                <select
                                    value={durationMinutes}
                                    onChange={(e) =>
                                        setDurationMinutes(
                                            Number(e.target.value),
                                        )
                                    }
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium appearance-none"
                                >
                                    <option value={15}>15 นาที</option>
                                    <option value={30}>30 นาที</option>
                                    <option value={45}>45 นาที</option>
                                    <option value={60}>1 ชั่วโมง</option>
                                    <option value={90}>1.5 ชั่วโมง</option>
                                    <option value={120}>2 ชั่วโมง</option>
                                    <option value={180}>3 ชั่วโมง</option>
                                    <option value={1440}>
                                        ทั้งวัน (24 ชม.)
                                    </option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="flex items-center gap-2 cursor-pointer mb-3">
                                    <input
                                        type="checkbox"
                                        checked={isMultiDay}
                                        onChange={(e) =>
                                            setIsMultiDay(e.target.checked)
                                        }
                                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-bold text-slate-700">
                                        จัดกิจกรรมหลายวัน
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* วันที่สิ้นสุด (แสดงเมื่อเลือกหลายวัน) */}
                        {isMultiDay && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    วันที่สิ้นสุด
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    min={date}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                />
                            </div>
                        )}
                    </div>

                    {/* เลือกประเภทกิจกรรม */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">
                            ประเภทกิจกรรม
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {ACTIVITY_TYPES.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setType(t.id)}
                                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${
                                        type === t.id
                                            ? "border-blue-500 bg-blue-50 shadow-sm"
                                            : "border-slate-100 bg-white hover:border-slate-200"
                                    }`}
                                >
                                    <span className="text-2xl mb-1">
                                        {t.icon}
                                    </span>
                                    <span
                                        className={`text-[10px] font-bold ${
                                            type === t.id
                                                ? "text-blue-700"
                                                : "text-slate-500"
                                        }`}
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
            </motion.div>
        </motion.div>
    );
};
