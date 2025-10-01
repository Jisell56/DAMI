"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { AppointmentList } from "@/components/appointment-list"
import type { Appointment, AppointmentStatus } from "@/app/page"

interface MonthCalendarProps {
  appointments: Appointment[]
  selectedDate: string | null
  onDateSelect: (date: string | null) => void
  onEdit: (appointment: Appointment) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: AppointmentStatus) => void
}

export function MonthCalendar({
  appointments,
  selectedDate,
  onDateSelect,
  onEdit,
  onDelete,
  onStatusChange,
}: MonthCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  const monthName = currentDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" })

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    onDateSelect(null)
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    onDateSelect(null)
  }

  const getAppointmentsForDate = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return appointments.filter((apt) => apt.date === dateString)
  }

  const handleDateClick = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    onDateSelect(selectedDate === dateString ? null : dateString)
  }

  const isToday = (day: number) => {
    const today = new Date()
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
  }

  const isSelected = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return selectedDate === dateString
  }

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayAppointments = getAppointmentsForDate(day)
    const hasAppointments = dayAppointments.length > 0

    days.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        className={`aspect-square p-1 rounded-lg border-2 transition-all relative ${
          isSelected(day)
            ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
            : isToday(day)
              ? "bg-[oklch(0.95_0.08_350)] border-primary/50 font-bold"
              : hasAppointments
                ? "bg-[oklch(0.97_0.04_350)] border-[oklch(0.90_0.06_345)] hover:border-primary/50"
                : "bg-card border-border/30 hover:border-border hover:bg-accent/30"
        }`}
      >
        <div className="text-sm font-semibold">{day}</div>
        {hasAppointments && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
            {dayAppointments.slice(0, 3).map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-primary" />
            ))}
          </div>
        )}
      </button>,
    )
  }

  const selectedDateAppointments = selectedDate
    ? appointments
        .filter((apt) => apt.date === selectedDate)
        .sort((a, b) => {
          const timeA = new Date(`${a.date}T${a.time}`)
          const timeB = new Date(`${b.date}T${b.time}`)
          return timeA.getTime() - timeB.getTime()
        })
    : []

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-card border-2">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={goToPreviousMonth} className="hover:bg-accent">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h3 className="text-lg font-bold capitalize text-foreground">{monthName}</h3>
          <Button variant="ghost" size="icon" onClick={goToNextMonth} className="hover:bg-accent">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
            <div key={day} className="text-center text-xs font-bold text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">{days}</div>
      </Card>

      {selectedDate && selectedDateAppointments.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3 px-1">
            Citas del{" "}
            {new Date(selectedDate + "T00:00:00").toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h3>
          <AppointmentList
            appointments={selectedDateAppointments}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        </div>
      )}

      {selectedDate && selectedDateAppointments.length === 0 && (
        <Card className="p-8 text-center border-2 border-dashed">
          <p className="text-muted-foreground">No hay citas para este día</p>
        </Card>
      )}
    </div>
  )
}
