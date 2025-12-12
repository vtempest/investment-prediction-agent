"use client"

import { createEffect, useRef, useState, useEffect } from "react"
import { ColorType, createChart, IChartApi, ISeriesApi, UTCTimestamp } from "lightweight-charts"

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
}

export function TechnicalChart({ 
  data, 
  title = "Price Chart",
  colors = {} 
}: TechnicalChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)

  const {
    backgroundColor = 'transparent',
    lineColor = '#2962FF',
    textColor = 'black',
    areaTopColor = '#2962FF',
    areaBottomColor = 'rgba(41, 98, 255, 0.28)',
  } = colors

  useEffect(() => {
    if (!chartContainerRef.current) return

    const handleResize = () => {
      chartRef.current?.applyOptions({ width: chartContainerRef.current!.clientWidth })
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      grid: {
        vertLines: { color: 'rgba(197, 203, 206, 0.1)' },
        horzLines: { color: 'rgba(197, 203, 206, 0.1)' },
      },
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.3)',
      },
      rightPriceScale: {
        borderColor: 'rgba(197, 203, 206, 0.3)',
      },
    })
    chartRef.current = chart

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    })

    // Transform data to ensure it matches specific series requirements if mixed
    // For now assuming candlestick data structure for simplicity or adapting
    const validData = data.map(d => ({
        time: d.time as any, // casting for lightweight-charts types
        open: d.open || d.value || 0,
        high: d.high || d.value || 0,
        low: d.low || d.value || 0,
        close: d.close || d.value || 0
    }))

    candlestickSeries.setData(validData)

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor])

  return (
    <div className="w-full relative">
       {title && <div className="absolute top-2 left-2 z-10 text-sm font-medium text-muted-foreground">{title}</div>}
      <div ref={chartContainerRef} />
    </div>
  )
}
