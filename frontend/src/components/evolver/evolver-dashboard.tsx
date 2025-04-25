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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateMockData } from "@/lib/mock-data"

const EvolverDashboard = () => {
  const [data, setData] = useState(generateMockData())
  const [activeTab, setActiveTab] = useState("learning")

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

  const radarData = [
    { subject: 'Accuracy', A: data.evolver.learningRate[0], fullMark: 100 },
    { subject: 'Speed', A: data.evolver.updates[0], fullMark: 100 },
    { subject: 'Efficiency', A: data.evolver.improvement[0], fullMark: 100 },
    { subject: 'Adaptability', A: (data.evolver.learningRate[0] + data.evolver.updates[0]) / 2, fullMark: 100 },
    { subject: 'Stability', A: (data.evolver.improvement[0] + data.evolver.learningRate[0]) / 2, fullMark: 100 }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Evolver Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="learning">Learning Progress</TabsTrigger>
              <TabsTrigger value="improvement">Model Improvement</TabsTrigger>
              <TabsTrigger value="adaptation">Adaptation Metrics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="learning" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formatData(data.evolver.learningRate)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Performance" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="improvement">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold">{Math.round(data.evolver.learningRate[0] * 100)}%</div>
                    <div className="text-sm text-muted-foreground">Learning Rate</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold">{Math.round(data.evolver.updates[0])}</div>
                    <div className="text-sm text-muted-foreground">Model Updates</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold">{Math.round(data.evolver.improvement[0] * 100)}%</div>
                    <div className="text-sm text-muted-foreground">Improvement</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="adaptation">
              <div className="space-y-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formatData(data.evolver.improvement)}>
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

export default EvolverDashboard 