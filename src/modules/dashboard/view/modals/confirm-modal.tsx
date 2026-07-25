import { motion } from "framer-motion";
import { AlertTriangle, Info } from "lucide-react";

export interface ConfirmAction {
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
}

interface ConfirmModalProps {
    action: ConfirmAction;
    onClose: () => void;
}

export const ConfirmModal = ({ action, onClose }: ConfirmModalProps) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="bg-white rounded-3xl w-full max-w-sm p-6 relative z-10 shadow-2xl overflow-hidden"
            >
                {/* Decoration */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${action.danger ? 'bg-red-500' : 'bg-blue-500'}`} />

                <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${action.danger ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                        {action.danger ? <AlertTriangle className="w-8 h-8" /> : <Info className="w-8 h-8" />}
                    </div>
                    
                    <h2 className="text-xl font-bold text-slate-800 mb-2">
                        {action.title}
                    </h2>
                    
                    <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">
                        {action.message}
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors active:scale-95"
                        >
                            {action.cancelText || "ยกเลิก"}
                        </button>
                        <button
                            onClick={() => {
                                action.onConfirm();
                                onClose();
                            }}
                            className={`flex-1 py-3.5 px-4 text-white font-bold rounded-xl transition-colors active:scale-95 shadow-lg ${
                                action.danger
                                    ? "bg-red-500 hover:bg-red-600 shadow-red-200/50"
                                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-200/50"
                            }`}
                        >
                            {action.confirmText || "ตกลง"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
