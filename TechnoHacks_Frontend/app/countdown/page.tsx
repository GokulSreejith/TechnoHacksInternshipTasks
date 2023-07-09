"use client"
import { useEffect, useState } from 'react';

const CountdownTimer: React.FC = () => {
    const [sessionLength, setSessionLength] = useState<number>(25);
    const [breakLength, setBreakLength] = useState<number>(5);
    const [timeRemaining, setTimeRemaining] = useState<number>(sessionLength * 60);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [timerType, setTimerType] = useState<string>('Session');

    useEffect(() => {
        let countdown: NodeJS.Timeout;

        if (isRunning) {
            countdown = setInterval(() => {
                setTimeRemaining((prevTime) => {
                    if (prevTime === 0) {
                        if (timerType === 'Session') {
                            setTimerType('Break');
                            return breakLength * 60;
                        } else {
                            setTimerType('Session');
                            return sessionLength * 60;
                        }
                    } else {
                        return prevTime - 1;
                    }
                });
            }, 1000);
        }

        return () => {
            clearInterval(countdown);
        };
    }, [isRunning, sessionLength, breakLength, timerType]);


    const startTimer = () => {
        setIsRunning(true);
        setTimerType('Countdown');
    };

    const stopTimer = () => {
        setIsRunning(false);
        setTimerType('Session');
    };

    const resetTimer = () => {
        stopTimer();
        setSessionLength(25);
        setBreakLength(5);
        setTimeRemaining(25 * 60);
        setTimerType('Session');
    };

    return (
        <>
            <div className="counter-container">
                <div className="container mx-auto">
                    <h1 className="text-4xl font-extrabold text-center text-primary-color mb-16">COUNT DOWN</h1>
                    <div className="flex justify-between">
                        <div className="w-1/2">
                            <div className="text-center">
                                <p className="text-2xl font-semibold text-primary-color text-center">Session Length</p>
                            </div>
                            <div className="flex items-center justify-center space-x-4 mt-2">
                                <button
                                    className={`bg-primary-color hover:primary-color text-white font-bold py-1/5 px-2 rounded ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => {
                                        setSessionLength((prev) => Math.max(prev - 1, 1));
                                        if (sessionLength != 1) {
                                            setTimeRemaining((sessionLength - 1) * 60);
                                        }
                                    }}
                                    disabled={isRunning}
                                >
                                    -
                                </button>
                                <div className="text-2xl">{sessionLength}</div>
                                <button
                                    className={`bg-primary-color hover:primary-color text-white font-bold py-1/5 px-2 rounded ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => { setSessionLength((prev) => prev + 1); setTimeRemaining((sessionLength + 1) * 60); }}
                                    disabled={isRunning}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="w-1/2">
                            <div className="text-center">
                                <p className="text-2xl font-semibold text-primary-color text-center">Break Length</p>
                            </div>
                            <div className="flex items-center justify-center space-x-4 mt-2">
                                <button
                                    className={`bg-primary-color hover:primary-color text-white font-bold py-1/5 px-2 rounded ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => setBreakLength((prev) => Math.max(prev - 1, 1))}
                                    disabled={isRunning}
                                >
                                    -
                                </button>
                                <div className="text-2xl">{breakLength}</div>
                                <button
                                    className={`bg-primary-color hover:primary-color text-white font-bold py-1/5 px-2 rounded ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => setBreakLength((prev) => prev + 1)}
                                    disabled={isRunning}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <div className="text-4xl font-semibold text-primary-color text-center">{timerType}</div>
                        <div className={`text-6xl font-extrabold mt-4 text-transparent bg-clip-text bg-gradient-to-tr from-violet-500 to-pink-500 ${!isRunning ? 'mt-6 animate-bounce' : ''}`}>
                            {Math.floor(timeRemaining / 60)
                                .toString()
                                .padStart(2, '0')}
                            :
                            {(timeRemaining % 60).toString().padStart(2, '0')}

                        </div>
                    </div>

                    <div className="flex justify-center mt-8">
                        <button
                            className={`bg-primary-color hover:primary-color text-white font-bold py-2 px-4 rounded mr-2 ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={startTimer}
                            disabled={isRunning}
                        >
                            Start
                        </button>
                        <button
                            className={`bg-primary-color hover:primary-color text-white font-bold py-2 px-4 rounded mr-2 ${!isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={stopTimer}
                            disabled={!isRunning}
                        >
                            Stop
                        </button>
                        <button
                            className={`bg-primary-color hover:primary-color text-white font-bold py-2 px-4 rounded ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={resetTimer}
                            disabled={isRunning}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CountdownTimer;
