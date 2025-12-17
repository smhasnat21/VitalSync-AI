import React, { useEffect, useState } from 'react';
import { UserProfile, KnowledgeDoc } from '../types';
import { Activity, Droplets, Moon, Footprints, ArrowRight, FileText } from 'lucide-react';
import { generateHealthTip } from '../services/geminiService';

interface DashboardProps {
  profile: UserProfile;
  docs: KnowledgeDoc[];
  goToChat: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, docs, goToChat }) => {
  const [dailyTip, setDailyTip] = useState<string>("Loading your personalized tip...");

  useEffect(() => {
    let mounted = true;
    generateHealthTip(profile, docs).then(tip => {
        if(mounted) setDailyTip(tip);
    });
    return () => { mounted = false; };
  }, [profile, docs]);

  const stats = [
    { label: 'Weight', value: `${profile.weight} kg`, icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Steps', value: '8,432', icon: Footprints, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Hydration', value: '1.2 L', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Sleep', value: '7h 20m', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Welcome & Tip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Hello, {profile.name} 👋</h1>
            <p className="text-teal-100 mb-6 font-light">Here is your daily personalized insight.</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="font-medium text-lg italic">"{dailyTip}"</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center">
           <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                <Activity className="w-8 h-8 text-teal-600" />
           </div>
           <h3 className="font-bold text-slate-800 text-lg">Health Score</h3>
           <p className="text-4xl font-bold text-slate-900 mt-2">84<span className="text-sm text-slate-400 font-normal">/100</span></p>
           <p className="text-xs text-green-600 mt-2 font-medium">+2% from last week</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
                <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:scale-105 transition-transform duration-200">
                    <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                    <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                </div>
            )
        })}
      </div>

      {/* Action Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-slate-500" />
                Recent Records
            </h3>
            <div className="space-y-3">
                {docs.slice(0, 3).map(doc => (
                    <div key={doc.id} className="flex items-center p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100 cursor-default">
                        <div className="w-2 h-2 rounded-full bg-teal-500 mr-3"></div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{doc.title}</p>
                            <p className="text-xs text-slate-400">{doc.category}</p>
                        </div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                            {new Date(doc.dateAdded).toLocaleDateString()}
                        </span>
                    </div>
                ))}
                {docs.length === 0 && <p className="text-sm text-slate-400 italic">No records added yet.</p>}
            </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 text-white flex flex-col justify-between">
            <div>
                <h3 className="font-bold text-lg mb-2">Have a question?</h3>
                <p className="text-slate-400 text-sm mb-6">Ask about your latest blood test results or get a recipe idea based on your diet plan.</p>
            </div>
            <button 
                onClick={goToChat}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 rounded-lg font-medium transition-colors flex items-center justify-center group"
            >
                Start Chat
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;