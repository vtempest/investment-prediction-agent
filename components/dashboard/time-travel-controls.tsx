"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Clock, RotateCcw, FastForward, Calendar } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface TimeTravelControlsProps {
  portfolioId?: string
  onTimeTravelComplete?: () => void
}

export function TimeTravelControls({
  portfolioId,
  onTimeTravelComplete,
}: TimeTravelControlsProps) {
  const { toast } = useToast()
  const [portfolios, setPortfolios] = useState<any[]>([])
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>(
    portfolioId || ""
  )
  const [targetDate, setTargetDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentSimDate, setCurrentSimDate] = useState<Date | null>(null)
  const [timeTravelEnabled, setTimeTravelEnabled] = useState(false)

  // Quick presets
  const presets = [
    { label: "2010 (Financial Crisis Recovery)", value: "2010-01-01" },
    { label: "2015 (Bull Market)", value: "2015-01-01" },
    { label: "2020 (COVID Crash)", value: "2020-03-01" },
    { label: "2021 (Meme Stock Era)", value: "2021-01-01" },
    { label: "2022 (Bear Market)", value: "2022-01-01" },
    { label: "2023 (AI Boom)", value: "2023-01-01" },
    { label: "2024 (Current Year)", value: "2024-01-01" },
  ]

  useEffect(() => {
    fetchPortfolios()
  }, [])

  useEffect(() => {
    if (selectedPortfolio) {
      fetchPortfolioDetails()
    }
  }, [selectedPortfolio])

  const fetchPortfolios = async () => {
    try {
      const response = await fetch("/api/portfolios")
      const data = await response.json()
      setPortfolios(data.portfolios || [])

      // Auto-select active portfolio or first one
      const activePortfolio = data.portfolios?.find((p: any) => p.isActive)
      if (activePortfolio && !portfolioId) {
        setSelectedPortfolio(activePortfolio.id)
      } else if (data.portfolios?.length > 0 && !selectedPortfolio) {
        setSelectedPortfolio(data.portfolios[0].id)
      }
    } catch (error) {
      console.error("Error fetching portfolios:", error)
    }
  }

  const fetchPortfolioDetails = async () => {
    if (!selectedPortfolio) return

    try {
      const response = await fetch(`/api/portfolios/${selectedPortfolio}`)
      const data = await response.json()
      if (data.portfolio) {
        setTimeTravelEnabled(data.portfolio.timeTravelEnabled)
        setCurrentSimDate(
          data.portfolio.simulationDate
            ? new Date(data.portfolio.simulationDate)
            : null
        )
      }
    } catch (error) {
      console.error("Error fetching portfolio details:", error)
    }
  }

  const timeTravel = async (reset: boolean = false) => {
    if (!selectedPortfolio) {
      toast({
        title: "No Portfolio Selected",
        description: "Please select a portfolio first",
        variant: "destructive",
      })
      return
    }

    if (!targetDate) {
      toast({
        title: "No Date Selected",
        description: "Please select a target date",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        `/api/portfolios/${selectedPortfolio}/time-travel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            targetDate,
            reset,
          }),
        }
      )

      const data = await response.json()

      if (data.portfolio) {
        toast({
          title: "Time Travel Successful",
          description: data.message,
        })
        fetchPortfolioDetails()
        onTimeTravelComplete?.()
      } else {
        toast({
          title: "Time Travel Failed",
          description: data.error || "Failed to time travel",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to time travel",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleTimeTravel = async (enabled: boolean) => {
    if (!selectedPortfolio) return

    try {
      const response = await fetch(`/api/portfolios/${selectedPortfolio}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timeTravelEnabled: enabled,
          simulationDate: enabled ? targetDate || new Date() : null,
        }),
      })

      const data = await response.json()

      if (data.portfolio) {
        toast({
          title: "Time Travel Mode",
          description: `Time travel ${enabled ? "enabled" : "disabled"}`,
        })
        fetchPortfolioDetails()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle time travel",
        variant: "destructive",
      })
    }
  }

  const currentPortfolio = portfolios.find((p) => p.id === selectedPortfolio)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Time Travel Controls
        </CardTitle>
        <CardDescription>
          Travel back in time to test strategies with historical data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Portfolio Selector */}
        <div className="space-y-2">
          <Label>Portfolio</Label>
          <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
            <SelectTrigger>
              <SelectValue placeholder="Select portfolio" />
            </SelectTrigger>
            <SelectContent>
              {portfolios.map((portfolio) => (
                <SelectItem key={portfolio.id} value={portfolio.id}>
                  {portfolio.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Current Simulation Status */}
        {currentPortfolio && (
          <div className="p-3 bg-muted rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="tt-enabled">Time Travel Mode</Label>
              <Switch
                id="tt-enabled"
                checked={timeTravelEnabled}
                onCheckedChange={toggleTimeTravel}
              />
            </div>
            {currentSimDate && timeTravelEnabled && (
              <div className="text-sm">
                <span className="text-muted-foreground">Current Date:</span>
                <span className="ml-2 font-medium">
                  {currentSimDate.toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="text-sm">
              <span className="text-muted-foreground">Portfolio Created:</span>
              <span className="ml-2 font-medium">
                {new Date(currentPortfolio.startDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {/* Quick Presets */}
        <div className="space-y-2">
          <Label>Quick Presets</Label>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.value}
                variant="outline"
                size="sm"
                onClick={() => setTargetDate(preset.value)}
                className={targetDate === preset.value ? "border-primary" : ""}
              >
                {preset.label.split(" (")[0]}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Date */}
        <div className="space-y-2">
          <Label>Custom Date</Label>
          <Input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            onClick={() => timeTravel(false)}
            disabled={loading || !targetDate || !selectedPortfolio}
            className="w-full"
          >
            <FastForward className="mr-2 h-4 w-4" />
            Jump to Date
          </Button>
          <Button
            onClick={() => timeTravel(true)}
            disabled={loading || !targetDate || !selectedPortfolio}
            variant="destructive"
            className="w-full"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset & Jump
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <p>
            <strong>Jump to Date:</strong> Recalculate portfolio state based on trades up
            to that date
          </p>
          <p>
            <strong>Reset & Jump:</strong> Clear all trades and reset portfolio to
            initial state at that date
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
