import AppLayout from "../../layouts/AppLayout";
import AddressSelector from "./components/AddressSelector";
import PaymentMethod from "./components/PaymentMethod";
import PlaceOrderButton from "./components/PlaceOrderButton";

const PaymentScreen: React.FC = () => {
    return (
        <AppLayout>
            <div className="flex flex-col min-h-screen justify-center items-center bg-color-gray-100">
                <header className="font-bold text-xl bg-white w-full p-4 mb-2">
                    <div className="items-center justify-center flex">
                        <h1>Thanh toán đơn hàng</h1>
                    </div>
                </header>
                <main className="flex-grow w-full max-w-7xl p-2">
                    <section className="mb-6">
                        <AddressSelector />
                    </section>
                    <section>
                        <PaymentMethod />
                    </section>
                    <section>
                        <PlaceOrderButton />
                    </section>
                </main>
            </div>
        </AppLayout>
    )
}

export default PaymentScreen;