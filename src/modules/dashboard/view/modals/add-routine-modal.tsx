import { useState } from "react";
import { Repeat, X } from "lucide-react";
import { ACTIVITY_TYPES, DAYS_OF_WEEK, type IRoutine, type ActivityType } from "../../interface";

interface AddRoutineModalProps {
    editItem: IRoutine | null;
    onClose: () => void;
    onSave: (routine: any) => void;
    onUpdate: (id: string, updates: any) => void;
}

export const AddRoutineModal = ({
    editItem,
    onClose,
    onSave,
    onUpdate,
}: AddRoutineModalProps) => {
    const [type, setType] = useState<ActivityType>(
        editItem ? editItem.type : "school",
    );
    const [time, setTime] = useState(editItem ? editItem.time : "08:00");
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
        if (editItem) {
            onUpdate(editItem.id, { type, time, days: selectedDays, note });
        } else {
            onSave({ type, time, days: selectedDays, note });
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
                                const isSelected = selectedDays.includes(day.id);
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
                                    <span className="text-3xl mb-2">{t.icon}</span>
                                    <span
                                        className={`text-xs font-bold ${
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
            </div>
        </div>
    );
};
