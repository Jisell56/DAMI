"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AppointmentForm } from "@/components/appointment-form"
import { AppointmentList } from "@/components/appointment-list"
import { MonthCalendar } from "@/components/month-calendar"
import { Sparkles, Calendar, Search, BarChart3, List } from "lucide-react"

export type AppointmentStatus = "scheduled" | "completed" | "cancelled"

export interface Appointment {
  id: string
  clientName: string
  date: string
  time: string
  status: AppointmentStatus
}

export default function DamiNailsApp() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Load appointments from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("daminails-appointments")
    if (stored) {
      try {
        setAppointments(JSON.parse(stored))
      } catch (e) {
        console.error("Error loading appointments:", e)
      }
    }
  }, [])

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    if (appointments.length > 0 || localStorage.getItem("daminails-appointments")) {
      localStorage.setItem("daminails-appointments", JSON.stringify(appointments))
    }
  }, [appointments])

  const handleAddAppointment = (appointment: Omit<Appointment, "id">) => {
    const newAppointment = {
      ...appointment,
      id: Date.now().toString(),
    }
    setAppointments([...appointments, newAppointment])
    setIsFormOpen(false)
  }

  const handleEditAppointment = (appointment: Appointment) => {
    setAppointments(appointments.map((a) => (a.id === appointment.id ? appointment : a)))
    setEditingAppointment(null)
    setIsFormOpen(false)
  }

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter((a) => a.id !== id))
  }

  const handleStatusChange = (id: string, status: AppointmentStatus) => {
    setAppointments(appointments.map((a) => (a.id === id ? { ...a, status } : a)))
  }

  const openEditForm = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingAppointment(null)
  }

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.clientName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const displayedAppointments = selectedDate
    ? filteredAppointments.filter((a) => a.date === selectedDate)
    : filteredAppointments

  // Sort appointments by date and time
  const sortedAppointments = [...displayedAppointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA.getTime() - dateB.getTime()
  })

  const stats = {
    total: appointments.length,
    scheduled: appointments.filter((a) => a.status === "scheduled").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  }

  const today = new Date().toISOString().split("T")[0]
  const todayCount = appointments.filter((a) => a.date === today).length

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gradient-to-r from-primary via-primary to-[oklch(0.70_0.20_355)] text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 animate-pulse" />
            <h1 className="text-3xl font-bold tracking-tight">DamiNails</h1>
            <Sparkles className="h-8 w-8 animate-pulse" />
          </div>
          <p className="text-center text-sm mt-2 text-primary-foreground/95 font-medium">
            Gestión de citas profesional
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Card className="p-6 mb-6 bg-gradient-to-br from-[oklch(0.95_0.08_350)] via-[oklch(0.96_0.06_340)] to-[oklch(0.97_0.04_30)] border-[oklch(0.85_0.08_345)] shadow-md">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-bold text-[oklch(0.45_0.12_350)]">Estadísticas</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/60 border border-[oklch(0.90_0.06_345)]">
              <p className="text-xs text-[oklch(0.50_0.08_345)] mb-2 font-semibold uppercase tracking-wide">Total</p>
              <p className="text-3xl font-bold text-[oklch(0.45_0.12_350)]">{stats.total}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/60 border border-[oklch(0.90_0.06_345)]">
              <p className="text-xs text-[oklch(0.50_0.08_345)] mb-2 font-semibold uppercase tracking-wide">Hoy</p>
              <p className="text-3xl font-bold text-primary">{todayCount}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/60 border border-[oklch(0.90_0.06_345)]">
              <p className="text-xs text-[oklch(0.50_0.08_345)] mb-2 font-semibold uppercase tracking-wide">
                Completadas
              </p>
              <p className="text-3xl font-bold text-[oklch(0.40_0.12_150)]">{stats.completed}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/60 border border-[oklch(0.90_0.06_345)]">
              <p className="text-xs text-[oklch(0.50_0.08_345)] mb-2 font-semibold uppercase tracking-wide">
                Canceladas
              </p>
              <p className="text-3xl font-bold text-[oklch(0.45_0.10_30)]">{stats.cancelled}</p>
            </div>
          </div>
        </Card>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar clienta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base border-2 focus:border-primary"
          />
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => {
              setViewMode("list")
              setSelectedDate(null)
            }}
            className="flex-1 h-12 font-semibold"
          >
            <List className="h-5 w-5 mr-2" />
            Lista
          </Button>
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            onClick={() => setViewMode("calendar")}
            className="flex-1 h-12 font-semibold"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Calendario
          </Button>
        </div>

        {viewMode === "calendar" ? (
          <MonthCalendar
            appointments={filteredAppointments}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onEdit={openEditForm}
            onDelete={handleDeleteAppointment}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <>
            {/* Appointment List */}
            <AppointmentList
              appointments={sortedAppointments}
              onEdit={openEditForm}
              onDelete={handleDeleteAppointment}
              onStatusChange={handleStatusChange}
            />

            {/* Empty State */}
            {sortedAppointments.length === 0 && (
              <Card className="p-12 text-center border-2 border-dashed border-border">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-primary/40" />
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {searchQuery ? "No se encontraron citas" : "No hay citas agendadas"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery ? "Intenta con otro nombre" : "Comienza agregando tu primera cita"}
                </p>
              </Card>
            )}
          </>
        )}
      </main>

      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="h-16 w-16 rounded-full shadow-2xl hover:scale-110 transition-all bg-gradient-to-br from-primary to-[oklch(0.70_0.20_355)] hover:shadow-primary/50 flex items-center justify-center touch-manipulation"
          onClick={() => setIsFormOpen(true)}
        >
          <span className="text-3xl font-light leading-none">+</span>
        </Button>
      </div>

      {/* Appointment Form Modal */}
      {isFormOpen && (
        <AppointmentForm
          appointment={editingAppointment}
          onSubmit={editingAppointment ? handleEditAppointment : handleAddAppointment}
          onClose={closeForm}
        />
      )}
    </div>
  )
}
