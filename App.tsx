import React, { useState } from 'react';
import { ViewState, KnowledgeDoc } from './types';
import { INITIAL_DOCS, INITIAL_PROFILE } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import KnowledgeBase from './components/KnowledgeBase';
import Tracker from './components/Tracker';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [docs, setDocs] = useState<KnowledgeDoc[]>(INITIAL_DOCS);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Doc management
  const addDoc = (doc: KnowledgeDoc) => setDocs(prev => [doc, ...prev]);
  const removeDoc = (id: string) => setDocs(prev => prev.filter(d => d.id !== id));

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard profile={INITIAL_PROFILE} docs={docs} goToChat={() => setCurrentView('chat')} />;
      case 'chat':
        return <ChatInterface docs={docs} profile={INITIAL_PROFILE} />;
      case 'knowledge':
        return <KnowledgeBase docs={docs} addDoc={addDoc} removeDoc={removeDoc} />;
      case 'tracker':
        return <Tracker />;
      default:
        return <Dashboard profile={INITIAL_PROFILE} docs={docs} goToChat={() => setCurrentView('chat')} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      <main className="flex-1 flex flex-col h-full w-full relative overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4 flex-none z-10">
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-3 font-semibold text-slate-800">VitalSync</span>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto scrollbar-hide">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;