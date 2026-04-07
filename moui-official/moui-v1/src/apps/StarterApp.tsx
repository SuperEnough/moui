import React from 'react';
import { Selectable } from '../components/Workspace';
import { BarChart3, Users, DollarSign, Activity } from 'lucide-react';

export default function StarterApp() {
  return (
    <div className="p-8 text-white">
      <Selectable id="header" className="mb-8">
        <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
        <p className="text-white/50">Welcome back, Commander.</p>
      </Selectable>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Selectable id="stats-revenue" className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-full bg-blue-500/20 p-2 text-blue-400">
              <DollarSign size={20} />
            </div>
            <span className="text-xs font-bold text-green-400">+12%</span>
          </div>
          <div className="text-2xl font-bold">$42,850</div>
          <div className="text-xs text-white/40 uppercase tracking-wider mt-1">Total Revenue</div>
        </Selectable>

        <Selectable id="stats-users" className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-full bg-purple-500/20 p-2 text-purple-400">
              <Users size={20} />
            </div>
            <span className="text-xs font-bold text-green-400">+5%</span>
          </div>
          <div className="text-2xl font-bold">1,240</div>
          <div className="text-xs text-white/40 uppercase tracking-wider mt-1">Active Users</div>
        </Selectable>

        <Selectable id="stats-activity" className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-full bg-orange-500/20 p-2 text-orange-400">
              <Activity size={20} />
            </div>
            <span className="text-xs font-bold text-red-400">-2%</span>
          </div>
          <div className="text-2xl font-bold">85%</div>
          <div className="text-xs text-white/40 uppercase tracking-wider mt-1">System Load</div>
        </Selectable>

        <Selectable id="stats-conversions" className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-full bg-green-500/20 p-2 text-green-400">
              <BarChart3 size={20} />
            </div>
            <span className="text-xs font-bold text-green-400">+18%</span>
          </div>
          <div className="text-2xl font-bold">4.2%</div>
          <div className="text-xs text-white/40 uppercase tracking-wider mt-1">Conversion Rate</div>
        </Selectable>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Selectable id="main-chart" className="h-64 rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-md flex items-center justify-center">
            <span className="text-white/20 italic">Chart visualization placeholder</span>
        </Selectable>
        <Selectable id="recent-activity" className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-md">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/40 mb-4">Recent Activity</h3>
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-white/10"></div>
                        <div className="flex-1">
                            <div className="h-2 w-24 rounded bg-white/10 mb-2"></div>
                            <div className="h-2 w-16 rounded bg-white/5"></div>
                        </div>
                    </div>
                ))}
            </div>
        </Selectable>
      </div>
    </div>
  );
}
