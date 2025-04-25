"use client";

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SystemMetrics } from "@/components/charts/system-metrics"

interface SystemEvent {
    id: number
    type: "info" | "warning" | "error"
    message: string
    timestamp: string
}

export default function Home() {
    const [events, setEvents] = useState<SystemEvent[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filter, setFilter] = useState("all")

    useEffect(() => {
        // Simulate real-time events
        const interval = setInterval(() => {
            const newEvent: SystemEvent = {
                id: Date.now(),
                type: ["info", "warning", "error"][Math.floor(Math.random() * 3)] as SystemEvent["type"],
                message: `System event ${Date.now()}`,
                timestamp: new Date().toISOString()
            }
            setEvents(prev => [newEvent, ...prev].slice(0, 100))
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.message.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filter === "all" || event.type === filter
        return matchesSearch && matchesFilter
    })

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-light">
                        System Overview
                    </h1>
                    <div className="space-x-2">
                        <Button variant="outline">Refresh</Button>
                        <Button>Export Data</Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>System Status</CardTitle>
                            <CardDescription>Current operational status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold text-green-500">Operational</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Active Modules</CardTitle>
                            <CardDescription>Currently running components</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">12/15</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>System Load</CardTitle>
                            <CardDescription>Current resource utilization</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">42%</div>
                        </CardContent>
                    </Card>
                </div>

                <SystemMetrics />

                <Card>
                    <CardHeader>
                        <CardTitle>Activity Log</CardTitle>
                        <CardDescription>Real-time system events</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <select
                                    className="rounded-md border border-input bg-background px-3 py-2"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    aria-label="Filter events by type"
                                >
                                    <option value="all">All Types</option>
                                    <option value="info">Info</option>
                                    <option value="warning">Warning</option>
                                    <option value="error">Error</option>
                                </select>
                            </div>
                            <div className="h-[300px] overflow-y-auto">
                                {filteredEvents.map(event => (
                                    <div
                                        key={event.id}
                                        className={`p-2 mb-2 rounded ${
                                            event.type === "error" ? "bg-red-100" :
                                            event.type === "warning" ? "bg-yellow-100" :
                                            "bg-blue-100"
                                        }`}
                                    >
                                        <div className="flex justify-between">
                                            <span className="font-medium">{event.message}</span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(event.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
