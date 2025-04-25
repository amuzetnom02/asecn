"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-12 w-12 md:h-16 md:w-16 text-primary", className)}
      aria-label="ASECN Logo"
      {...props}
    >
      {/* Central core with gradient */}
      <defs>
        <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
        </radialGradient>
      </defs>

      {/* Animated rings */}
      <g className="animate-pulse-slow">
        <circle cx="100" cy="100" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="100" cy="100" r="35" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
      </g>

      {/* Central core */}
      <circle cx="100" cy="100" r="25" fill="url(#coreGradient)" className="animate-pulse" />

      {/* Orbiting nodes with trails */}
      <g className="animate-orbit-slow">
        <g className="animate-orbit-reverse">
          <circle cx="100" cy="40" r="12" fill="currentColor" className="animate-pulse" />
          <path
            d="M100 40 L100 100"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 2"
            className="animate-dash"
          />
        </g>
        <g className="animate-orbit">
          <circle cx="160" cy="100" r="12" fill="currentColor" className="animate-pulse" />
          <path
            d="M160 100 L100 100"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 2"
            className="animate-dash"
          />
        </g>
        <g className="animate-orbit-reverse">
          <circle cx="100" cy="160" r="12" fill="currentColor" className="animate-pulse" />
          <path
            d="M100 160 L100 100"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 2"
            className="animate-dash"
          />
        </g>
        <g className="animate-orbit">
          <circle cx="40" cy="100" r="12" fill="currentColor" className="animate-pulse" />
          <path
            d="M40 100 L100 100"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 2"
            className="animate-dash"
          />
        </g>
      </g>

      {/* Connection lines with animation */}
      <g className="animate-connect">
        <path
          d="M100 70 L100 130"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="animate-dash"
        />
        <path
          d="M70 100 L130 100"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="animate-dash"
        />
        <path
          d="M85 85 L115 115"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="animate-dash"
        />
        <path
          d="M85 115 L115 85"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="animate-dash"
        />
      </g>
    </svg>
  )
} 