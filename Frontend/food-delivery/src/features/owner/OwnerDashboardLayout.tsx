// src/features/owner/OwnerDashboardLayout.tsx
import React, { type ReactNode } from 'react';

interface OwnerDashboardLayoutProps {
    children: ReactNode;
}

const OwnerDashboardLayout: React.FC<OwnerDashboardLayoutProps> = ({ children }) => {
    return (
        // Layout tối thiểu để không bị crash
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            {children}
        </div>
    );
};

export default OwnerDashboardLayout;