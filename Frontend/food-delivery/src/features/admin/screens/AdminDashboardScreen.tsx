import AdminLayout from "../../../layouts/AdminLayout"

const AdminDashboardScreen: React.FC<{className?: string}> = ({className}) => {
    return (
        <AdminLayout className={className}>
            <div className={`flex ${className}`}>
                Edit from here
            </div>
        </AdminLayout>
    )
}

export default AdminDashboardScreen;