"use client"

import { useEffect, useRef } from "react"
import { Chart, CandlestickSeries } from "lightweight-charts-react-components"
import type { IChartApi } from "lightweight-charts"

interface TechnicalChartProps {
  data: {
    time: string | number // 'yyyy-mm-dd' or timestamp
    value?: number
    open?: number
    high?: number
    low?: number
    close?: number
  }[]
  title?: string
  colors?: {
    backgroundColor?: string
    lineColor?: string
    textColor?: string
    areaTopColor?: string
    areaBottomColor?: string
  }
  onVisibleRangeChange?: (range: { from: number; to: number }) => void
  onChartReady?: (chart: IChartApi, series: any) => void
  symbol?: string
}

export function TechnicalChart({
  data,
  title = "Price Chart",
  colors = {},
  onVisibleRangeChange,
  onChartReady,
  symbol
}: TechnicalChartProps) {
  const {
    backgroundColor = 'transparent',
    textColor = 'black',
  } = colors

  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<any>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Transform data to ensure it matches specific series requirements
  const validData = data.map(d => ({
    time: d.time as any,
    open: d.open || d.value || 0,
    high: d.high || d.value || 0,
    low: d.low || d.value || 0,
    close: d.close || d.value || 0
  })).filter(d => d.open !== 0 || d.close !== 0); // Basic filter

  // Subscribe to visible range changes
  useEffect(() => {
    if (!chartRef.current || !onVisibleRangeChange) return

    const chart = chartRef.current
    const timeScale = chart.timeScale()

    const handleVisibleRangeChange = () => {
      // Debounce the callback to avoid too many API calls
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        const logicalRange = timeScale.getVisibleLogicalRange()

        if (logicalRange && validData.length > 0) {
          // Convert logical range to actual time values
          const fromIndex = Math.max(0, Math.floor(logicalRange.from))
          const toIndex = Math.min(validData.length - 1, Math.ceil(logicalRange.to))

          if (fromIndex < validData.length && toIndex >= 0) {
            const fromTime = validData[fromIndex]?.time
            const toTime = validData[toIndex]?.time

            if (fromTime && toTime) {
              // Convert to timestamps
              const fromTimestamp = typeof fromTime === 'number'
                ? fromTime
                : new Date(fromTime as string).getTime() / 1000
              const toTimestamp = typeof toTime === 'number'
                ? toTime
                : new Date(toTime as string).getTime() / 1000

              onVisibleRangeChange({
                from: fromTimestamp,
                to: toTimestamp
              })
            }
          }
        }
      }, 500) // 500ms debounce
    }

    timeScale.subscribeVisibleLogicalRangeChange(handleVisibleRangeChange)

    return () => {
      timeScale.unsubscribeVisibleLogicalRangeChange(handleVisibleRangeChange)
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [onVisibleRangeChange, validData])

  // Notify parent when chart and series are ready
  useEffect(() => {
    if (chartRef.current && seriesRef.current && onChartReady) {
      onChartReady(chartRef.current, seriesRef.current)
    }
  }, [onChartReady])

  return (
    <div className="w-full relative h-[300px]">
       {title && <div className="absolute top-2 left-2 z-10 text-sm font-medium text-muted-foreground">{title}</div>}
       <Chart
          ref={(ref: any) => {
            // The Chart component exposes the IChartApi through its ref
            if (ref && typeof ref === 'object' && 'timeScale' in ref) {
              chartRef.current = ref as IChartApi
            }
          }}
          options={{
            layout: {
              background: { color: backgroundColor },
              textColor,
            },
            grid: {
              vertLines: { color: 'rgba(197, 203, 206, 0.1)' },
              horzLines: { color: 'rgba(197, 203, 206, 0.1)' },
            },
            timeScale: {
              borderColor: 'rgba(197, 203, 206, 0.3)',
              timeVisible: true,
            },
            rightPriceScale: {
              borderColor: 'rgba(197, 203, 206, 0.3)',
            },
            height: 300,
            autoSize: true,
          }}
        >
          <CandlestickSeries
            ref={(ref: any) => {
              seriesRef.current = ref
            }}
            data={validData}
            options={{
              upColor: '#26a69a',
              downColor: '#ef5350',
              borderVisible: false,
              wickUpColor: '#26a69a',
              wickDownColor: '#ef5350',
            }}
          />
        </Chart>
    </div>
  )
}
