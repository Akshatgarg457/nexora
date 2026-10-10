import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { AuthResponse } from '../types';
import { Hexagon, Lock, Mail, AlertCircle, ArrowRight, Shield } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: AuthResponse) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@nexora.com');
  const [password, setPassword] = useState('Admin@Nexora2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem('nexora_token', response.accessToken);
      localStorage.setItem('nexora_user', JSON.stringify(response));
      onLoginSuccess(response);
      navigate('/app');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Authentication failed. Please check credentials.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-900/30">
            <Hexagon className="w-7 h-7 fill-indigo-600 text-white stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-extrabold font-heading text-slate-900">Sign In to Nexora</h2>
          <p className="text-xs text-slate-500">Enter credentials to access your enterprise workspace</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-900 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@nexora.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In with JWT'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Login Preset Buttons */}
        <div className="pt-4 border-t border-slate-200 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span>Quick Demo Accounts:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <button
              onClick={() => quickFill('admin@nexora.com', 'Admin@Nexora2026!')}
              className="p-2 bg-slate-900 text-white rounded-xl text-left hover:bg-slate-800 transition-colors"
            >
              <p className="font-bold text-white">ADMIN</p>
              <p className="text-slate-400 truncate">admin@nexora.com</p>
            </button>
            <button
              onClick={() => quickFill('alex.morgan@nexora.com', 'Password123!')}
              className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-left hover:bg-amber-100/50 transition-colors"
            >
              <p className="font-bold text-amber-800">MANAGER</p>
              <p className="text-slate-600 truncate">alex.morgan@nexora.com</p>
            </button>
            <button
              onClick={() => quickFill('sarah.chen@nexora.com', 'Password123!')}
              className="p-2 bg-blue-50 border border-blue-200 rounded-xl text-left hover:bg-blue-100/50 transition-colors"
            >
              <p className="font-bold text-blue-800">EMPLOYEE</p>
              <p className="text-slate-600 truncate">sarah.chen@nexora.com</p>
            </button>
            <button
              onClick={() => quickFill('david.vance@nexora.com', 'Password123!')}
              className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-left hover:bg-emerald-100/50 transition-colors"
            >
              <p className="font-bold text-emerald-800">INTERN</p>
              <p className="text-slate-600 truncate">david.vance@nexora.com</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
