"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function Cronometro() {
  const params = useParams();
  const routeName = params.name as string;

  // Función para determinar la duración total y los umbrales de color basados en el nombre de la ruta
  const getTimerSettings = (name: string) => {
    switch (name) {
      case "Expo":
        return { total: 420, yellowThreshold: 300, greenThreshold: 300 };
      case "Prototipo":
        return { total: 420, yellowThreshold: 300, greenThreshold: 180 };
      case "Preguntas":
        return { total: 360, yellowThreshold: 240, greenThreshold: 240 };
      default:
        return { total: 420, yellowThreshold: 180, greenThreshold: 240 };
    }
  };

  const { total, yellowThreshold, greenThreshold } =
    getTimerSettings(routeName);

  const [timeLeft, setTimeLeft] = useState(total);
  const [isRunning, setIsRunning] = useState(false);
  const [isChecked, setIsChecked] = useState<boolean>(true);
  const [isClient, setIsClient] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  useEffect(() => {
    setIsClient(true);

    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setIsBlinking(true);
      playSound();
      blinkTimeoutRef.current = setTimeout(() => {
        setIsBlinking(false);
        stopSound();
      }, 5000);
    }

    if (isClient && audioRef.current === null) {
      audioRef.current = new Audio("/alarm.mp3");
    }

    return () => {
      if (interval) clearInterval(interval);
      if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
      stopSound();
    };
  }, [isRunning, timeLeft, isClient]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(total);
    setIsBlinking(false);
    stopSound();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getBackgroundColor = () => {
    if (isBlinking) return "bg-red-500";
    if (timeLeft <= 0) return "bg-red-500";
    if (isRunning && timeLeft > greenThreshold) return "bg-green-500";
    if (timeLeft <= yellowThreshold) return "bg-yellow-300";
    return "bg-white";
  };

  return (
    <div className="h-full flex flex-col">
      <nav className="p-2 flex items-center">
        <Image
          src="/logo_innova.png"
          alt="Logo"
          width={80}
          height={80}
          className="mr-4"
        />
        <h1 className="text-2xl font-bold">Cronómetro {routeName}</h1>
      </nav>
      <main
        className={`flex-grow flex flex-col items-center justify-center ${getBackgroundColor()} ${
          isBlinking ? "animate-pulse" : ""
        } transition-colors duration-300`}
      >
        <div className="w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-10 lg:py-20">
          <div
            className={`text-8xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-8 text-center ${
              isChecked ? "text-black" : "text-transparent"
            }`}
          >
            {formatTime(timeLeft)}
          </div>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button
              onClick={toggleTimer}
              className="text-lg sm:text-xl py-4 px-6 sm:py-6 sm:px-8 w-full sm:w-auto"
            >
              {isRunning ? "Pausar" : "Iniciar"}
            </Button>
            <Button
              onClick={resetTimer}
              className="text-lg sm:text-xl py-4 px-6 sm:py-6 sm:px-8 w-full sm:w-auto"
            >
              Reiniciar
            </Button>
          </div>
        </div>
        <div className="flex flex-center items-center gap-x-2">
          <p className="text-3xl text-bolder">Contador</p>
          <Checkbox
            checked={isChecked}
            onCheckedChange={handleCheckboxChange}
          />
        </div>
      </main>
    </div>
  );
}
