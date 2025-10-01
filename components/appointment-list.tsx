"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Calendar, Clock, Check, X, Trash2, Edit, Menu } from "lucide-react"
import type { Appointment, AppointmentStatus } from "@/app/page"

interface AppointmentListProps {
  appointments: Appointment[]
  onEdit: (appointment: Appointment) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: AppointmentStatus) => void
}

export function AppointmentList({ appointments, onEdit, onDelete, onStatusChange }: AppointmentListProps) {
  const [openSheetId, setOpenSheetId] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00")
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case "completed":
        return "bg-[oklch(0.92_0.08_150)] text-[oklch(0.40_0.12_150)] border-[oklch(0.85_0.10_150)]"
      case "cancelled":
        return "bg-[oklch(0.94_0.06_30)] text-[oklch(0.45_0.10_30)] border-[oklch(0.88_0.08_30)]"
      default:
        return "bg-[oklch(0.92_0.08_350)] text-[oklch(0.45_0.12_350)] border-[oklch(0.85_0.10_350)]"
    }
  }

  const getStatusLabel = (status: AppointmentStatus) => {
    switch (status) {
      case "completed":
        return "Asistió"
      case "cancelled":
        return "Canceló"
      default:
        return "Pendiente"
    }
  }

  const handleAction = (callback: () => void) => {
    callback()
    setOpenSheetId(null)
  }

  // Group appointments by date
  const groupedAppointments = appointments.reduce(
    (groups, appointment) => {
      const date = appointment.date
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(appointment)
      return groups
    },
    {} as Record<string, Appointment[]>,
  )

  return (
    <div className="space-y-6">
      {Object.entries(groupedAppointments).map(([date, dateAppointments]) => (
        <div key={date}>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-bold text-foreground capitalize tracking-wide">{formatDate(date)}</h3>
          </div>

          <div className="space-y-3">
            {dateAppointments.map((appointment) => (
              <Card
                key={appointment.id}
                className="p-4 hover:shadow-lg transition-all border-border/50 bg-card hover:border-primary/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h4 className="text-lg font-bold text-foreground truncate">{appointment.clientName}</h4>
                      <span
                        className={`text-xs px-3 py-1 rounded-full border font-semibold ${getStatusColor(appointment.status)}`}
                      >
                        {getStatusLabel(appointment.status)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary/70" />
                      <span className="text-base font-semibold">{formatTime(appointment.time)}</span>
                    </div>
                  </div>

                  <Sheet
                    open={openSheetId === appointment.id}
                    onOpenChange={(open) => setOpenSheetId(open ? appointment.id : null)}
                  >
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-full hover:bg-primary/10 shrink-0 
                                   min-h-[48px] min-w-[48px] 
                                   active:bg-primary/20 
                                   transition-colors"
                      >
                        <Menu className="h-6 w-6 text-primary" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="rounded-t-3xl">
                      <SheetHeader>
                        <SheetTitle className="text-left">Opciones de Cita</SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-col gap-2 mt-6">
                        <Button
                          variant="outline"
                          className="w-full justify-start h-14 text-base bg-transparent"
                          onClick={() => handleAction(() => onEdit(appointment))}
                        >
                          <Edit className="h-5 w-5 mr-3" />
                          Editar
                        </Button>

                        {appointment.status !== "completed" && (
                          <Button
                            variant="outline"
                            className="w-full justify-start h-14 text-base text-[oklch(0.40_0.12_150)] bg-transparent"
                            onClick={() => handleAction(() => onStatusChange(appointment.id, "completed"))}
                          >
                            <Check className="h-5 w-5 mr-3" />
                            Marcar como Asistió
                          </Button>
                        )}

                        {appointment.status !== "cancelled" && (
                          <Button
                            variant="outline"
                            className="w-full justify-start h-14 text-base text-[oklch(0.50_0.12_30)] bg-transparent"
                            onClick={() => handleAction(() => onStatusChange(appointment.id, "cancelled"))}
                          >
                            <X className="h-5 w-5 mr-3" />
                            Marcar como Canceló
                          </Button>
                        )}

                        {appointment.status !== "scheduled" && (
                          <Button
                            variant="outline"
                            className="w-full justify-start h-14 text-base text-primary bg-transparent"
                            onClick={() => handleAction(() => onStatusChange(appointment.id, "scheduled"))}
                          >
                            <Clock className="h-5 w-5 mr-3" />
                            Marcar como Pendiente
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          className="w-full justify-start h-14 text-base text-destructive bg-transparent"
                          onClick={() => handleAction(() => onDelete(appointment.id))}
                        >
                          <Trash2 className="h-5 w-5 mr-3" />
                          Eliminar
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
