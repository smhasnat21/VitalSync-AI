import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { HealthMetric } from '../types';
import { INITIAL_WEIGHT_DATA, INITIAL_SLEEP_DATA } from '../constants';

const Tracker: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Health Tracker</h2>
        <p className="text-slate-500 mt-1">Visualize your progress over time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <div>
                 <h3 className="font-semibold text-slate-800">Weight Trend</h3>
                 <p className="text-xs text-slate-500">Last 7 Days (kg)</p>
            </div>
            <span className="text-2xl font-bold text-teal-600">76.9 <span className="text-sm font-normal text-slate-400">kg</span></span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={INITIAL_WEIGHT_DATA}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                    cursor={{stroke: '#cbd5e1', strokeWidth: 1}}
                />
                <Area type="monotone" dataKey="value" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sleep Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
             <div>
                 <h3 className="font-semibold text-slate-800">Sleep Quality</h3>
                 <p className="text-xs text-slate-500">Hours per night</p>
            </div>
            <span className="text-2xl font-bold text-indigo-600">8.5 <span className="text-sm font-normal text-slate-400">hrs</span></span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={INITIAL_SLEEP_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                     contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                     cursor={{stroke: '#cbd5e1', strokeWidth: 1}}
                />
                <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracker;