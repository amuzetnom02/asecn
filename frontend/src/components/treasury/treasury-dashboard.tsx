"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { 
  AreaChart, 
  Area,
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

const TreasuryDashboard = () => {
  const [data, setData] = useState(generateMockData())
  const [activeTab, setActiveTab] = useState("financial")

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
    { name: "Memory Core", value: data.treasury.allocation[0] },
    { name: "Perception Layer", value: data.treasury.allocation[1] },
    { name: "Action Layer", value: data.treasury.allocation[2] },
    { name: "Evolver", value: data.treasury.allocation[3] }
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
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
            Treasury Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="financial">Financial Analytics</TabsTrigger>
              <TabsTrigger value="allocation">Resource Allocation</TabsTrigger>
              <TabsTrigger value="transactions">Transaction History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="financial" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formatData(data.treasury.balance)}>
                      <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#ffc658" fillOpacity={1} fill="url(#colorBalance)" />
                    </AreaChart>
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

            <TabsContent value="allocation">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold">${Math.round(data.treasury.balance[0])}</div>
                    <div className="text-sm text-muted-foreground">Total Balance</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-500/10 to-teal-500/10">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold">{Math.round(data.treasury.transactions[0])}</div>
                    <div className="text-sm text-muted-foreground">Transactions</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold">{Math.round(data.treasury.allocation[0])}%</div>
                    <div className="text-sm text-muted-foreground">Allocation Rate</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <div className="space-y-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formatData(data.treasury.transactions)}>
                      <defs>
                        <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#82ca9d" fillOpacity={1} fill="url(#colorTransactions)" />
                    </AreaChart>
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

export default TreasuryDashboard 