import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, MessageSquare, Database, Activity, Heart } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isMobileOpen, setIsMobileOpen }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
    { id: 'knowledge', label: 'My Records (RAG)', icon: Database },
    { id: 'tracker', label: 'Health Tracker', icon: Activity },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center h-16 px-6 border-b border-slate-100">
          <Heart className="w-6 h-6 text-teal-600 mr-2" />
          <span className="text-xl font-bold text-slate-800 tracking-tight">VitalSync</span>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
             const Icon = item.icon;
             const isActive = currentView === item.id;
             return (
               <button
                 key={item.id}
                 onClick={() => {
                   setView(item.id as ViewState);
                   setIsMobileOpen(false);
                 }}
                 className={clsx(
                   "flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                   isActive 
                    ? "bg-teal-50 text-teal-700" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                 )}
               >
                 <Icon className={clsx("w-5 h-5 mr-3", isActive ? "text-teal-600" : "text-slate-400")} />
                 {item.label}
               </button>
             );
          })}
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100">
            <div className="bg-teal-600 rounded-lg p-4 text-white">
                <p className="text-xs font-semibold opacity-75 uppercase mb-1">Current Goal</p>
                <p className="text-sm font-medium">Reduce cholesterol & lose 5kg</p>
            </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;