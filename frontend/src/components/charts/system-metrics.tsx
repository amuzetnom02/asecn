"use client"

import * as React from "react"
import { useEffect, useState } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { generateMockData } from '@/lib/mock-data'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export function SystemMetrics() {
  const [data, setData] = useState(generateMockData())

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateMockData())
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const formatData = (rawData: number[]) => {
    return rawData.map((value, index) => ({
      time: `${index}:00`,
      value: Math.round(value * 100) / 100
    }))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {/* Perception Layer */}
      <div className="bg-card rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Perception Layer</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formatData(data.perception.cpu)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Memory Core */}
      <div className="bg-card rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Memory Core</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formatData(data.memory.usage)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action Layer */}
      <div className="bg-card rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Action Layer</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formatData(data.action.executed)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Evolver */}
      <div className="bg-card rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Evolver</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'Learning Rate', value: data.evolver.learningRate[0] },
                  { name: 'Updates', value: data.evolver.updates[0] },
                  { name: 'Improvement', value: data.evolver.improvement[0] }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[0, 1, 2].map((entry) => (
                  <Cell key={`cell-${entry}`} fill={COLORS[entry % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Treasury */}
      <div className="bg-card rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Treasury</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formatData(data.treasury.balance)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#ffc658" fill="#ffc658" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
} 