import { ChatGroq } from "@langchain/groq"

interface MarketData {
  question: string
  description?: string
  currentYesPrice: number
  currentNoPrice: number
  volume24hr?: number
  volumeTotal?: number
  tags?: string[]
}

interface DebateAnalysis {
  yesArguments: string[]
  noArguments: string[]
  yesSummary: string
  noSummary: string
  keyFactors: string[]
  uncertainties: string[]
}

function buildPrompt(marketData: MarketData, strict: boolean): string {
  const base = `You are an expert analyst tasked with providing a balanced debate analysis for a prediction market question.

Market Question: ${marketData.question}
${marketData.description ? `Description: ${marketData.description}` : ""}

Current Market Odds:
- YES: ${(marketData.currentYesPrice * 100).toFixed(1)}%
- NO: ${(marketData.currentNoPrice * 100).toFixed(1)}%

${marketData.volume24hr ? `24h Volume: $${marketData.volume24hr.toLocaleString()}` : ""}
${marketData.volumeTotal ? `Total Volume: $${marketData.volumeTotal.toLocaleString()}` : ""}

Please provide a comprehensive debate analysis with arguments for BOTH sides. Respond with valid JSON in this format:

{
  "yesArguments": ["argument 1", "argument 2", "argument 3"],
  "noArguments": ["argument 1", "argument 2", "argument 3"],
  "yesSummary": "2-3 sentence summary",
  "noSummary": "2-3 sentence summary",
  "keyFactors": ["factor 1", "factor 2", "factor 3"],
  "uncertainties": ["uncertainty 1", "uncertainty 2"]
}

Guidelines:
1. Be intellectually honest and balanced - present the strongest arguments for BOTH sides
2. Base arguments on facts, data, historical precedent, and logical reasoning
3. Consider expert opinions, statistical trends, and real-world constraints
4. Identify genuine uncertainties rather than taking a definitive stance
5. Each argument should be specific and substantive (2-3 sentences)
6. Key factors should be concrete, measurable events or conditions
7. Focus on factors that are actually relevant to the prediction timeframe
8. Avoid bias toward the current market price
`
  return strict
    ? base + "\nReturn ONLY the JSON object, with no additional text or explanation."
    : base
}

async function callGroqAsJson(
  prompt: string,
  apiKey?: string,
  {
    model = "llama-3.3-70b-versatile",
    temperature = 0.7,
  }: { model?: string; temperature?: number } = {}
): Promise<DebateAnalysis> {
  const llm = new ChatGroq({
    apiKey: apiKey || process.env.GROQ_API_KEY,
    model,
    temperature,
  }) // [web:2][web:21]

  const aiMsg = await llm.invoke(
    [
      {
        role: "system",
        content:
          "You are an expert analyst who provides balanced, fact-based debate analysis. Always respond with valid JSON matching the requested schema.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    // Pass JSON mode as call options instead of using bind().
    {
      response_format: { type: "json_object" },
    } as any
  ) // [web:2][web:13]

  // ChatGroq returns an AIMessage whose content can be string or array. [web:25][web:57]
  const rawContent =
    typeof aiMsg.content === "string"
      ? aiMsg.content
      : Array.isArray(aiMsg.content)
      ? aiMsg.content.map((c: any) => c?.text ?? "").join("")
      : String(aiMsg.content)

  let jsonText = rawContent.trim()


  try {
    const parsed = JSON.parse(jsonText)

    if (
      !parsed.yesArguments ||
      !parsed.noArguments ||
      !parsed.yesSummary ||
      !parsed.noSummary ||
      !parsed.keyFactors ||
      !parsed.uncertainties
    ) {
      throw new Error("Missing required fields in analysis")
    }

    return parsed as DebateAnalysis
  } catch (error) {
    console.error("Failed to parse Groq response:", error)
    console.error("Raw response:", jsonText)
    throw new Error(`Failed to parse LLM response: ${error}`)
  }
}

export async function generateDebateAnalysis(
  marketData: MarketData,
  apiKey?: string
): Promise<DebateAnalysis> {
  const prompt = buildPrompt(marketData, true)
  return callGroqAsJson(prompt, apiKey, {
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
  })
}

export async function generateDebateAnalysisWithOpenAI(
  marketData: MarketData,
  apiKey?: string
): Promise<DebateAnalysis> {
  const prompt = buildPrompt(marketData, false)
  return callGroqAsJson(prompt, apiKey, {
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
  })
}
