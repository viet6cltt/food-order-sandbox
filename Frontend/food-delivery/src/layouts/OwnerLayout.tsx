import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

const OwnerLayout: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => {
    return (
        <div>
            <Header />

            <div className={`min-h-screen bg-gray-100 ${className}`}>
                {children}
            </div>

            <Footer />
        </div>

    )
}

export default OwnerLayout;