import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

export const Appbar = () => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem("token");
        navigate("/signin");
    };

    return <div className="shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center h-full ml-4">
            PayTM App
        </div>
        <div className="flex">
            <div className="flex flex-col justify-center h-full mr-6 pt-2 ">
                 <Button label={"Sign Out"} onClick={handleSignOut} />
            </div>
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    U
                </div>
            </div>
        </div>
    </div>
}