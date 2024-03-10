import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";
import { checkEmail } from "../helpers/authHelper";
import { BeatLoader } from "react-spinners";
import logo from "../assets/logo.png";

const Login = () => {
    const SERVER_API = process.env.REACT_APP_SERVER_API;
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Enter Email and Password");
            return;
        } else if (!checkEmail(email)) {
            toast.error("Invalid Email");
            return;
        } else if (!password) {
            toast.error("Enter Password");
            return;
        } else if (password.length < 6) {
            toast.error("Password must be atleast 6 characters");
            return;
        }

        try {
            setLoading(true);
            const {data} = await axios.post(`${SERVER_API}/api/user/login`, {
                email,
                password,
            });
            localStorage.setItem("user", JSON.stringify(data));
            toast.success("Login Successful");
            navigate("/");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("user")) {
            navigate("/");
        }
    }, []);

    return (
        <div className="authBanner w-full h-screen p-3 font-nor flex items-center justify-end">
            <div className="w-[400px] h-auto backdrop-blur-3xl text-gray-200 mr-20 p-5 flex flex-col items-center rounded-2xl">
                <img src={logo} alt="logo" className="h-[130px] w-[200px]" />
                <form
                    className="flex flex-col justify-center items-center py-3 space-y-5 text-lg"
                    onSubmit={handleSubmit}
                >
                    <label className="text-4xl text-red-500 font-bol">
                        Login
                    </label>
                    <input
                        placeholder="Enter Email..."
                        type="text"
                        className="input_field w-[300px]"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        placeholder="Enter Password..."
                        type="password"
                        className="input_field w-[300px]"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="auth_btn w-[300px]" type="submit">
                        {loading ? <BeatLoader color="white" size={8}/> : "Submit"}
                    </button>
                </form>
                <div className="w-full border-b-[1px] border-gray-200 pt-2 relative">
                    <span className="px-2 top-[-2px] right-1/2 translate-x-1/2 bg-[#3e4b54] text-gray-200 absolute rounded-full">
                        OR
                    </span>
                </div>
                <div className="flex flex-col justify-center items-center my-3 space-y-3 text-xl">
                    <p>Login using:</p>
                    <div className="p-2 bg-red-500 text-gray-200 hover:bg-red-700 rounded-full cursor-pointer">
                        <FaGoogle />
                    </div>
                </div>
                <div className="text-center">
                    <p>
                        Don&apos;t have an account?{" "}
                        <span
                            className="text-red-500 underline cursor-pointer"
                            onClick={() => navigate("/signup")}
                        >
                            SignUp
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
