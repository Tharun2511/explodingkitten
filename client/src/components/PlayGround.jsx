import React, { useEffect } from "react";
import { IoCaretForward } from "react-icons/io5";
import logo from "../assets/logo.png";
import CardDeck from "./CardDeck";
import { useSelector } from "react-redux";
const { useNavigate } = require("react-router-dom");

const PlayGround = () => {
    const navigate = useNavigate();
    const game = useSelector((state) => state.gameState.game);

    useEffect(() => {
        if (!game._id) {
            navigate("/");
        }
    }, []);

    return (
        <div className="homeBanner w-full h-screen p-3 overflow-hidden">
            <div className="flex justify-end m-3">
                <div
                    className="auth_btn flex items-center gap-5"
                    onClick={() => navigate("/")}
                >
                    <div>Back</div>
                    <IoCaretForward />
                </div>
            </div>
            <div className="h-full flex justify-start items-center gap-10 py-3">
                <div className="w-1/3 h-full flex flex-col items-center space-y-5">
                    <img
                        src={logo}
                        alt="logo"
                        className="w-5/6 h-[45%] pointer-events-none"
                    />
                    <div className="h-[40%] backdrop-blur-3xl p-3 space-y-2 text-gray-200 shadow-2xl shadow-gray-900 rounded-2xl overflow-scroll">
                        <h2 className="text-3xl text-gray-900 halloween-font">Rules: </h2>
                        <p>1. Every time player will be dealt 5 cards.</p>
                        <p>2. There are four types of cards.</p>
                        <p>
                            3. If the card drawn from the deck is a cat card,
                            then the card is removed from the deck.
                        </p>
                        <p>
                            4. If the card is exploding kitten (bomb) then the
                            player loses the game.
                        </p>
                        <p>
                            5. If the card is a defusing card, then the card is
                            removed from the deck. This card can be used to
                            defuse one bomb that may come in subsequent cards
                            drawn from the deck.
                        </p>
                        <p>
                            6. If the card is a shuffle card, then the game is
                            restarted and the deck is filled with 5 cards again.
                        </p>
                    </div>
                </div>
                <div className="w-2/3 h-full px-3 relative">
                    <div className="w-full h-[700px] absolute top-0 right-[40px]">
                        <CardDeck />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayGround;
