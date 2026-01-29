import { User, Bell, Settings, Menu } from "lucide-react";

interface HeaderProps {
    onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
    return (
        <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
                {onMenuToggle && (
                    <button
                        onClick={onMenuToggle}
                        className="p-2 -ml-2 hover:bg-slate-50 rounded-lg transition-colors md:hidden"
                    >
                        <Menu className="w-6 h-6 text-slate-600" />
                    </button>
                )}
                <h1 className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wider truncate max-w-[200px] md:max-w-none">
                    Secretaría de Educación Departamental
                </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-6">
                <button className="hidden sm:block text-slate-400 hover:text-slate-600">
                    <Bell className="w-5 h-5" />
                </button>
                <button className="hidden sm:block text-slate-400 hover:text-slate-600">
                    <Settings className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 md:pl-6 md:border-l md:border-slate-200">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-bold text-slate-900 leading-none">Usuario Admin</p>
                        <p className="text-xs text-slate-500 mt-1">Administrador</p>
                    </div>
                    <div className="w-8 h-8 md:w-9 md:h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 border border-slate-200">
                        <User className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                </div>
            </div>
        </header>
    );
}
