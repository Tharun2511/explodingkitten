import React, { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import axios from "axios";
import { toastError } from "../helpers/Helper";

const LeaderBoard = () => {
    const SERVER_API = process.env.REACT_APP_SERVER_API;
    const [leaderBoard, setLeaderBoard] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaderBoard = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${SERVER_API}/api/leaderboard`, {
                headers: {
                    Authorization: `Bearer ${
                        JSON.parse(localStorage.getItem("user")).token
                    }`,
                },
            });
            setLeaderBoard([...data]);
            setLoading(false);
        } catch (error) {
            toastError(error.message);
        }
    };

    useEffect(() => {
        fetchLeaderBoard();
    }, []);

    return (
        <div className="w-1/3 h-[80vh] text-gray-200 backdrop-blur-3xl p-5 space-y-2 flex flex-col items-center rounded-3xl">
            <div className="w-full text-2xl border-b-2 border-red-500 pb-2 text-center">
                Leaderboard
            </div>
            <div className="w-full flex flex-col items-center overflow-y-auto scroll-smooth">
                <div
                    key={-1}
                    className="w-full h-full flex justify-around items-center text-red-500 text-lg py-2"
                >
                    <div className="w-1/6 text-center">Rank</div>
                    <div className="w-4/6 text-center">Name</div>
                    <div className="w-1/6 text-center">Wins</div>
                </div>
                {loading ? (
                    <div className="w-full h-full mt-24 flex justify-center items-center">
                        <ScaleLoader
                            color="red"
                            width={6}
                            height={50}
                            radius={5}
                        />
                    </div>
                ) : (
                    leaderBoard.map((user, index) => (
                        <div
                            key={user._id}
                            className="w-full h-full flex justify-around items-center py-2 border-t-[1px] border-red-500"
                        >
                            <div className="w-1/6 text-center">{`#${
                                index + 1
                            }`}</div>
                            <div className="w-4/6 text-center">
                                {user.firstname} {user.lastname}
                            </div>

                            <div className="w-1/6 text-center">
                                {user.numberOfWins}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LeaderBoard;
