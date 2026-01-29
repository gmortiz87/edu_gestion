"use client";

import { X, AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    loading?: boolean;
    errorMessage?: string | null;
}

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    loading = false,
    errorMessage = null
}: DeleteConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                        <p className="text-slate-500 text-sm">{description}</p>
                    </div>

                    {errorMessage && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-left">
                            <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                                <X className="w-3 h-3" />
                                No se puede completar
                            </p>
                            <p className="text-sm text-red-800 font-medium leading-tight">
                                {errorMessage}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-2 pt-4">
                        {!errorMessage && (
                            <button
                                onClick={onConfirm}
                                disabled={loading}
                                className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Confirmar Eliminación
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className={`w-full py-3 ${errorMessage ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'} font-bold rounded-xl hover:opacity-90 transition-all`}
                        >
                            {errorMessage ? "Entendido" : "Cancelar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
