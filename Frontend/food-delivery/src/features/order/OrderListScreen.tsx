import type React from "react";
import { useState } from "react";
import AppLayout from "../../layouts/AppLayout";

const OrderListScreen: React.FC<{className? : string}> = ({className = ''}) => {
    const [page, setPage] = useState("");

    return (
        <AppLayout>
            <div className={`${className} bg-color-gray-100 min-h-screen mt-4 p-4`}>
                <div className="flex justify-center">
                    <div className="flex flex-row w-full max-w-7xl justify-between items-center bg-white p-4 mb-4">
                        <button 
                            className={`p-2 hover:text-emerald-600 ${page === "all" ? "border-b-2 border-emerald-600 text-emerald-600" : ""}`}
                            onClick={() => setPage("all")}>
                            Tất cả
                        </button>
                        <button 
                            className={`p-2 hover:text-emerald-600 ${page === "shipping" ? "border-b-2 border-emerald-600 text-emerald-600" : ""}`}
                            onClick={() => setPage("shipping")}>
                            Đang vận chuyển
                        </button>
                        <button 
                            className={`p-2 hover:text-emerald-600 ${page === "completed" ? "border-b-2 border-emerald-600 text-emerald-600" : ""}`}
                            onClick={() => setPage("completed")}>
                            Đã hoàn thành
                        </button>
                        <button 
                            className={`p-2 hover:text-emerald-600 ${page === "canceled" ? "border-b-2 border-emerald-600 text-emerald-600" : ""}`}
                            onClick={() => setPage("canceled")}>
                            Đã hủy
                        </button>
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="w-full max-w-7xl justify-between items-center bg-white p-4 mb-4">
                        {page === "all" && <div>Hiển thị tất cả đơn hàng</div>}
                        {page === "shipping" && <div>Hiển thị đơn hàng đang vận chuyển</div>}
                        {page === "completed" && <div>Hiển thị đơn hàng đã hoàn thành</div>}
                        {page === "canceled" && <div>Hiển thị đơn hàng đã hủy</div>}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default OrderListScreen;