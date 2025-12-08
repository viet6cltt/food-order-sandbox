import AuthLayout from "../../../layouts/AuthLayout";
import ResetPasswordModal from "../components/ResetPasswordModal";

const ResetPasswordScreen: React.FC = () => {
    return (
        <AuthLayout>
            <ResetPasswordModal isOpen={true} onClose={() => {}} />
        </AuthLayout>
    )
}

export default ResetPasswordScreen;