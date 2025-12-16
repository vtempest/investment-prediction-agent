"use client"

import { MultiChartView } from "@/components/dashboard/multi-chart-view"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ChartsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Multi-Chart Analysis</CardTitle>
          <CardDescription>
            Compare multiple stocks side-by-side with synchronized scrolling and crosshair
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MultiChartView initialSymbol="AAPL" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Add multiple chart tabs by entering a stock symbol</li>
            <li>Close tabs with the X button (minimum 1 tab required)</li>
            <li>Toggle between side-by-side (horizontal) and top/bottom (vertical) layouts</li>
            <li>Enable/disable synchronized scrolling and crosshair between charts</li>
            <li>Zoom and pan on one chart, and watch the other follow in real-time</li>
            <li>Hover over one chart to see the crosshair position on the other</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
