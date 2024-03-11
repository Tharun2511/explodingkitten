import React, { useEffect, useState } from "react";
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
import { ClipLoader } from "react-spinners";

const Home = () => {
    const SERVER_API = process.env.REACT_APP_SERVER_API;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let loggedUser = useSelector((state) => state.userState.user);
    let prevGame = useSelector((state) => state.gameState.game);
    const [newGameLoading, setNewGameLoading] = useState(false);
    const [resumeGameLoading, setResumeGameLoading] = useState(false);

    const handleLogout = () => {
        dispatch(userLogout());
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleNewGame = async () => {
        setNewGameLoading(true);
        try {
            if (!loggedUser.prevGameCompleted) {
                await axios.put(`${SERVER_API}/api/game/lose`, {
                    userId: loggedUser._id,
                });
            }
            const { data } = await axios.post(`${SERVER_API}/api/game/new`, {
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
            toast.error(error.message);
        } finally {
            setNewGameLoading(false);
        }
    };

    const handleResumeGame = async () => {
        if (!loggedUser.prevGameCompleted) {
            setResumeGameLoading(true);
            try {
                const { data } = await axios.post(
                    `${SERVER_API}/api/game/resume`,
                    {
                        gameId: loggedUser.prevGame,
                    }
                );
                prevGame = {
                    ...data,
                };
                dispatch(setGame(prevGame));
                navigate("/playground");
            } catch (error) {
                console.log(error);
                toast.error("No Previous Game Found");
            } finally {
                setResumeGameLoading(false);
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
            dispatch(setUser(user));
        }
    }, []);

    return (
        <div className="homeBanner">
            <div className="h-[7vh] flex justify-end">
                <div className="auth_btn flex items-center gap-5">
                    <div onClick={handleLogout}>Logout</div>
                    <IoMdLogOut />
                </div>
            </div>
            <div className="flex justify-center items-center gap-10 py-5">
                <div className="w-1/3 h-[80vh] halloween-font text-9xl text-gray-900 text-center">
                    <div className="pointer-events-none">
                        {loggedUser.firstname}
                    </div>
                    <img
                        src={loggedUser.gender === "male" ? male : female}
                        alt="logo"
                        className="absolute bottom-0 left-1/6 translate-x-1/3 h-[450px] w-[270px] pointer-events-none"
                    />
                </div>
                <div className="w-1/3 flex flex-col justify-evenly items-center space-y-5">
                    <img
                        src={logo}
                        alt="logo"
                        className="w-[30vw] h-[50vh] pointer-events-none"
                    />
                    <div
                        className="btn1 w-auto h-[8vh] flex items-center justify-center"
                        onClick={handleNewGame}
                    >
                        New Game{" "}
                        {newGameLoading ? (
                            <ClipLoader
                                size={25}
                                color="black"
                                className="text-2xl ml-4"
                            />
                        ) : (
                            <GiFairyWand className="ml-4" />
                        )}
                    </div>
                    <div
                        className="btn2 w-auto h-[8vh] flex items-center justify-center"
                        onClick={handleResumeGame}
                    >
                        Resume Game{" "}
                        {resumeGameLoading ? (
                            <ClipLoader
                                size={25}
                                color="red"
                                className="ml-4"
                            />
                        ) : (
                            <GiAncientSword className="text-3xl ml-4" />
                        )}
                    </div>
                </div>
                <LeaderBoard />
            </div>
        </div>
    );
};

export default Home;
