"use client";

import { useEffect, useState } from "react";

type Position = {
    x: number;
    y: number;
};

const boardSize = 20;

export default function Game() {

    const [snake, setSnake] = useState<Position[]>([
        { x: 10, y: 10 }
    ]);

    const [food, setFood] = useState<Position>({
        x: 5,
        y: 5
    });

    const [direction, setDirection] = useState<Position>({
        x: 1,
        y: 0
    });

    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {

        if (!gameStarted || gameOver) {
            return;
        }

        const interval = setInterval(() => {

            setSnake((currentSnake) => {

                const head = currentSnake[0];

                const newHead = {
                    x: head.x + direction.x,
                    y: head.y + direction.y
                };

                if (
                    newHead.x < 0 ||
                    newHead.x >= boardSize ||
                    newHead.y < 0 ||
                    newHead.y >= boardSize
                ) {
                    setGameOver(true);
                    return currentSnake;
                }

                const newSnake = [newHead, ...currentSnake];

                if (
                    newHead.x === food.x &&
                    newHead.y === food.y
                ) {
                    setFood({
                        x: Math.floor(Math.random() * boardSize),
                        y: Math.floor(Math.random() * boardSize)
                    });
                } else {
                    newSnake.pop();
                }

                return newSnake;
            });

        }, 150);

        return () => clearInterval(interval);

    }, [gameStarted, gameOver, direction, food]);


    useEffect(() => {

        function handleKeyDown(event: KeyboardEvent) {

            if (event.key === "ArrowUp") {
                setDirection({ x: 0, y: -1 });
            }

            if (event.key === "ArrowDown") {
                setDirection({ x: 0, y: 1 });
            }

            if (event.key === "ArrowLeft") {
                setDirection({ x: -1, y: 0 });
            }

            if (event.key === "ArrowRight") {
                setDirection({ x: 1, y: 0 });
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };

    }, []);


    function startGame() {

        setSnake([{ x: 10, y: 10 }]);
        setFood({ x: 5, y: 5 });
        setDirection({ x: 1, y: 0 });
        setGameOver(false);
        setGameStarted(true);
    }


    return (
        <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">

            <h1 className="text-4xl font-bold text-white mb-6">
                Snake Game
            </h1>

            <div
                className="bg-black border-4 border-green-500 grid"
                style={{
                    width: "400px",
                    height: "400px",
                    gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
                    gridTemplateRows: `repeat(${boardSize}, 1fr)`
                }}
            >

                {Array.from({ length: boardSize * boardSize }).map((_, index) => {

                    const x = index % boardSize;
                    const y = Math.floor(index / boardSize);

                    const isSnake = snake.some(
                        part => part.x === x && part.y === y
                    );

                    const isFood = food.x === x && food.y === y;

                    return (
                        <div
                            key={index}
                            className={`
                                border border-gray-800
                                ${isSnake ? "bg-green-500" : ""}
                                ${isFood ? "bg-red-500 rounded-full" : ""}
                            `}
                        />
                    );
                })}

            </div>

            {gameOver && (
                <p className="text-red-500 text-2xl font-bold mt-5">
                    Game Over
                </p>
            )}

            <button
                onClick={startGame}
                className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
                {gameOver ? "Restart Game" : "Start Game"}
            </button>

            <p className="text-white mt-4">
                Use Arrow Keys ↑ ↓ ← →
            </p>

        </main>
    );
}