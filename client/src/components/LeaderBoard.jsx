import React, { useEffect, useState } from "react";
import axios from "axios";

const LeaderBoard = () => {
    const [leaderBoard, setLeaderBoard] = useState([]);

    const fetchLeaderBoard = async () => {
        try {
            
            const { data } = await axios.get("/api/leaderboard");
            setLeaderBoard(data);
        } catch (error) {
            console.log(error);
        }
    };
    
    useEffect(() => {
        fetchLeaderBoard();
    }, []);

    return (
        <div className="w-1/3 h-[450px] text-gray-200 backdrop-blur-3xl p-5 space-y-2 flex flex-col items-center rounded-3xl">
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
                {leaderBoard.map((user, index) => (
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
                ))}
            </div>
        </div>
    );
};

export default LeaderBoard;
