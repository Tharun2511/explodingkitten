import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateCards } from "../store/game/gameSlice";
import { updateUser } from "../store/users/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const CardDeck = () => {
    const SERVER_API = process.env.REACT_APP_SERVER_API;
    const navigate = useNavigate();
    const loggedUser = useSelector((state) => state.userState.user);
    const game = useSelector((state) => state.gameState.game);
    const cards = useSelector((state) => state.gameState.game.cards);
    const dispatch = useDispatch();
    const [message, setMessage] = useState("Good Luck! Let's Play!");
    const [cardPicked, setCardPicked] = useState("Please pick a card.");
    const [defuseCardCount, setDefuseCardCount] = useState(0);
    const [gameStatus, setGameStatus] = useState("inProgress");

    const handleClickCard = async (cardNumber) => {
        let currentCards = [...cards];
        const index = currentCards.findIndex(
            (card) => card.cardNumber === cardNumber
        );

        setCardPicked(cards[index].name);

        if (currentCards[index].name === "Cat") {
            currentCards.splice(index, 1);
            setMessage(
                "Good going! It's a cat card. Please pick another card."
            );
            dispatch(updateCards(currentCards));
        } else if (currentCards[index].name === "Defuse") {
            setDefuseCardCount(defuseCardCount + 1);
            currentCards.splice(index, 1);
            setMessage(
                "Cheers! You got a defuser card. Please pick another card."
            );
            dispatch(updateCards(currentCards));
        } else if (currentCards[index].name === "Shuffle") {
            setMessage(
                "Oo noo! It's a shuffle card. You got a new set of cards."
            );
            const { data } = await axios.post(
                `${SERVER_API}/api/game/shuffle`,
                {
                    gameId: game._id,
                }
            );
            currentCards = [...data];
            setDefuseCardCount(0);
            dispatch(updateCards(currentCards));
        } else {
            if (defuseCardCount > 0) {
                setDefuseCardCount(defuseCardCount - 1);
                currentCards.splice(index, 1);
                setMessage(
                    "It's a Bomber kitten. Thankfully! you have a defuser backup. Please pick another card."
                );
                dispatch(updateCards(currentCards));
            } else {
                setMessage(
                    "Oops! It's a Bomber, You lost the game!"
                );
                setGameStatus("lose");
                currentCards = [];
                dispatch(updateCards(currentCards));
                try {
                    await axios.put(`${SERVER_API}/api/game/lose`, {
                        userId: game.user,
                    });
                    dispatch(
                        updateUser({
                            ...loggedUser,
                            prevGameCompleted: true,
                            numberOfGames: game.numberOfGames + 1,
                        })
                    );
                } catch (error) {
                    toast.error("Failed to update status of game to loss");
                }
                setTimeout(() => {
                    navigate("/");
                }, 3000);
                return;
            }
        }

        if (gameStatus === "inProgress" && currentCards.length === 0) {
            setMessage("Hurrah! You won, congrats!");
            setGameStatus("win");
            try {
                await axios.put(`${SERVER_API}/api/game/win`, {
                    userId: game.user,
                });
                dispatch(updateUser("win"));
            } catch (error) {
                toast.error("Failed to status of game to win");
            }
            setTimeout(() => {
                navigate("/");
            }, 3000);
            return;
        }
        try {
            await axios.put(`${SERVER_API}/api/game/updatecards`, {
                gameId: game._id,
                cards: currentCards,
            });
        } catch (error) {
            toast.error("Failed to update cards");
        }
    };

    useEffect(() => {}, [cards]);

    return (
        <div className="w-full h-full flex flex-col items-center ">
            <div className="w-full h-full flex items-center justify-between text-3xl text-gray-100 halloween-font">
                <div className="w-1/2 h-full p-3 space-y-3">
                    <div className="mb-10">
                        Number of Diffusers: {defuseCardCount}
                    </div>
                    <div className="text-black text-[40px]">Message:</div>
                    <div className="">{message}</div>
                </div>
                <div className="w-1/2 h-full text-black">
                    Card picked:{" "}
                    <div className="text-[60px] text-gray-200 pt-5">
                        {cardPicked}
                    </div>
                </div>
            </div>
            <div className="card-list relative">
                {cards.length > 0 ? (
                    cards.map((card) => {
                        return (
                            <div
                                key={card.cardNumber}
                                className="card text-[100px] halloween-font cursor-pointer"
                            >
                                <div
                                    className="h-full px-5 border-4 border-red-500 rounded-3xl"
                                    onClick={() =>
                                        handleClickCard(card.cardNumber)
                                    }
                                >
                                    {card.cardNumber}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="w-full h-full flex items-start justify-start text-gray-900 text-[200px] bg-black">
                        <div
                            className={`min-w-[500px] absolute bottom-[170px] left-[-200px] ${
                                gameStatus === "win"
                                    ? "halloween-green-font"
                                    : "halloween-font"
                            }`}
                        >
                            {gameStatus === "win" ? "You won!" : "You lost!"}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardDeck;
