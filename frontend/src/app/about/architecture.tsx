"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const architectureComponents = [
  {
    title: "Memory Core",
    description: "The foundation of the cognitive system, responsible for data storage, retrieval, and pattern recognition.",
    features: [
      "Distributed memory architecture with redundancy",
      "Advanced pattern recognition algorithms",
      "Real-time data indexing and retrieval",
      "Memory compression and optimization",
      "Cross-module data synchronization"
    ]
  },
  {
    title: "Perception Layer",
    description: "Processes and interprets sensory input from various sources, both digital and physical.",
    features: [
      "Multi-modal sensory input processing",
      "Real-time environmental awareness",
      "Adaptive perception thresholds",
      "Noise filtering and signal enhancement",
      "Cross-sensory correlation analysis"
    ]
  },
  {
    title: "Action Layer",
    description: "Executes decisions and controls physical/digital interactions with the environment.",
    features: [
      "Multi-threaded action execution",
      "Priority-based task scheduling",
      "Action validation and safety checks",
      "Feedback loop integration",
      "Resource optimization"
    ]
  },
  {
    title: "Evolver",
    description: "The system&apos;s self-improvement engine, responsible for learning and adaptation.",
    features: [
      "Genetic algorithm optimization",
      "Neural network training and adaptation",
      "Performance metric analysis",
      "Evolutionary constraint management",
      "Cross-module optimization"
    ]
  },
  {
    title: "Treasury",
    description: "Manages the system&apos;s economic resources and interactions.",
    features: [
      "Resource allocation optimization",
      "Economic parameter management",
      "Investment strategy execution",
      "Risk assessment and mitigation",
      "Cross-system economic integration"
    ]
  }
]

const ArchitecturePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-light">System Architecture</h1>
          <p className="text-muted-foreground">
            Detailed overview of the Autonomous Cognitive Network&apos;s architecture and components
          </p>
        </div>

        <div className="grid gap-6">
          {architectureComponents.map((component) => (
            <Card key={component.title}>
              <CardHeader>
                <CardTitle>{component.title}</CardTitle>
                <CardDescription>{component.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="font-semibold">Key Features</h3>
                  <ul className="grid gap-2 md:grid-cols-2">
                    {component.features.map((feature) => (
                      <li key={`${component.title}-${feature}`} className="flex items-start space-x-2">
                        <span className="text-primary">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Integration</CardTitle>
            <CardDescription>
              How components work together to form a cohesive cognitive system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                The Autonomous Cognitive Network operates as an integrated system where each component 
                contributes to the overall cognitive capabilities. The Memory Core serves as the foundation, 
                storing and retrieving information that informs the Perception Layer&apos;s understanding of 
                the environment. The Action Layer executes decisions based on this understanding, while the 
                Evolver continuously improves the system&apos;s performance. The Treasury ensures efficient 
                resource allocation across all components.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-2">Data Flow</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Real-time data streaming between components</li>
                    <li>• Bidirectional communication channels</li>
                    <li>• Priority-based data routing</li>
                    <li>• Cross-component data validation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">System Optimization</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Dynamic resource allocation</li>
                    <li>• Performance monitoring and adjustment</li>
                    <li>• Automated load balancing</li>
                    <li>• Fault tolerance and recovery</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ArchitecturePage 