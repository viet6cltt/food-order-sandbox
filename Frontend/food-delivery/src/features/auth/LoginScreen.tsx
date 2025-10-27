import React from 'react';
import LoginForm from './components/LoginForm';
import AuthLayout from '../../layouts/AuthLayout';

const LoginScreen: React.FC = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginScreen;
