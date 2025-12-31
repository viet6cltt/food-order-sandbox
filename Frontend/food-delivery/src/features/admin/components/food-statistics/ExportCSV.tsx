import React from 'react';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

interface Props {
    onExport: () => void;
    isLoading?: boolean;
}

const ExportCSV: React.FC<Props> = ({ onExport, isLoading = false }) => {
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
                <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
            )}
            {isLoading ? 'Đang tạo CSV...' : 'Xuất CSV'}
        </button>
    );
};

export default ExportCSV;