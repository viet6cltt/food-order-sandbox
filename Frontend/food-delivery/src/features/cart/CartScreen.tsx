import AppLayout from "../../layouts/AppLayout"

const CartScreen: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <AppLayout className={className}>
            <div className="max-w-5xl mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold">Cart</h1>
            </div>
        </AppLayout>
    )
}

export default CartScreen;