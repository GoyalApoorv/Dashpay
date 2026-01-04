import { useState } from 'react';
import axios from 'axios';

export const SendMoneyModal = ({ open, onClose, toUserId, toName }) => {
    const [amount, setAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleTransfer = async () => {
        setIsLoading(true);
        setError("");
        setSuccess("");
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/account/transfer`, {
                to: toUserId,
                amount: Number(amount)
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            setSuccess("Transfer successful!");
            setTimeout(() => {
                onClose(); // Close modal after a short delay
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
                <div className="flex flex-col space-y-1.5 p-6">
                    <h2 className="text-3xl font-bold text-center">Send Money</h2>
                </div>
                <div className="p-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                            <span className="text-2xl text-white">{toName[0]?.toUpperCase()}</span>
                        </div>
                        <h3 className="text-2xl font-semibold">{toName}</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Amount (in Rs)
                            </label>
                            <input
                                onChange={(e) => setAmount(e.target.value)}
                                type="number"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Enter amount"
                            />
                        </div>
                        <button onClick={handleTransfer} disabled={isLoading} className="justify-center rounded-md text-sm font-medium h-10 px-4 py-2 w-full bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-400">
                            {isLoading ? "Sending..." : "Initiate Transfer"}
                        </button>
                        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                        {success && <div className="text-green-500 text-sm text-center">{success}</div>}
                        <button onClick={onClose} className="mt-2 text-sm w-full text-gray-600 hover:underline">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};