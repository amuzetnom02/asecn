"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">About ASECN</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Autonomous Self-Evolving Cognitive Network - A decentralized platform for autonomous cognitive systems
          </p>
        </div>

        <Tabs defaultValue="vision" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vision">Vision</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          </TabsList>

          <TabsContent value="vision" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  ASECN aims to create a decentralized network of autonomous cognitive systems that can learn, adapt, and evolve independently while maintaining secure and transparent operations.
                </p>
                <p>
                  Our platform enables the creation and management of autonomous agents that can perceive their environment, make decisions, and take actions while continuously improving their capabilities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Core Objectives</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Develop a robust framework for autonomous cognitive systems</li>
                  <li>Enable secure and transparent autonomous operations</li>
                  <li>Facilitate continuous learning and adaptation</li>
                  <li>Create a decentralized network of autonomous agents</li>
                  <li>Ensure ethical and responsible AI development</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="architecture" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-[600px]">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                  >
                    <svg viewBox="0 0 800 600" className="w-full h-full">
                      {/* Perception Layer */}
                      <motion.g
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <rect x="300" y="50" width="200" height="80" rx="10" className="fill-secondary" />
                        <text x="400" y="90" textAnchor="middle" className="fill-foreground">Perception Layer</text>
                      </motion.g>

                      {/* Memory Core */}
                      <motion.g
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <rect x="300" y="200" width="200" height="80" rx="10" className="fill-secondary" />
                        <text x="400" y="240" textAnchor="middle" className="fill-foreground">Memory Core</text>
                      </motion.g>

                      {/* Action Layer */}
                      <motion.g
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        <rect x="300" y="350" width="200" height="80" rx="10" className="fill-secondary" />
                        <text x="400" y="390" textAnchor="middle" className="fill-foreground">Action Layer</text>
                      </motion.g>

                      {/* Evolver */}
                      <motion.g
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                      >
                        <rect x="100" y="200" width="150" height="80" rx="10" className="fill-secondary" />
                        <text x="175" y="240" textAnchor="middle" className="fill-foreground">Evolver</text>
                      </motion.g>

                      {/* Treasury */}
                      <motion.g
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 1 }}
                      >
                        <rect x="550" y="200" width="150" height="80" rx="10" className="fill-secondary" />
                        <text x="625" y="240" textAnchor="middle" className="fill-foreground">Treasury</text>
                      </motion.g>

                      {/* Connections */}
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 1.2 }}
                        d="M400,130 L400,200 M175,240 L300,240 M500,240 L550,240 M400,280 L400,350"
                        className="stroke-primary stroke-2 fill-none"
                      />
                    </svg>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Development Roadmap</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Phase 1: Foundation</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Core architecture implementation</li>
                    <li>Basic autonomous capabilities</li>
                    <li>Initial network setup</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Phase 2: Evolution</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Advanced learning algorithms</li>
                    <li>Network expansion</li>
                    <li>Performance optimization</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Phase 3: Maturity</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Full autonomous capabilities</li>
                    <li>Global network deployment</li>
                    <li>Community governance</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

export default AboutPage 