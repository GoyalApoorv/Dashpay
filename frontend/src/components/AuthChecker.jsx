import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export function AuthChecker({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Skip auth check for signin and signup pages
        if (location.pathname === '/signin' || location.pathname === '/signup') {
            return;
        }

        const checkUserStatus = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/signup");
                    return;
                }

                try {
                    await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                } catch (error) {
                    localStorage.removeItem("token");
                    navigate("/signin");
                }
            } catch (storageError) {
                console.error("localStorage access blocked:", storageError);
                // If localStorage is blocked, just allow access
                // This is a workaround for browser security restrictions
            }
        };

        checkUserStatus();
    }, [navigate, location.pathname]);
    return children;
}