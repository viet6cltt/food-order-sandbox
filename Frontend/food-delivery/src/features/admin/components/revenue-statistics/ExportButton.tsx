import React from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface Props {
    onExport: () => void;
    isLoading?: boolean;
}

const ExportButton: React.FC<Props> = ({ onExport, isLoading = false }) => {
    return (
        <button
            onClick={onExport}
            disabled={isLoading}
            className={`
                flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-bold shadow-sm transition-all
                hover:bg-green-700 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
            `}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
                <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            )}
            {isLoading ? 'Đang xuất...' : 'Xuất Báo Cáo'}
        </button>
    );
};

export default ExportButton;