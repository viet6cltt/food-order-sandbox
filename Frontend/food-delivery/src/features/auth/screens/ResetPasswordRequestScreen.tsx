import React from "react";
import AuthLayout from "../../../layouts/AuthLayout";
import PasswordResetRequest from "../components/PasswordResetRequest";

const ResetPasswordRequestScreen: React.FC = () => {
  return (
    <AuthLayout>
      <div className="py-20 px-4">
        <PasswordResetRequest />
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordRequestScreen;
