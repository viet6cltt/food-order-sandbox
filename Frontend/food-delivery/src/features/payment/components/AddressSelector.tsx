import React, { useEffect, useState } from 'react';
import { MapPinIcon } from "@heroicons/react/24/outline";
import { getMe } from '../../profile/api';
import type { UserResponse } from '../../profile/api';
import ChangeAddressForm from './ChangeAddressForm';

interface AddressSelectorProps {
    className?: string;
    deliveryAddress: { full: string; lat: number; lng: number } | null;
    onAddressChange?: (address: { full: string; lat: number; lng: number }) => void;
    onRequestChange?: () => void;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({ className = '', deliveryAddress, onAddressChange, onRequestChange }) => {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [showChangeForm, setShowChangeForm] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await getMe();
                setUser(userData);
            } catch (err) {
                console.error('Failed to load user:', err);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const handleChangeAddress = () => {
        if (onRequestChange) {
            onRequestChange();
        } else {
            setShowChangeForm(true);
        }
    };

    const handleAddressChangeSuccess = (address: { full: string; lat: number; lng: number }) => {
        if (onAddressChange) {
            onAddressChange(address);
        }
    };

    const displayAddress = deliveryAddress?.full || 
                          (user?.address ? `${user.address.street || ''}${user.address.city ? `, ${user.address.city}` : ''}`.trim() : '');
    
    const fullName = user ? 
        (user.firstname || user.lastname ? `${user.firstname || ''} ${user.lastname || ''}`.trim() : user.username) :
        '';
    
    const phoneNumber = user?.phone || '';

    if (loading) {
        return (
            <div className={`${className}`}>
                <div className="bg-white p-2">
                    <div className="p-4 text-center text-gray-500">
                        Đang tải thông tin...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={`${className}`}>
                <div className="bg-white p-2">
                    <div className="flex flex-row p-2 text-green-400 font-semibold text-lg">
                        <div>
                            <MapPinIcon className="h-6 w-6 inline-block mr-2" />
                        </div>
                        <h1 className="">Địa chỉ nhận hàng</h1>
                    </div>
                    <div className="flex flex-row p-2 justify-between items-center">
                        <div className="flex flex-row justify-start items-center gap-4 flex-wrap">
                            {fullName && phoneNumber && (
                                <p className="font-medium">{fullName}  {phoneNumber}</p>
                            )}
                            {displayAddress ? (
                                <p className="text-gray-600">{displayAddress}</p>
                            ) : (
                                <p className="text-gray-400 italic">Chưa có địa chỉ</p>
                            )}
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={handleChangeAddress}
                                className="text-emerald-600 font-medium hover:cursor-pointer hover:text-emerald-700 transition">
                                    Thay Đổi
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showChangeForm && (
                <ChangeAddressForm
                    currentAddress={deliveryAddress}
                    onClose={() => setShowChangeForm(false)}
                    onSuccess={handleAddressChangeSuccess}
                />
            )}
        </>
    );
};

export default AddressSelector;