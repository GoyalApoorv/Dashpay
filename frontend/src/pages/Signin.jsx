import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import axios from "axios"; // 2. Import axios

export const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false); // 3. Add loading state back
    const navigate = useNavigate();

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign in"} />
                    <SubHeading label={"Enter your credentials to access your account"} />
                    <InputBox placeholder="harkirat@gmail.com" onChange={e => setEmail(e.target.value)} label={"Email"} />
                    <InputBox placeholder="123456" onChange={e => setPassword(e.target.value)} label={"Password"} type="password" />
                    <div className="pt-4">
                        <Button
                            disabled={isLoading}
                            label={isLoading ? "Signing In..." : "Sign In"}
                            onClick={async () => {
                                setIsLoading(true);
                                try {
                                    // 4. Correct syntax and handle response
                                    const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
                                        username: email,
                                        password: password
                                    });
                                    // 5. Save token and navigate
                                    localStorage.setItem("token", response.data.token);
                                    navigate("/dashboard");
                                } catch (error) {
                                    alert("Incorrect credentials. Please try again.");
                                } finally {
                                    setIsLoading(false);
                                }
                            }}
                        />
                    </div>
                    <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
                </div>
            </div>
        </div>
    );
};