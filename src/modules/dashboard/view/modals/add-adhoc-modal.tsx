import { useState } from "react";
import { Star, X } from "lucide-react";
import { ACTIVITY_TYPES, type IActivity, type ActivityType } from "../../interface";

interface AddAdhocModalProps {
    initialDate: string;
    editItem: IActivity | null;
    onClose: () => void;
    onSave: (activity: any) => void;
    onUpdate: (id: string, updates: any) => void;
}

export const AddAdhocModal = ({
    initialDate,
    editItem,
    onClose,
    onSave,
    onUpdate,
}: AddAdhocModalProps) => {
    const now = new Date();
    const defaultTime = now.toTimeString().split(" ")[0].substring(0, 5);

    const [type, setType] = useState<ActivityType>(
        editItem ? editItem.type : "doctor",
    );
    const [date, setDate] = useState(editItem ? editItem.date : initialDate);
    const [time, setTime] = useState(editItem ? editItem.time : defaultTime);
    const [note, setNote] = useState(
        editItem && editItem.note ? editItem.note : "",
    );

    const handleSave = () => {
        if (editItem) {
            onUpdate(editItem.id, { type, date, time, note });
        } else {
            onSave({ type, date, time, note });
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
                            {editItem ? "แก้ไขกิจกรรมพิเศษ" : "เพิ่มกิจกรรมพิเศษ"}
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
                                    <span className="text-3xl mb-2">{t.icon}</span>
                                    <span
                                        className={`text-xs font-bold ${
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
            </div>
        </div>
    );
};
