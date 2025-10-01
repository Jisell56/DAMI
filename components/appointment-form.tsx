"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import type { Appointment } from "@/app/page"

interface AppointmentFormProps {
  appointment?: Appointment | null
  onSubmit: (appointment: Appointment | Omit<Appointment, "id">) => void
  onClose: () => void
}

export function AppointmentForm({ appointment, onSubmit, onClose }: AppointmentFormProps) {
  const [clientName, setClientName] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")

  useEffect(() => {
    if (appointment) {
      setClientName(appointment.clientName)
      setDate(appointment.date)
      setTime(appointment.time)
    }
  }, [appointment])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!clientName.trim() || !date || !time) {
      return
    }

    if (appointment) {
      onSubmit({
        ...appointment,
        clientName: clientName.trim(),
        date,
        time,
      })
    } else {
      onSubmit({
        clientName: clientName.trim(),
        date,
        time,
        status: "scheduled",
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card animate-in slide-in-from-bottom-4 duration-300 border-2 border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b-2 border-border bg-gradient-to-r from-accent/30 to-accent/10">
          <h2 className="text-2xl font-bold text-foreground">{appointment ? "Editar Cita" : "Nueva Cita"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-background/80">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="clientName" className="text-base font-bold text-foreground">
              Nombre de la clienta
            </Label>
            <Input
              id="clientName"
              type="text"
              placeholder="Ej: María González"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="text-base h-12 border-2 focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-base font-bold text-foreground">
              Fecha
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-base h-12 border-2 focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="text-base font-bold text-foreground">
              Hora
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="text-base h-12 border-2 focus:border-primary"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 text-base font-semibold border-2 bg-transparent"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 text-base font-bold bg-gradient-to-r from-primary to-[oklch(0.70_0.20_355)] hover:shadow-lg"
            >
              {appointment ? "Guardar" : "Agregar"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
