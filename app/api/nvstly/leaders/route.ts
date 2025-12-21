import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const leadersFilePath = path.join(process.cwd(), 'data', 'leaders.json')

    // Check if file exists
    try {
      await fs.access(leadersFilePath)
    } catch {
      // If file doesn't exist, return empty array
      return NextResponse.json({
        success: true,
        data: []
      })
    }

    const fileContent = await fs.readFile(leadersFilePath, 'utf-8')
    const leaders = JSON.parse(fileContent)

    return NextResponse.json({
      success: true,
      data: leaders
    })
  } catch (error: any) {
    console.error('Failed to fetch NVSTLY leaders:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch leaders' },
      { status: 500 }
    )
  }
}
