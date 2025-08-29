import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function AuthChecker({ children }) {
    const navigate = useNavigate();

    useEffect(() => {
        const checkUserStatus = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/signup");
                return;
            }

            try {

                await axios.get("http://localhost:3000/api/v1/user/me", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (error) {
                localStorage.removeItem("token"); 
                navigate("/signin"); 
            }
        };

        checkUserStatus();
    }, [navigate]); 
    return children;
}