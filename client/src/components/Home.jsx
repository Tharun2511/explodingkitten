import React, { useEffect } from "react";
import { IoMdLogOut } from "react-icons/io";
import { GiFairyWand } from "react-icons/gi";
import { GiAncientSword } from "react-icons/gi";
import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { setUser, userLogout } from "../store/users/userSlice";
import { useNavigate } from "react-router-dom";
import male from "../assets/male.png";
import female from "../assets/female.png";
import axios from "axios";
import { toast } from "react-hot-toast";
import { setGame } from "../store/game/gameSlice";
import LeaderBoard from "./LeaderBoard";

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let loggedUser = useSelector((state) => state.userState.user);
    let prevGame = useSelector((state) => state.gameState.game);

    const handleLogout = () => {
        dispatch(userLogout());
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleNewGame = async () => {
        console.log(loggedUser);
        try {
            if (!loggedUser.prevGameCompleted) {
                console.log("Previous Game executing");
                await axios.put("/api/game/endprevgame", {
                    gameId: loggedUser.prevGame,
                });
            }
            console.log("Previous Game Ended");
            const { data } = await axios.post("/api/game/new", {
                userId: loggedUser._id,
            });

            prevGame = {
                ...data,
            };
            dispatch(setGame(prevGame));
            loggedUser = {
                ...loggedUser,
                prevGame: prevGame._id,
                prevGameCompleted: false,
            };
            dispatch(setUser(loggedUser));
            localStorage.setItem("user", JSON.stringify(loggedUser));
            navigate("/playground");
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.messgae);
        }
    };

    const handleResumeGame = async () => {
        if (!loggedUser.prevGameCompleted) {
            try {
                const { data } = await axios.post("/api/game/resume", {
                    gameId: loggedUser.prevGame,
                });
                prevGame = {
                    ...data,
                };
                dispatch(setGame(prevGame));
                navigate("/playground");
            } catch (error) {
                console.log(error);
                toast.error("No Previous Game Found");
            }
        } else {
            toast.error("No Previous Game Found");
        }
    };

    useEffect(() => {
        if (!localStorage.getItem("user")) {
            navigate("/login");
        } else {
            const user = JSON.parse(localStorage.getItem("user"));
            console.log(user);
            dispatch(setUser(user));
        }
    }, []);

    return (
        <div className="homeBanner w-full h-screen p-3 relative">
            <div className="flex justify-end m-3">
                <div className="auth_btn flex items-center gap-5">
                    <div onClick={handleLogout}>Logout</div>
                    <IoMdLogOut />
                </div>
            </div>
            <div className="flex justify-center items-center gap-10 py-5">
                <div className="w-1/3 h-[450px] halloween-font text-9xl text-gray-900 text-center">
                    <div className="pointer-events-none">
                        {loggedUser.firstname}
                    </div>
                    <img
                        src={loggedUser.gender === "male" ? male : female}
                        alt="logo"
                        className="absolute bottom-0 left-1/6 translate-x-1/3 h-[400px] w-[250px] pointer-events-none"
                    />
                </div>
                <div className="w-1/3 flex flex-col justify-evenly items-center space-y-5">
                    <img
                        src={logo}
                        alt="logo"
                        className="w-[400px] h-[300px] pointer-events-none"
                    />
                    <div
                        className="btn1 w-auto h-14 flex items-center justify-center"
                        onClick={handleNewGame}
                    >
                        New Game <GiFairyWand className="text-2xl ml-4" />
                    </div>
                    <div
                        className="btn2 w-auto h-14 flex items-center justify-center"
                        onClick={handleResumeGame}
                    >
                        Resume Game <GiAncientSword className="text-3xl ml-4" />
                    </div>
                </div>
                <LeaderBoard />
            </div>
        </div>
    );
};

export default Home;
