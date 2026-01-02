import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

type StepStatus = 'pending' | 'confirmed' | 'cooking' | 'delivering' | 'completed';

interface Props {
    currentStatus: StepStatus;
}

const STEPS = [
    { id: 'pending', label: 'Chờ xác nhận', time: '10:00' },
    { id: 'confirmed', label: 'Đã nhận', time: '10:05' },
    { id: 'cooking', label: 'Đang nấu', time: '10:15' },
    { id: 'delivering', label: 'Đang giao', time: '10:30' },
    { id: 'completed', label: 'Hoàn thành', time: '--:--' },
];

const OrderFlow: React.FC<Props> = ({ currentStatus }) => {
    // Tìm index của bước hiện tại để biết cái nào xanh, cái nào xám
    const currentIndex = STEPS.findIndex(s => s.id === currentStatus);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-6">Tiến trình đơn hàng</h3>

            <div className="relative flex items-center justify-between w-full">
                {/* Đường kẻ ngang background */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 transform -translate-y-1/2"></div>

                {/* Đường kẻ xanh (Progress) */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-green-500 -z-0 transform -translate-y-1/2 transition-all duration-500"
                    style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
                ></div>

                {STEPS.map((step, index) => {
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center">
                            <div
                                className={`
                                    w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                    ${isCompleted
                                        ? 'bg-green-600 border-green-600 text-white shadow-lg scale-110'
                                        : 'bg-white border-gray-300 text-gray-300'}
                                `}
                            >
                                {isCompleted ? (
                                    <CheckCircleIcon className="w-6 h-6" />
                                ) : (
                                    <span className="text-xs font-bold">{index + 1}</span>
                                )}
                            </div>

                            <div className="absolute top-10 flex flex-col items-center min-w-[100px]">
                                <span className={`text-xs font-bold mt-1 ${isCurrent ? 'text-green-700' : 'text-gray-500'}`}>
                                    {step.label}
                                </span>
                                {isCompleted && <span className="text-[10px] text-gray-400">{step.time}</span>}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Khoảng trống để chữ không bị che */}
            <div className="h-8"></div>
        </div>
    );
};

export default OrderFlow;