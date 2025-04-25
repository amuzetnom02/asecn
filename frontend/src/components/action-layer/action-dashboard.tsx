"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateMockData } from "@/lib/mock-data"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const ActionDashboard = () => {
  const [data, setData] = useState(generateMockData())
  const [activeTab, setActiveTab] = useState("execution")

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

  const pieData = [
    { name: "Success", value: data.action.successRate[0] },
    { name: "Errors", value: data.action.errors[0] },
    { name: "Pending", value: 100 - (data.action.successRate[0] + data.action.errors[0]) }
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
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Action Layer Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="execution">Action Execution</TabsTrigger>
              <TabsTrigger value="planning">Action Planning</TabsTrigger>
              <TabsTrigger value="monitoring">Performance Monitoring</TabsTrigger>
            </TabsList>
            
            <TabsContent value="execution" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={formatData(data.action.executed)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#ff7300" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="planning">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold">{Math.round(data.action.executed[0])}</div>
                    <div className="text-sm text-muted-foreground">Actions Executed</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-500/10 to-teal-500/10">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold">{Math.round(data.action.successRate[0])}%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold">{Math.round(data.action.errors[0])}</div>
                    <div className="text-sm text-muted-foreground">Errors</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="monitoring">
              <div className="space-y-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={formatData(data.action.successRate)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
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

export default ActionDashboard 