"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const contracts = [
  {
    id: "memory-core",
    title: "Memory Core Contract",
    description: "Governs the autonomous memory management system, including data storage, retrieval, and pattern recognition capabilities. Bidders can influence memory allocation strategies and data retention policies.",
    currentBid: "0.5 ETH",
    timeLeft: "2h 15m",
    minBid: "0.1 ETH"
  },
  {
    id: "perception-layer",
    title: "Perception Layer Contract",
    description: "Controls the system&apos;s sensory input processing and environmental awareness. Successful bidders can modify perception thresholds and input processing algorithms.",
    currentBid: "0.8 ETH",
    timeLeft: "1h 30m",
    minBid: "0.2 ETH"
  },
  {
    id: "action-layer",
    title: "Action Layer Contract",
    description: "Manages the execution of autonomous decisions and physical/digital actions. Bidders can influence action prioritization and execution parameters.",
    currentBid: "1.2 ETH",
    timeLeft: "3h 45m",
    minBid: "0.3 ETH"
  },
  {
    id: "evolver",
    title: "Evolver Contract",
    description: "Controls the system&apos;s self-improvement and learning capabilities. Successful bidders can adjust learning rates, optimization parameters, and evolutionary constraints.",
    currentBid: "2.0 ETH",
    timeLeft: "5h 20m",
    minBid: "0.5 ETH"
  },
  {
    id: "treasury",
    title: "Treasury Contract",
    description: "Manages the system&apos;s financial resources and economic interactions. Bidders can influence resource allocation, investment strategies, and economic parameters.",
    currentBid: "3.5 ETH",
    timeLeft: "4h 10m",
    minBid: "0.7 ETH"
  }
]

const AuctionPage = () => {
  const [selectedContract, setSelectedContract] = useState(contracts[0].id)
  const [bidAmount, setBidAmount] = useState("")

  const handleBid = () => {
    // Handle bid submission
    console.log(`Bidding ${bidAmount} ETH on ${selectedContract}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-light">
            Cognitive Autonomy Contracts
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            {contracts.map((contract) => (
              <Card
                key={contract.id}
                className={`cursor-pointer transition-colors ${
                  selectedContract === contract.id
                    ? "border-primary"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedContract(contract.id)}
              >
                <CardHeader>
                  <CardTitle>{contract.title}</CardTitle>
                  <CardDescription>{contract.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Current Bid:</span>
                      <p className="font-semibold">{contract.currentBid}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Time Left:</span>
                      <p className="font-semibold">{contract.timeLeft}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Minimum Bid:</span>
                      <p className="font-semibold">{contract.minBid}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Place Your Bid</CardTitle>
                <CardDescription>
                  Bid on the selected cognitive autonomy contract
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bid">Bid Amount (ETH)</Label>
                    <Input
                      id="bid"
                      type="number"
                      placeholder="0.1"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" onClick={handleBid}>
                    Place Bid
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contract Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Contract Overview</h3>
                    <p className="text-sm text-muted-foreground">
                      Each cognitive autonomy contract represents a specific aspect of the system&apos;s functionality. 
                      Successful bidders gain influence over the corresponding module&apos;s parameters and decision-making processes.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Bidding Rules</h3>
                    <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                      <li>Bids must be higher than the current highest bid</li>
                      <li>Minimum bid increments apply</li>
                      <li>Bids are locked for the duration of the auction</li>
                      <li>Winning bidders gain temporary control over contract parameters</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuctionPage 