import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userSettings } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await db.query.userSettings.findFirst({
      where: eq(userSettings.userId, session.user.id),
    });

    // Return settings without sensitive data exposed (masked)
    if (settings) {
      return NextResponse.json({
        ...settings,
        // Mask API keys for security
        groqApiKey: settings.groqApiKey ? "••••••••" : null,
        openaiApiKey: settings.openaiApiKey ? "••••••••" : null,
        anthropicApiKey: settings.anthropicApiKey ? "••••••••" : null,
        xaiApiKey: settings.xaiApiKey ? "••••••••" : null,
        googleApiKey: settings.googleApiKey ? "••••••••" : null,
        togetheraiApiKey: settings.togetheraiApiKey ? "••••••••" : null,
        perplexityApiKey: settings.perplexityApiKey ? "••••••••" : null,
        cloudflareApiKey: settings.cloudflareApiKey ? "••••••••" : null,
        alpacaApiKey: settings.alpacaApiKey ? "••••••••" : null,
        alpacaApiSecret: settings.alpacaApiSecret ? "••••••••" : null,
        webullPassword: settings.webullPassword ? "••••••••" : null,
        robinhoodPassword: settings.robinhoodPassword ? "••••••••" : null,
        ibkrPassword: settings.ibkrPassword ? "••••••••" : null,
        alphaVantageApiKey: settings.alphaVantageApiKey ? "••••••••" : null,
        finnhubApiKey: settings.finnhubApiKey ? "••••••••" : null,
        polygonApiKey: settings.polygonApiKey ? "••••••••" : null,
      });
    }

    return NextResponse.json(null);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Check if settings exist
    const existing = await db.query.userSettings.findFirst({
      where: eq(userSettings.userId, session.user.id),
    });

    const now = new Date();

    if (existing) {
      // Update existing settings
      await db
        .update(userSettings)
        .set({
          ...body,
          updatedAt: now,
        })
        .where(eq(userSettings.userId, session.user.id));
    } else {
      // Create new settings
      await db.insert(userSettings).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        ...body,
        createdAt: now,
        updatedAt: now,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
