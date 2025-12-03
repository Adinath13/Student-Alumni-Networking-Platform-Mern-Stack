import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const DonationPage = () => {
    const { user } = useAuth();
    const [donations, setDonations] = useState([]);
    const [amount, setAmount] = useState('');
    const [purpose, setPurpose] = useState('General Fund');

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchDonations();
        }
    }, [user]);

    const fetchDonations = async () => {
        try {
            const { data } = await axios.get('/donations');
            setDonations(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDonate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/donations', { amount, purpose });
            alert('Thank you for your donation!');
            setAmount('');
        } catch (error) {
            console.error(error);
            alert('Error processing donation');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Donations</h1>

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Make a Donation</h2>
                <form onSubmit={handleDonate} className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount (INR)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Purpose</label>
                        <select
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        >
                            <option>General Fund</option>
                            <option>Scholarship</option>
                            <option>Infrastructure</option>
                            <option>Event Sponsorship</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Donate Now
                    </button>
                </form>
            </div>

            {user?.role === 'admin' && (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Donation History</h3>
                    </div>
                    <div className="border-t border-gray-200">
                        <ul className="divide-y divide-gray-200">
                            {donations.map((donation) => (
                                <li key={donation._id} className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-primary truncate">
                                            {donation.donor?.name}
                                        </p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                ₹{donation.amount}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                {donation.purpose}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationPage;
