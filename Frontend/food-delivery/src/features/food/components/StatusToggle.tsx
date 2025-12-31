/**
 * Component nút gạt trạng thái (Toggle Switch).
 * @component
 * @param {boolean} isActive - Trạng thái hiện tại (true: Còn bán, false: Tạm ẩn)
 * @param {function} onToggle - Hàm callback khi click vào nút
 */
import React from 'react';

interface StatusToggleProps {
    isActive: boolean;
    onToggle: (newState: boolean) => void;
}

const StatusToggle: React.FC<StatusToggleProps> = ({ isActive, onToggle }) => {
    return (
        <div className="flex items-center space-x-3">
            <span className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                {isActive ? 'Đang bán' : 'Tạm ẩn'}
            </span>
            <button
                type="button"
                onClick={() => onToggle(!isActive)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isActive ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                role="switch"
                aria-checked={isActive}
            >
                <span className="sr-only">Use setting</span>
                <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-5' : 'translate-x-0'
                        }`}
                />
            </button>
        </div>
    );
};

export default StatusToggle;