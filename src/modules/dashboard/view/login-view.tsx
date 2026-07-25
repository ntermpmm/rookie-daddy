import { BookOpen } from "lucide-react";

interface LoginViewProps {
    isJoining: boolean;
    inputFamilyId: string;
    setInputFamilyId: (id: string) => void;
    setIsJoining: (joining: boolean) => void;
    createFamily: () => void;
    joinFamily: () => void;
}

export const LoginView = ({
    isJoining,
    inputFamilyId,
    setInputFamilyId,
    setIsJoining,
    createFamily,
    joinFamily,
}: LoginViewProps) => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 w-full shadow-2xl">
            <div className="bg-white p-8 rounded-3xl shadow-sm w-full text-center border border-slate-100">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-10 h-10 text-blue-600" />
                </div>
                <h1 className="text-3xl font-black text-slate-800 mb-2">
                    Rookie Daddy
                </h1>
                <p className="text-slate-500 mb-8">
                    จัดการตารางเวลาและกิจวัตรประจำวันของลูกน้อยฉบับคุณพ่อมือใหม่ (พ่อลูกอ่อน)
                </p>

                <button
                    onClick={createFamily}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-blue-200 transition-transform active:scale-95 mb-4"
                >
                    สร้างรหัสครอบครัวใหม่
                </button>

                <div className="relative flex items-center py-4">
                    <div className="flex-grow border-t border-slate-100"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-medium">
                        หรือ
                    </span>
                    <div className="flex-grow border-t border-slate-100"></div>
                </div>

                {!isJoining ? (
                    <button
                        onClick={() => setIsJoining(true)}
                        className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-4 px-4 rounded-xl transition-colors border border-slate-200"
                    >
                        เข้าร่วมครอบครัวที่มีอยู่
                    </button>
                ) : (
                    <div className="flex gap-2 animate-in fade-in slide-in-from-bottom-2">
                        <input
                            type="text"
                            placeholder="กรอกรหัส 6 หลัก"
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase text-center tracking-widest"
                            value={inputFamilyId}
                            onChange={(e) =>
                                setInputFamilyId(e.target.value)
                            }
                            maxLength={6}
                        />
                        <button
                            onClick={joinFamily}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 rounded-xl shadow-md transition-colors"
                        >
                            ตกลง
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
