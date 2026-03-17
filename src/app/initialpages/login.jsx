import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../lib/redux/features/auth/thunks';
import { Companynameletters } from '../../globalvar/companydetails';

export default function Login() {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(loginUser({ email: form.email, password: form.password }));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--color-background-primary)] p-6 font-sans overflow-y-auto">
      <div className="text-center mb-6">
        <div className="flex justify-center gap-1 mb-2">
          {Companynameletters.map((letter, i) => (
            <span key={i} className="text-2xl font-black text-[var(--color-text-primary)]">
              {letter}
            </span>
          ))}
        </div>
      </div>

      <form onSubmit={handleAuthSubmit} className="space-y-4">
        {!isLogin && (
          <input 
            name="name" type="text" value={form.name} 
            onChange={(e) => setForm({...form, name: e.target.value})} 
            className="form-input" placeholder="Full Name" 
          />
        )}
        <input 
          name="email" type="email" value={form.email} 
          onChange={(e) => setForm({...form, email: e.target.value})} 
          className="form-input" placeholder="Email" 
        />
        <input 
          name="password" type="password" value={form.password} 
          onChange={(e) => setForm({...form, password: e.target.value})} 
          className="form-input" placeholder="Password" 
        />
        
        {error && <p className="text-xs text-[var(--color-danger)] italic">{error}</p>}
        
        <button type="submit" className="form-button w-full py-3 active:scale-95">
          {isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>
      
      <button 
        onClick={() => setIsLogin(!isLogin)}
        className="mt-4 text-xs text-[var(--color-text-secondary)] hover:underline"
      >
        {isLogin ? "Need an account? Sign Up" : "Already have an account? Log In"}
      </button>
    </div>
  );
}