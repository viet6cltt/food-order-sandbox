import React from "react";
import AuthLayout from "../../../layouts/AuthLayout";
import PasswordResetForm from "../components/PasswordResetForm";

const ResetPasswordScreen: React.FC = () => {
  return (
    <AuthLayout>
      <div className="py-20 px-4">
        <PasswordResetForm />
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordScreen;
