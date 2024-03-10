import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { checkEmail } from "../helpers/authHelper";
import { BeatLoader } from "react-spinners";
import logo from "../assets/logo.png";

const Signup = () => {
    const navigate = useNavigate();
    let userDetails = {
        firstname: "",
        lastname: "",
        email: "",
        gender: "",
        dob: "",
        password: "",
    };
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userDetails.firstname) {
            toast.error("Firstname cannot be empty");
            return;
        } else if (userDetails.firstname.length < 3) {
            toast.error("Firstname must be atleast 3 characters");
            return;
        } else if (!userDetails.firstname.length > 8) {
            toast.error("Firstname cannot be more than 8 characters");
            return;
        } else if (!userDetails.lastname) {
            toast.error("Lastname cannot be empty");
            return;
        } else if (userDetails.lastname.length > 12) {
            toast.error("Lastname cannot be more than 12 characters");
            return;
        } else if (!userDetails.email) {
            toast.error("Email cannot be empty");
            return;
        } else if (!checkEmail(userDetails.email)) {
            toast.error("Enter a valid Email ID");
            return;
        } else if (!userDetails.gender) {
            toast.error("Please choose a gender");
        } else if (
            !userDetails.dob ||
            new Date(userDetails.dob) > new Date() ||
            new Date(userDetails.dob) < new Date("1900-01-01")
        ) {
            toast.error("Enter a valid Date of Birth");
        } else if (!userDetails.password) {
            toast.error("Password cannot be empty");
            return;
        } else if (userDetails.password.length < 6) {
            toast.error("Password must be atleast 6 characters");
            return;
        }

        userDetails = {
            ...userDetails,
            firstname:
                userDetails.firstname.trim().charAt(0).toUpperCase() +
                userDetails.firstname.trim().slice(1),
            lastname:
                userDetails.lastname.trim().charAt(0).toUpperCase() +
                userDetails.lastname.trim().slice(1),
        };

        try {
            setLoading(true);
            const { data } = await axios.post("/api/user/signup", userDetails);
            console.log(data);
            toast.success("Signup Successful");
            localStorage.setItem("user", JSON.stringify(data));
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
            <div className="min-w-[500px] h-auto backdrop-blur-3xl text-gray-200 mr-20 p-5 flex flex-col items-center justify-center rounded-2xl">
                <img src={logo} className="w-[200px] h-[130px]" />
                <form
                    className="flex flex-col justify-center items-center py-3 space-y-4 text-lg"
                    onSubmit={handleSubmit}
                >
                    <label className="text-4xl text-red-500 font-bol">
                        Signup
                    </label>
                    <div className="flex gap-5">
                        <input
                            placeholder="Enter Firstname"
                            type="text"
                            className="input_field w-[200px]"
                            onChange={(e) => {
                                userDetails.firstname = e.target.value;
                            }}
                        />
                        <input
                            placeholder="Enter Lastname"
                            type="text"
                            className="input_field w-[200px]"
                            onChange={(e) => {
                                userDetails.lastname = e.target.value;
                            }}
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="Enter Email"
                        className="input_field w-[420px]"
                        onChange={(e) => {
                            userDetails.email = e.target.value;
                        }}
                    />

                    <div className="flex gap-5">
                        <select
                            className="input_field w-[200px] bg-black"
                            onChange={(e) => {
                                userDetails.gender = e.target.value;
                            }}
                        >
                            <option
                                className="w-[200px] bg-transparent"
                                value={""}
                            >
                                Select gender
                            </option>
                            <option
                                className="w-[200px] bg-transparent"
                                value={"male"}
                            >
                                Male
                            </option>
                            <option value={"female"}>Female</option>
                        </select>
                        <input
                            type="date"
                            className="w-[200px] h-auto bg-transparent px-5 py-2 border-[1px] outline-none rounded-lg"
                            onChange={(e) => {
                                userDetails.dob = e.target.value;
                            }}
                        />
                    </div>
                    <input
                        type="password"
                        placeholder="Enter Password"
                        className="w-[420px] h-auto bg-transparent px-5 py-2 border-[1px] outline-none rounded-lg placeholder:text-gray-200"
                        onChange={(e) => {
                            userDetails.password = e.target.value;
                        }}
                    />
                    <button className="auth_btn w-[420px]" type="submit">
                        {loading ? (
                            <BeatLoader color="white" size={8} />
                        ) : (
                            "Submit"
                        )}
                    </button>
                </form>
                <div className="text-center">
                    <p>
                        Already have an account?{" "}
                        <span
                            className="text-red-500 underline cursor-pointer"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
