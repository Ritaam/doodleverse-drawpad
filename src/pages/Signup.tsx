
import React from 'react';
import { AuthForm } from '@/components/AuthForm';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Signup = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <h1 className="text-3xl font-light tracking-tight text-center mb-6">
        <span className="font-medium">White</span>board
      </h1>
      <AuthForm isLogin={false} />
    </div>
  );
};

export default Signup;
