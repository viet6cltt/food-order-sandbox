import AppLayout from "../../layouts/AppLayout";
import OwnerRegisterForm from "./components/OwnerRegisterForm";
import RestaurantForm from "./components/RestaurantForm";
import { useNavigate } from "react-router-dom";


const OwnerRegisterScreen: React.FC<{ className?: string }> = ({ className = '' }) => {

    const navigate = useNavigate();

    const handleSubmit = () => {
        alert('Submitted!');
        navigate('/');
    }

    return (
        <AppLayout>
            <div className={`min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-8 ${className}`}>
                <div className="flex flex-row space-x-8">
                    <div className="max-w-md p-2">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Owner Information</h2>
                        <OwnerRegisterForm className="mb-6" />
                    </div>

                    <div className="max-w-md p-2">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Restaurant Information</h2>
                        <RestaurantForm className="mb-6" />
                    </div>
                </div>
                <div>
                    <button
                        type="button"
                        className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        aria-label="Submit registration"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}

export default OwnerRegisterScreen;