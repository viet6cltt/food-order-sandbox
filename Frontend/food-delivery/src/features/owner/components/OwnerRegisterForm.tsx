import React, { useState } from 'react';

const OwnerRegisterForm: React.FC<{ className?: string }> = ({ className = '' }) => {
    const username = useState('');
    const email = useState('');
    const phone = useState('');

    return (
        <div className={className}>
            <form className="max-w-md mx-auto p-4 border border-gray-300 rounded-lg shadow-sm">
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder='Enter your name'
                        value={username[0]}
                        onChange={(e) => username[1](e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder='Enter your email'
                        value={email[0]}
                        onChange={(e) => email[1](e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                        type="tel"
                        id="phone"
                        placeholder='Enter your phone number'
                        value={phone[0]}
                        onChange={(e) => phone[1](e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </form>
        </div>
    )
}

export default OwnerRegisterForm;