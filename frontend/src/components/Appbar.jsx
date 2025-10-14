import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { Logo } from "./Logo";

export const Appbar = ({ user }) => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem("token");
        navigate("/signin");
    };

    return <div className="shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center h-full ml-4">
            <Logo />
        </div>
        <div className="flex">
            <div className="flex flex-col justify-center h-full mr-6 pt-2 ">
                 <Button label={"Sign Out"} onClick={handleSignOut} />
            </div>
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-4">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user.firstName ? user.firstName[0] : "U"}
                </div>
            </div>
        </div>
    </div>
}