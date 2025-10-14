import { useState, useEffect } from "react";
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import { SendMoneyModal } from "../components/SendMoneyModal";
import axios from "axios";
import { TransactionHistory } from "../components/TransactionHistory";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [recipient, setRecipient] = useState({ id: "", name: "" });
    const [balance, setBalance] = useState("10,000");
    const [transactions, setTransactions] = useState([]);


    const fetchDashboardData = async () => {
        try {
            const token = "Bearer " + localStorage.getItem("token");
            
            // Fetch both balance and transactions at the same time
            const [balanceRes, transactionsRes] = await Promise.all([
                axios.get("http://localhost:3000/api/v1/account/balance", { headers: { Authorization: token } }),
                axios.get("http://localhost:3000/api/v1/account/transactions", { headers: { Authorization: token } })
            ]);
            
            setBalance(balanceRes.data.balance);
            setTransactions(transactionsRes.data.transactions);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleOpenSendModal = (user) => {
        setRecipient({ id: user.id, name: user.firstName });
        setIsSendModalOpen(true);
    };

    const handleCloseSendModal = () => {
        setIsSendModalOpen(false);
    };
    return <div>
        <Appbar />
        <div className="m-8">
            <Balance value={balance.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })} />
             <Users onSendMoney={handleOpenSendModal} />
             <TransactionHistory transactions={transactions} />
        </div>

        <SendMoneyModal 
                open={isSendModalOpen}
                onClose={handleCloseSendModal}
                toUserId={recipient.id}
                toName={recipient.name}
            />

    </div>
}