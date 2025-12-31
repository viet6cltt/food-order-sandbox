const PlaceOrderButton: React.FC<{className? : string}> = ({className = ''}) => {
    const basePrice = 100000;
    const shippingFee = 15000;
    const totalPrice = basePrice + shippingFee;

    const fmt = (v: number) => v.toLocaleString('vi-VN') + '₫';

    const handleClickOrder = () => {
        // Xử lý đặt hàng ở đây
        alert('Chức năng này đang được phát triển!');
    }

    return (
        <div className={`${className} w-full bg-[#fffefb] p-4`}> 
            <div className="max-w-full mx-auto items-center sm:items-start justify-between gap-4">
                <div className="hidden sm:flex flex-col text-right mb-4 sm:mb-0 p-2 border-b border-dashed border-gray-300">
                    <div className="text-sm text-gray-600">
                        <div>Tổng tiền hàng</div>
                        <div className="font-medium">{fmt(basePrice)}</div>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                        <div>Tổng tiền phí vận chuyển</div>
                        <div className="font-medium">{fmt(shippingFee)}</div>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                        <div className="text-sm">Tổng thanh toán</div>
                        <div className="text-2xl text-green-600 font-semibold">{fmt(totalPrice)}</div>
                    </div>
                </div>

                <div className="flex flex-row p-2">
                    <div className="flex-1 text-xs text-gray-600">
                        <p>Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo <a href="#" className="text-blue-600 underline">Điều khoản</a></p>
                    </div>
                    <button 
                        onClick={handleClickOrder}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md shadow-md">
                        Đặt hàng
                    </button>
                    <div className="sm:hidden mt-3 w-full text-center text-sm text-gray-700">
                        <div className="font-medium">{fmt(totalPrice)}</div>
                    </div>
                </div>  
            </div>
        </div>
    );
};

export default PlaceOrderButton;