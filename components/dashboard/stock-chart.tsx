"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { Chart, CandlestickSeries, LineSeries, HistogramSeries, AreaSeries, TimeScale, TimeScaleFitContentTrigger, Pane } from "lightweight-charts-react-components"
import { Button } from "@/components/ui/button"
import { rsi } from "indicatorts"
import { macd } from "indicatorts"
import { atr } from "indicatorts"
import { stochasticOscillator } from "indicatorts"
import { cci } from "indicatorts"
import { obv } from "indicatorts"
import type { IChartApi } from "lightweight-charts"

interface ChartData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface TradeSignal {
  date: string
  time: number
  action: 'BUY' | 'SELL'
  price: number
}

interface StockChartProps {
  data: ChartData[]
  symbol: string
  onRangeChange?: (range: string, interval: string) => void
  tradeSignals?: TradeSignal[]
}

type IndicatorType = "none" | "rsi" | "macd" | "atr" | "stochastic" | "cci" | "obv"
type ChartType = "candlestick" | "line" | "area"

export function StockChart({ data, symbol, onRangeChange, tradeSignals = [] }: StockChartProps) {
  const [selectedIndicator, setSelectedIndicator] = useState<IndicatorType>("none")
  const [showVolume, setShowVolume] = useState(true)
  const [chartType, setChartType] = useState<ChartType>("candlestick")
  const [selectedRange, setSelectedRange] = useState("1y")
  const candlestickSeriesRef = useRef<any>(null)
  const lineSeriesRef = useRef<any>(null)
  const areaSeriesRef = useRef<any>(null)

  if (data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-muted-foreground">
        No chart data available
      </div>
    )
  }

  // Transform data for candlestick chart
  const candlestickData = useMemo(() => data.map((item) => ({
    time: Math.floor(new Date(item.date).getTime() / 1000) as any,
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
  })), [data])

  // Transform data for line/area chart (close prices)
  const lineData = useMemo(() => data.map((item) => ({
    time: Math.floor(new Date(item.date).getTime() / 1000) as any,
    value: item.close,
  })), [data])

  // Transform data for volume histogram
  const volumeData = useMemo(() => data
    .map((item) => ({
      time: Math.floor(new Date(item.date).getTime() / 1000) as any,
      value: item.volume,
      color: item.close >= item.open ? "rgba(34, 197, 94, 0.5)" : "rgba(239, 68, 68, 0.5)",
    }))
    .filter((item) => item.value != null && !isNaN(item.value) && item.value > 0), [data])

  // Calculate technical indicators
  const indicatorData = useMemo(() => {
    const closes = data.map(d => d.close)
    const highs = data.map(d => d.high)
    const lows = data.map(d => d.low)
    const volumes = data.map(d => d.volume)
    const times = data.map(d => Math.floor(new Date(d.date).getTime() / 1000) as any)

    try {
      switch (selectedIndicator) {
        case "rsi": {
          const rsiValues = rsi(closes, { period: 14 })
          return {
            type: "line" as const,
            data: rsiValues
              .map((value: any, idx: any) => ({
                time: times[idx + (closes.length - rsiValues.length)],
                value: value
              }))
              .filter((item: any) => item.value != null && !isNaN(item.value)),
            options: { color: "#2196F3", lineWidth: 2 as any },
            name: "RSI (14)"
          }
        }
        case "macd": {
          const macdResult = macd(closes, { fast: 12, slow: 26, signal: 9 })

          // Filter out null/undefined values from both arrays first
          const timeOffset = closes.length - macdResult.macdLine.length

          // Build arrays with valid indices only
          const validDataPoints: any[] = []
          macdResult.macdLine.forEach((macdValue: any, idx: any) => {
            const signalValue = macdResult.signalLine[idx]
            if (macdValue != null && !isNaN(macdValue) && signalValue != null && !isNaN(signalValue)) {
              validDataPoints.push({
                idx: idx,
                time: times[idx + timeOffset],
                macd: macdValue,
                signal: signalValue,
                histogram: macdValue - signalValue
              })
            }
          })

          return {
            type: "macd" as const,
            data: {
              macd: validDataPoints.map(p => ({ time: p.time, value: p.macd })),
              signal: validDataPoints.map(p => ({ time: p.time, value: p.signal })),
              histogram: validDataPoints.map(p => ({
                time: p.time,
                value: p.histogram,
                color: p.histogram >= 0 ? "rgba(34, 197, 94, 0.5)" : "rgba(239, 68, 68, 0.5)"
              }))
            },
            name: "MACD (12, 26, 9)"
          }
        }
        case "atr": {
          const atrResult = atr(highs, lows, closes, { period: 14 })
          return {
            type: "line" as const,
            data: atrResult.atrLine
              .map((value: any, idx: any) => ({
                time: times[idx + (closes.length - atrResult.atrLine.length)],
                value: value
              }))
              .filter((item: any) => item.value != null && !isNaN(item.value)),
            options: { color: "#FF9800", lineWidth: 2 as any },
            name: "ATR (14)"
          }
        }
        case "stochastic": {
          const stochResult = stochasticOscillator(highs, lows, closes, { kPeriod: 14, dPeriod: 3 })
          return {
            type: "stochastic" as const,
            data: {
              k: stochResult.k
                .map((value: any, idx: any) => ({
                  time: times[idx + (closes.length - stochResult.k.length)],
                  value: value
                }))
                .filter((item: any) => item.value != null && !isNaN(item.value)),
              d: stochResult.d
                .map((value: any, idx: any) => ({
                  time: times[idx + (closes.length - stochResult.d.length)],
                  value: value
                }))
                .filter((item: any) => item.value != null && !isNaN(item.value))
            },
            name: "Stochastic (14, 3)"
          }
        }
        case "cci": {
          const cciValues = cci(highs, lows, closes, { period: 20 })
          return {
            type: "line" as const,
            data: cciValues
              .map((value: any, idx: any) => ({
                time: times[idx + (closes.length - cciValues.length)],
                value: value
              }))
              .filter((item: any) => item.value != null && !isNaN(item.value)),
            options: { color: "#9C27B0", lineWidth: 2 as any },
            name: "CCI (20)"
          }
        }
        case "obv": {
          const obvValues = obv(closes, volumes)
          return {
            type: "line" as const,
            data: obvValues
              .map((value: any, idx: any) => ({
                time: times[idx],
                value: value
              }))
              .filter((item: any) => item.value != null && !isNaN(item.value)),
            options: { color: "#4CAF50", lineWidth: 2 as any },
            name: "OBV"
          }
        }
        default:
          return null
      }
    } catch (error) {
      console.error("Error calculating indicator:", error)
      return null
    }
  }, [data, selectedIndicator])

  const chartOptions = {
    layout: {
      background: { color: "transparent" },
      textColor: "#888888",
    },
    grid: {
      vertLines: { color: "#2a2a2a" },
      horzLines: { color: "#2a2a2a" },
    },
    crosshair: {
      mode: 1,
    },
    height: 500,
  }

  const candlestickOptions = {
    upColor: "#22c55e",
    downColor: "#ef4444",
    borderUpColor: "#22c55e",
    borderDownColor: "#ef4444",
    wickUpColor: "#22c55e",
    wickDownColor: "#ef4444",
  }

  const indicators = [
    { value: "none", label: "None" },
    { value: "rsi", label: "RSI" },
    { value: "macd", label: "MACD" },
    { value: "atr", label: "ATR" },
    { value: "stochastic", label: "Stochastic" },
    { value: "cci", label: "CCI" },
    { value: "obv", label: "OBV" },
  ]

  const chartTypes = [
    { value: "candlestick", label: "Candlestick" },
    { value: "line", label: "Line" },
    { value: "area", label: "Area" },
  ]

  const ranges = [
    { value: "1d", label: "1D", interval: "5m" },
    { value: "5d", label: "5D", interval: "15m" },
    { value: "1mo", label: "1M", interval: "1h" },
    { value: "6mo", label: "6M", interval: "1d" },
    { value: "1y", label: "1Y", interval: "1d" },
    { value: "5y", label: "5Y", interval: "1wk" },
  ]

  const handleRangeChange = (range: string, interval: string) => {
    setSelectedRange(range)
    if (onRangeChange) {
      onRangeChange(range, interval)
    }
  }

  // Convert trade signals to markers format
  const markers = useMemo(() => {
    if (!tradeSignals || tradeSignals.length === 0) return []

    return tradeSignals.map(signal => ({
      time: signal.time as any,
      position: signal.action === 'BUY' ? 'belowBar' : 'aboveBar' as any,
      color: signal.action === 'BUY' ? '#22c55e' : '#ef4444',
      shape: signal.action === 'BUY' ? 'arrowUp' : 'arrowDown' as any,
      text: signal.action,
    }))
  }, [tradeSignals])

  // Set markers on the active series
  useEffect(() => {
    let activeSeries: any = null

    if (chartType === 'candlestick' && candlestickSeriesRef.current) {
      activeSeries = candlestickSeriesRef.current
    } else if (chartType === 'line' && lineSeriesRef.current) {
      activeSeries = lineSeriesRef.current
    } else if (chartType === 'area' && areaSeriesRef.current) {
      activeSeries = areaSeriesRef.current
    }

    if (activeSeries && markers.length > 0) {
      try {
        activeSeries.setMarkers(markers)
      } catch (error) {
        console.error('Error setting markers:', error)
      }
    }
  }, [markers, chartType, candlestickSeriesRef.current, lineSeriesRef.current, areaSeriesRef.current])

  return (
    <div className="w-full space-y-4">
      {/* Chart Controls - Reorganized Layout */}
      <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border">
        {/* Top Row: Time Range + Chart Type */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Time Range Controls */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-muted-foreground mr-1">Range:</span>
            {ranges.map((range) => (
              <Button
                key={range.value}
                variant={selectedRange === range.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleRangeChange(range.value, range.interval)}
              >
                {range.label}
              </Button>
            ))}
          </div>

          {/* Chart Type Controls */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-muted-foreground mr-1">Type:</span>
            {chartTypes.map((type) => (
              <Button
                key={type.value}
                variant={chartType === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType(type.value as ChartType)}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Bottom Row: Indicators + Volume Toggle */}
        <div className="flex flex-wrap gap-2 items-center justify-between pt-2 border-t border-border/50">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-muted-foreground mr-1">Indicator:</span>
            {indicators.map((indicator) => (
              <Button
                key={indicator.value}
                variant={selectedIndicator === indicator.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedIndicator(indicator.value as IndicatorType)}
              >
                {indicator.label}
              </Button>
            ))}
          </div>
          <Button
            variant={showVolume ? "default" : "outline"}
            size="sm"
            onClick={() => setShowVolume(!showVolume)}
          >
            {showVolume ? "Hide" : "Show"} Volume
          </Button>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <Chart
          key={`chart-${showVolume}-${selectedIndicator}-${chartType}`}
          options={chartOptions}
        >
        {/* Main price pane */}
        <Pane stretchFactor={3}>
          {chartType === "candlestick" && (
            <CandlestickSeries
              ref={candlestickSeriesRef}
              data={candlestickData}
              options={candlestickOptions}
              reactive
            />
          )}
          {chartType === "line" && (
            <LineSeries
              ref={lineSeriesRef}
              data={lineData}
              options={{
                color: "#2196F3",
                lineWidth: 2 as any
              }}
              reactive
            />
          )}
          {chartType === "area" && (
            <AreaSeries
              ref={areaSeriesRef}
              data={lineData}
              options={{
                topColor: "rgba(33, 150, 243, 0.4)",
                bottomColor: "rgba(33, 150, 243, 0.0)",
                lineColor: "#2196F3",
                lineWidth: 2 as any
              }}
              reactive
            />
          )}
        </Pane>

        {/* Volume pane (conditional) */}
        {showVolume && (
          <Pane stretchFactor={1}>
            <HistogramSeries
              data={volumeData}
              options={{
                priceFormat: { type: "volume" },
              }}
              reactive
            />
          </Pane>
        )}

        {/* Indicator pane (conditional) */}
        {indicatorData && indicatorData.type === "line" && (
          <Pane stretchFactor={1}>
            <LineSeries
              data={indicatorData.data}
              options={indicatorData.options}
              reactive
            />
          </Pane>
        )}

        {indicatorData && indicatorData.type === "macd" && (
          <Pane stretchFactor={1}>
            <LineSeries
              data={indicatorData.data.macd}
              options={{ color: "#2196F3", lineWidth: 2 as any }}
              reactive
            />
            <LineSeries
              data={indicatorData.data.signal}
              options={{ color: "#FF9800", lineWidth: 2 as any }}
              reactive
            />
            <HistogramSeries
              data={indicatorData.data.histogram}
              reactive
            />
          </Pane>
        )}

        {indicatorData && indicatorData.type === "stochastic" && (
          <Pane stretchFactor={1}>
            <LineSeries
              data={indicatorData.data.k}
              options={{ color: "#2196F3", lineWidth: 2 as any }}
              reactive
            />
            <LineSeries
              data={indicatorData.data.d}
              options={{ color: "#FF9800", lineWidth: 2 as any }}
              reactive
            />
          </Pane>
        )}

        <TimeScale>
          <TimeScaleFitContentTrigger deps={[data.length, selectedIndicator, showVolume, chartType]} />
        </TimeScale>
      </Chart>

     
    </div>

      {/* Indicator info */}
      {indicatorData && selectedIndicator !== "none" && (
        <div className="text-xs text-muted-foreground">
          Currently showing: <span className="font-medium">{indicatorData.name}</span>
        </div>
      )}
    </div>
  )
}
