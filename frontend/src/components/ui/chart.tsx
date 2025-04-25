"use client"

import * as React from "react"
import {
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import type { TooltipProps } from "recharts"
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"
import type { ContentType } from "recharts/types/component/Tooltip"

import { cn } from "@/lib/utils"

interface ChartConfig {
  [key: string]: {
    label: string
    color?: string
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
}

export function ChartContainer({
  className,
  children,
  ...props
}: Omit<ChartContainerProps, "config">) {
  return (
    <div className={cn("w-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

interface ChartTooltipProps {
  cursor?: boolean
  content?: ContentType<ValueType, NameType>
}

export function ChartTooltip({ cursor, content }: ChartTooltipProps) {
  return (
    <Tooltip
      cursor={cursor}
      content={content}
      wrapperStyle={{ outline: "none" }}
    />
  )
}

export function ChartTooltipContent({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>): React.ReactElement | null {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {label}
            </span>
            <span className="font-bold text-muted-foreground">
              {payload[0].value}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return null
}

interface ChartLegendProps {
  content?: ContentType
}

export function ChartLegend({ content }: ChartLegendProps) {
  return <Legend content={content} wrapperStyle={{ paddingTop: 16 }} />
}

interface LegendPayloadItem {
  color: string
  value: string
}

const ChartLegendContentComponent = ({ payload }: { payload?: LegendPayloadItem[] }) => {
  if (!payload || !payload.length) return null

  return (
    <div className="flex items-center justify-center gap-4">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-muted-foreground">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}
ChartLegendContentComponent.displayName = "ChartLegendContent"

export const ChartLegendContent = () => ChartLegendContentComponent 