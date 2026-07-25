import { useState } from "react";
import { CheckCircle2, Copy, LogOut, X } from "lucide-react";
import { motion } from "framer-motion";

interface SettingsModalProps {
    familyId: string;
    onCloseModal: () => void;
    onLogout: () => void;
}

export const SettingsModal = ({
    familyId,
    onCloseModal,
    onLogout,
}: SettingsModalProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(familyId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLogout = () => {
        onLogout();
        onCloseModal();
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
            </motion.div>
        </motion.div>
    );
};
