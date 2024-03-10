import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateCards } from "../store/game/gameSlice";
import {updateUser} from "../store/users/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const CardDeck = () => {
    const navigate = useNavigate();
    const game = useSelector((state) => state.gameState.game);
    const cards = useSelector((state) => state.gameState.game.cards);
    const dispatch = useDispatch();
    const [message, setMessage] = useState("Please pick a card");
    const [defuseCardCount, setDefuseCardCount] = useState(0);

    const handleClickCard = async (cardNumber) => {
        let currentCards = [...cards];
        const index = currentCards.findIndex(
            (card) => card.cardNumber === cardNumber
        );

        if (currentCards[index].name === "Cat") {
            currentCards.splice(index, 1);
            setMessage(
                "Good going! It's a cat card. Please pick another card."
            );
        } else if (currentCards[index].name === "Defuse") {
            setDefuseCardCount(defuseCardCount + 1);
            currentCards.splice(index, 1);
            setMessage(
                "Cheers! You got a defuser card. Please pick another card."
            );
        } else if (currentCards[index].name === "Shuffle") {
            const { data } = await axios.post("/api/game/shuffle", {
                gameId: game._id,
            });
            setMessage(
                "Oo noo! It's a shuffle card. You got a new set of cards."
            );
            currentCards = [...data];
            setDefuseCardCount(0);
        } else {
            if (defuseCardCount > 0) {
                setDefuseCardCount(defuseCardCount - 1);
                currentCards.splice(index, 1);
                setMessage(
                    "It's a Bomber kitten. Thankfully! you have a defuser backup. Please pick another card."
                );
            } else {
                setMessage(
                    "Oops! It's a Bomber kitten and exploded everything. You lost the game! You will be redirected shortly..."
                );
                try {
                    console.log(game.user);
                    await axios.put("/api/game/lose", {
                        userId: game.user,
                    });
                    dispatch(updateUser("loss"));
                } catch (error) {
                    toast.error("Failed to update status of game to loss");
                }
                setTimeout(() => {
                    navigate("/");
                }, 5000);
            }
        }

        if (currentCards.length === 0) {
            setMessage(
                "Hurrah! You won, congrats! You will be redirected shortly..."
            );
            try {
                console.log(game.user);
                await axios.put("/api/game/win", {
                    userId: game.user,
                });
                dispatch(updateUser("win"));
            } catch (error) {
                toast.error("Failed to status of game to win");
            }
            setTimeout(() => {
                navigate("/");
            }, 5000);
        }
        try {
            await axios.put("/api/game/updatecards", {
                gameId: game._id,
                cards: currentCards,
            });
        } catch (error) {
            toast.error("Failed to update cards");
        }

        dispatch(updateCards(currentCards));
    };

    useEffect(() => {}, [cards]);

    return (
        <div className="w-full h-full flex flex-col items-center ">
            <div className="w-full h-full flex justify-between items-center">
                <div className="w-1/2 h-full text-xl text-white">{message}</div>
                <div className="w-1/2 h-full text-xl text-white">
                    Card picked: {}
                </div>
            </div>
            <div className="card-list">
                {cards.map((card) => {
                    return (
                        <div
                            key={card.cardNumber}
                            className="card text-[100px] halloween-font cursor-pointer"
                        >
                            <div
                                className="h-full px-5 border-4 border-red-500 rounded-3xl"
                                onClick={() => handleClickCard(card.cardNumber)}
                            >
                                {card.cardNumber}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CardDeck;
