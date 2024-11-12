'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"


interface TimerConfig {
  totalTime: number;
  yellowTime: number;
  redTime: number;
}

export default function CronometroPersonalizado() {
  const [config, setConfig] = useState<TimerConfig | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isChecked, setIsChecked] = useState(true); // Added state for checkbox

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };


  useEffect(() => {
    const loadConfig = async () => {
      setIsLoading(true)
      const savedConfig = localStorage.getItem('timerConfig')
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig)
        setConfig(parsedConfig)
        setTimeLeft(parsedConfig.totalTime)
        setShowConfig(false)
      } else {
        setShowConfig(true)
      }
      setIsLoading(false)
    }
    loadConfig()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft])

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(config?.totalTime || 0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getBackgroundColor = () => {
    if (!config) return 'bg-white'
    if (isRunning && timeLeft > config.yellowTime) return 'bg-green-500'
    if (timeLeft <= config.redTime) return 'bg-red-500'
    if (timeLeft <= config.yellowTime) return 'bg-yellow-300'
    return 'bg-white'
  }

  const saveConfig = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newConfig: TimerConfig = {
      totalTime: parseInt(formData.get('totalTime') as string) * 60,
      yellowTime: parseInt(formData.get('yellowTime') as string) * 60,
      redTime: parseInt(formData.get('redTime') as string) * 60,
    }
    localStorage.setItem('timerConfig', JSON.stringify(newConfig))
    setConfig(newConfig)
    setTimeLeft(newConfig.totalTime)
    setShowConfig(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className=" p-4 flex items-center">
        <Image 
          src="/logo_innova.png" 
          alt="Logo" 
          width={80} 
          height={80} 
          className="mr-4"
        />
        <h1 className="text-2xl font-bold">Cronómetro Personalizado</h1>
      </nav>
      <main className={`flex-grow flex flex-col items-center justify-center ${getBackgroundColor()} transition-colors duration-300`}>
        {isLoading ? (
          <div className="w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-10 lg:py-20">
            <Skeleton className="h-32 w-full mb-8" />
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Skeleton className="h-12 w-full sm:w-32" />
              <Skeleton className="h-12 w-full sm:w-32" />
              <Skeleton className="h-12 w-full sm:w-32" />
            </div>
            <div className="flex justify-center items-center mt-4">
              <Skeleton className="h-6 w-24 mr-2" />
              <Skeleton className="h-6 w-6" />
            </div>
          </div>
        ) : showConfig || !config ? (
          <form onSubmit={saveConfig} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="space-y-4">
              <div>
                <Label htmlFor="totalTime">Tiempo total (minutos)</Label>
                <Input type="number" id="totalTime" name="totalTime" required min="1" defaultValue={config?.totalTime ? config.totalTime / 60 : 5} />
              </div>
              <div>
                <Label htmlFor="yellowTime">Tiempo para amarillo (minutos)</Label>
                <Input type="number" id="yellowTime" name="yellowTime" required min="1" defaultValue={config?.yellowTime ? config.yellowTime / 60 : 3} />
              </div>
              <div>
                <Label htmlFor="redTime">Tiempo para rojo (minutos)</Label>
                <Input type="number" id="redTime" name="redTime" required min="1" defaultValue={config?.redTime ? config.redTime / 60 : 1} />
              </div>
            </div>
            <Button type="submit" className="mt-4 w-full">Guardar Configuración</Button>
          </form>
        ) : (
          <div className="w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-10 lg:py-20">
            <div className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-8 text-center ${isChecked ? 'text-black' : 'text-transparent'} ${timeLeft <= 5 && isRunning ? 'animate-pulse' : ''}`}>
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
              <Button 
                onClick={() => setShowConfig(true)}
                className="text-lg sm:text-xl py-4 px-6 sm:py-6 sm:px-8 w-full sm:w-auto"
              >
                Editar Configuración
              </Button>
            </div>
            {!isLoading && (
              <div className='flex justify-center items-center gap-x-2 mt-4'>
                <p className='text-3xl text-bolder'>Contador</p>
                <Checkbox checked={isChecked} onCheckedChange={handleCheckboxChange} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}