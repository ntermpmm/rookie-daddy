import { useState } from "react";
import { Repeat, X } from "lucide-react";
import { motion } from "framer-motion";
import {
    ACTIVITY_TYPES,
    DAYS_OF_WEEK,
    type ActivityType,
    type IRoutine,
} from "../../interface";
import type { ConfirmAction } from "./confirm-modal";

interface AddRoutineModalProps {
    editItem: IRoutine | null;
    onClose: () => void;
    onSave: (routine: any) => void;
    onUpdate: (id: string, updates: any) => void;
    requestConfirm: (action: ConfirmAction) => void;
}

export const AddRoutineModal = ({
    editItem,
    onClose,
    onSave,
    onUpdate,
    requestConfirm,
}: AddRoutineModalProps) => {
    const [type, setType] = useState<ActivityType>(
        editItem ? editItem.type : "school",
    );
    const [time, setTime] = useState(editItem ? editItem.time : "08:00");
    const [durationMinutes, setDurationMinutes] = useState<number>(
        editItem?.durationMinutes || 60,
    );
    const [frequency, setFrequency] = useState<"weekly" | "biweekly">(
        editItem?.frequency || "weekly",
    );
    const [startDate, setStartDate] = useState<string>(
        editItem?.startDate || new Date().toISOString().split("T")[0],
    );
    const [note, setNote] = useState(
        editItem && editItem.note ? editItem.note : "",
    );
    const [selectedDays, setSelectedDays] = useState<number[]>(
        editItem ? editItem.days : [1, 2, 3, 4, 5],
    ); // ค่าเริ่มต้นคือ จันทร์-ศุกร์

    const toggleDay = (dayId: number) => {
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
        const routineData = {
            type,
            time,
            durationMinutes,
            days: selectedDays,
            frequency,
            startDate: frequency === "biweekly" ? startDate : undefined,
            note,
        };
        if (editItem) {
            requestConfirm({
                title: "บันทึกการแก้ไข?",
                message:
                    "คุณต้องการบันทึกการเปลี่ยนแปลงตารางประจำนี้ใช่หรือไม่?",
                confirmText: "บันทึก",
                onConfirm: () => {
                    onUpdate(editItem.id, routineData);
                    onClose();
                },
            });
        } else {
            onSave(routineData);
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

                    {/* เวลา และระยะเวลา */}
                    <div className="flex gap-4">
                        <div className="flex-[0.8]">
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                เวลาเริ่มกิจกรรม
                            </label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                ระยะเวลา
                            </label>
                            <select
                                value={durationMinutes}
                                onChange={(e) =>
                                    setDurationMinutes(Number(e.target.value))
                                }
                                className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium appearance-none"
                            >
                                <option value={15}>15 นาที</option>
                                <option value={30}>30 นาที</option>
                                <option value={45}>45 นาที</option>
                                <option value={60}>1 ชั่วโมง</option>
                                <option value={90}>1.5 ชั่วโมง</option>
                                <option value={120}>2 ชั่วโมง</option>
                                <option value={180}>3 ชั่วโมง</option>
                                <option value={1440}>ทั้งวัน (24 ชม.)</option>
                            </select>
                        </div>
                    </div>

                    {/* ความถี่และวันที่เริ่ม */}
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                ความถี่
                            </label>
                            <select
                                value={frequency}
                                onChange={(e) =>
                                    setFrequency(
                                        e.target.value as "weekly" | "biweekly",
                                    )
                                }
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium appearance-none"
                            >
                                <option value="weekly">ทุกสัปดาห์</option>
                                <option value="biweekly">
                                    อาทิตย์เว้นอาทิตย์
                                </option>
                            </select>
                        </div>
                        {frequency === "biweekly" && (
                            <div className="flex-1 animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    เริ่มนับสัปดาห์แรกวันที่
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                                />
                            </div>
                        )}
                    </div>

                    {/* เลือกประเภทกิจกรรม */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">
                            กิจกรรม
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {ACTIVITY_TYPES.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setType(t.id)}
                                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${
                                        type === t.id
                                            ? "border-amber-500 bg-amber-50 shadow-sm"
                                            : "border-slate-100 bg-white hover:border-slate-200"
                                    }`}
                                >
                                    <span className="text-2xl mb-1">
                                        {t.icon}
                                    </span>
                                    <span
                                        className={`text-[10px] font-bold ${
                                            type === t.id
                                                ? "text-amber-700"
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
            </motion.div>
        </motion.div>
    );
};
