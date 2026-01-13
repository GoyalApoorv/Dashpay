import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('AuthCallback component mounted');
        const token = searchParams.get('token');
        console.log('Token from URL:', token);

        if (token) {
            console.log('Saving token to localStorage...');
            localStorage.setItem('token', token);
            console.log('Token saved, waiting before redirect...');

            // Small delay to ensure localStorage persists before navigation
            setTimeout(() => {
                console.log('Redirecting to dashboard');
                navigate('/dashboard');
            }, 100);
        } else {
            console.log('No token found, redirecting to signin');
            navigate('/signin');
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
        </div>
    );
};
