'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Checkbox } from '@/components/ui/checkbox'

export default function Cronometro() {
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutos en segundos
  const [isRunning, setIsRunning] = useState(false)
  const [isChecked, setIsChecked] = useState<boolean>(true)
  const [isClient, setIsClient] = useState(false) // Estado para verificar si estamos en el cliente
  const audioRef = useRef<HTMLAudioElement | null>(null) // Audio solo se carga en el cliente
  const audioContextRef = useRef<AudioContext | null>(null)

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play()
    }
  }

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked)
  }

  useEffect(() => {
    // Establecer que estamos en el cliente
    setIsClient(true)

    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)

      // Iniciar el sonido cuando quedan 5 segundos o menos
      if (timeLeft <= 5) {
        playSound()
      } else {
        stopSound()
      }
    } else if (timeLeft === 0) {
      setIsRunning(false)
      stopSound()
    } else {
      stopSound()
    }

    // Iniciar el contexto de audio solo en el cliente
    if (isClient) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      if (audioRef.current === null) {
        audioRef.current = new Audio('/alarm.mp3') // Solo se carga en el cliente
      }
    }

    return () => {
      if (interval) clearInterval(interval)
      if (audioContextRef.current) audioContextRef.current.close()
      stopSound()
    }
  }, [isRunning, timeLeft, isClient])

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(300) // Reiniciar a 5 minutos
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getBackgroundColor = () => {
    if (isRunning && timeLeft > 180) return 'bg-green-500'
    if (timeLeft <= 60) return 'bg-red-500'
    if (timeLeft <= 180) return 'bg-yellow-300'
    return 'bg-white'
  }

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
        <h1 className="text-2xl font-bold">Cronómetro Preguntas y respuestas</h1>
      </nav>
      <main className={`flex-grow flex flex-col items-center justify-center ${getBackgroundColor()} ${timeLeft > 0 && timeLeft <= 5 ? 'animate-pulse' : ''} transition-colors duration-300`}>
        <div className="w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-10 lg:py-20">
          <div className={`text-6xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-8 text-center ${isChecked ? 'text-black' : 'text-transparent'}`}>
            {formatTime(timeLeft)}
          </div>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button
              onClick={toggleTimer}
              className="text-lg sm:text-xl py-4 px-6 sm:py-6 sm:px-8 w-full sm:w-auto"
            >
              {isRunning ? 'Pausar' : 'Iniciar'}
            </Button>
            <Button
              onClick={resetTimer}
              className="text-lg sm:text-xl py-4 px-6 sm:py-6 sm:px-8 w-full sm:w-auto"
            >
              Reiniciar
            </Button>
          </div>
        </div>
        <div className='flex flex-center items-center gap-x-2'>
          <p className='text-3xl text-bolder'>Contador</p>
          <Checkbox checked={isChecked} onCheckedChange={handleCheckboxChange} />
        </div>
      </main>
    </div>
  )
}
