export const TransactionHistory = ({ transactions }) => {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="mt-6">
                <h3 className="font-bold text-lg">Recent Transactions</h3>
                <div className="mt-4 text-gray-500">No recent transactions.</div>
            </div>
        );
    }

    return (
        <div className="mt-6">
            <h3 className="font-bold text-lg">Recent Transactions</h3>
            <div className="mt-4 space-y-4">
                {transactions.map(tx => (
                    <div key={tx._id} className="flex justify-between items-center p-3 bg-white shadow rounded-lg">
                        <div>
                            <div className="font-semibold">
                                {tx.status === 'Sent' ? `Sent to ${tx.toFirstName} ${tx.toLastName}` : `Received from ${tx.toFirstName} ${tx.toLastName}`}
                            </div>
                            <div className="text-sm text-gray-500">
                                {new Date(tx.date).toLocaleString()}
                            </div>
                        </div>
                        <div className={`font-bold ${tx.status === 'Sent' ? 'text-red-500' : 'text-green-500'}`}>
                            {tx.status === 'Sent' ? '-' : '+'} Rs {tx.amount.toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};