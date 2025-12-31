import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

const AdminLayout: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => {
    return (
        <>
            <Header />

            <div className={className}>{children}</div>
            
            <Footer />
        </>
    )
}

export default AdminLayout;