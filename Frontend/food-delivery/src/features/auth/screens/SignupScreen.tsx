import React from 'react';
import SignupForm from '../components/SignupForm';
import AuthLayout from '../../../layouts/AuthLayout';

const SignupScreen: React.FC = () => {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
};

export default SignupScreen;
