export const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-indigo-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 8l3 5m0 0l3-5m-3 5v4m0-4H6m6 0h6M6 8a2 2 0 100-4 2 2 0 000 4zm12 0a2 2 0 100-4 2 2 0 000 4z"
        />
      </svg>
      <span className="font-bold text-xl text-gray-800">
        DashPay
      </span>
    </div>
  );
};