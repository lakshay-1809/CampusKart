import { useEffect } from 'react';

export const Toast = ({ message, type = 'success', onClose, show }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    const getToastStyles = () => {
        const baseStyles = "fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out";
        
        switch (type) {
            case 'success':
                return `${baseStyles} bg-green-500 text-white`;
            case 'error':
                return `${baseStyles} bg-red-500 text-white`;
            case 'warning':
                return `${baseStyles} bg-yellow-500 text-white`;
            case 'info':
                return `${baseStyles} bg-blue-500 text-white`;
            default:
                return `${baseStyles} bg-gray-500 text-white`;
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            case 'info':
                return 'ℹ️';
            default:
                return '📢';
        }
    };

    return (
        <div className={getToastStyles()}>
            <div className="flex items-center space-x-2">
                <span className="text-lg">{getIcon()}</span>
                <span className="font-medium">{message}</span>
                <button
                    onClick={onClose}
                    className="ml-4 text-white hover:text-gray-200 focus:outline-none"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default Toast;
