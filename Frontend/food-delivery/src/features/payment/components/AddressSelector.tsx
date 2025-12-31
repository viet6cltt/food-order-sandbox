import { MapPinIcon } from "@heroicons/react/24/outline";

const AddressSelector: React.FC<{className? : string}> = ({className = ''}) => {

    {/* Auto select address from user's profile */}
    const username = "Lê Trung Hiếu";
    const phoneNumber = "0363439847";
    const userAddress = "Ktx Ngoại Ngữ, Phạm Văn Đồng, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội";

    const handleChangeAddress = () => {
        // Logic to handle address change
        console.log("Change address clicked");
        alert("Chức năng thay đổi địa chỉ đang được phát triển.");
    };

    return (
        <div className={`${className}`}>
            <div className="bg-white p-2">
                <div className="flex flex-row p-2 text-green-400 font-semibold text-lg">
                    <div>
                        <MapPinIcon className="h-6 w-6 inline-block mr-2" />
                    </div>
                    <h1 className="">Địa chỉ nhận hàng</h1>
                </div>
                <div className="flex flex-row p-2 justify-between items-center">
                    <div className="flex flex-row justify-start items-center gap-4">
                        <p className="font-medium">{username} - {phoneNumber}</p>
                        <p className="text-gray-600">{userAddress}</p>
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={handleChangeAddress}
                            className="text-emerald-600 font-medium hover:cursor-pointer">
                                Thay Đổi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddressSelector;