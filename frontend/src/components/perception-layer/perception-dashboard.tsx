"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateMockData } from "@/lib/mock-data"

const PerceptionDashboard = () => {
  const [data, setData] = useState(generateMockData())
  const [activeTab, setActiveTab] = useState("patterns")

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

  const scatterData = data.perception.cpu.map((value, index) => ({
    x: value,
    y: data.perception.memory[index],
    z: data.perception.dataRate[index]
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Perception Layer Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="patterns">Pattern Recognition</TabsTrigger>
              <TabsTrigger value="sensors">Sensor Fusion</TabsTrigger>
              <TabsTrigger value="awareness">Environmental Awareness</TabsTrigger>
            </TabsList>
            
            <TabsContent value="patterns" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formatData(data.perception.cpu)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" dataKey="x" name="CPU" />
                      <YAxis type="number" dataKey="y" name="Memory" />
                      <ZAxis type="number" dataKey="z" name="Data Rate" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Sensor Data" data={scatterData} fill="#82ca9d" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sensors">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-green-500/10 to-teal-500/10">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold">{Math.round(data.perception.cpu[0])}%</div>
                    <div className="text-sm text-muted-foreground">CPU Usage</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold">{Math.round(data.perception.memory[0])}%</div>
                    <div className="text-sm text-muted-foreground">Memory Usage</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold">{Math.round(data.perception.dataRate[0])}%</div>
                    <div className="text-sm text-muted-foreground">Data Rate</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="awareness">
              <div className="space-y-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formatData(data.perception.dataRate)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default PerceptionDashboard 