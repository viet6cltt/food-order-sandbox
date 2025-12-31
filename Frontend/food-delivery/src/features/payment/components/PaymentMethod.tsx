import { useState } from "react";
import CheckboxButton from "../../../components/ui/CheckboxButton";

const PaymentMethod: React.FC<{className? : string}> = ({className = ''}) => {
    const [page, setPage] = useState(0);
    // store selected bank code (single select). null = none
    const [selectedBank, setSelectedBank] = useState<string | null>(null);
    const listBanks = [
        { code: 'VCB', AccountNumber: '*012', logoUrl: 'https://hienlaptop.com/wp-content/uploads/2024/12/logo-vietcombank-vector-13.png' },
        { code: 'TCB', AccountNumber: '*789', logoUrl: 'https://hienlaptop.com/wp-content/uploads/2024/12/logo-vietcombank-vector-13.png' },]

    const onSelectBank = (bankCode: string, checked: boolean) => {
        console.log('Selected bank:', bankCode, 'checked:', checked);
        if (checked) setSelectedBank(bankCode);
        else setSelectedBank(null);
    }

    return (
        <div className={`${className} bg-white`}>
            <div className="flex flex-row gap-4 border-b border-gray-300 p-4">
                <h2 className="p-4">Phương thức thanh toán</h2>
                <button
                    className={`p-2 m-2 border ${page === 0 ? 'border-emerald-600 text-emerald-600' : 'border-gray-300'} text-center hover:cursor-pointer hover:border-emerald-600 hover:text-emerald-600`}
                    onClick={() => setPage(0)}
                >
                    Thanh toán khi nhận hàng
                </button>
                <button
                    className={`p-2 m-2 border ${page === 1 ? 'border-emerald-600 text-emerald-600' : 'border-gray-300'} text-center hover:cursor-pointer hover:border-emerald-600 hover:text-emerald-600`}
                    onClick={() => setPage(1)}
                >
                    Thanh toán bằng ngân hàng
                </button>
            </div>
            <div className="mt-4">
                {page === 0 && (
                    <div className="p-6 mb-4 text-sm bg-white">
                        <p>Thanh toán khi nhận hàng - hãy thanh toán khi shipper giao hàng tới</p>
                    </div> 
                )}
                {page === 1 && (
                    <div>
                        {listBanks.map((bank) => (
                            <div key={bank.code} className="flex flex-row p-6 mb-4 bg-white items-center">
                                <div>
                                    <CheckboxButton checked={selectedBank === bank.code} onChange={(c) => onSelectBank(bank.code, c)} />
                                </div>
                                <div>
                                    <img src={bank.logoUrl} alt={bank.code} className="h-10 w-10 mx-4" />
                                </div>
                                <div>
                                    <div>
                                        <p className="font-medium">{bank.code}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">{bank.AccountNumber}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div> 
                )}
            </div>
        </div>
    );
};

export default PaymentMethod;