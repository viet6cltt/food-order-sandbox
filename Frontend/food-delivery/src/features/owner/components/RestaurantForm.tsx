import React, { useState } from 'react';

const RestaurantForm: React.FC<{ className?: string }> = ({ className = '' }) => {
    const name = useState('');
    const address = useState('');
    const category = useState('');

    return (
        <div className={className}>
            <form className="max-w-md mx-auto p-4 border border-gray-300 rounded-lg shadow-sm">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                    <input
                        type="text"
                        id="name"
                        placeholder='Enter the restaurant name'
                        value={name[0]}
                        onChange={(e) => name[1](e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                        type="text"
                        id="address"
                        placeholder='Enter the restaurant address'
                        value={address[0]}
                        onChange={(e) => address[1](e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                        type="text"
                        id="category"
                        placeholder='Enter the restaurant category'
                        value={category[0]}
                        onChange={(e) => category[1](e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </form>
        </div>
    )
}

export default RestaurantForm;