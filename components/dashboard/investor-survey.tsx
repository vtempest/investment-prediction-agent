"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const SECTIONS = [
  { id: 1, title: "Investor Profile & Experience", questions: [1, 2, 3, 4] },
  { id: 2, title: "Prediction Markets & Event-Driven Trading", questions: [5, 6, 7, 8] },
  { id: 3, title: "AI & Multi-Agent Trading Systems", questions: [9, 10, 11, 12] },
  { id: 4, title: "Copy Trading & Signal Following", questions: [13, 14, 15] },
  { id: 5, title: "Risk Management & Performance", questions: [16, 17, 18] },
  { id: 6, title: "Pricing & Commercial Model", questions: [19, 20, 21] },
  { id: 7, title: "Regulatory & Compliance", questions: [22, 23] },
]

export default function InvestorSurvey() {
  const router = useRouter()
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    setResponses((prev) => {
      const current = prev[questionId] || []
      if (checked) {
        return { ...prev, [questionId]: [...current, option] }
      }
      return { ...prev, [questionId]: current.filter((item: string) => item !== option) }
    })
  }

  const handleRatingChange = (questionId: string, subQuestion: string, value: number) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || {}),
        [subQuestion]: value,
      },
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Contact information
          name: responses.name,
          email: responses.email,
          phone: responses.phone,
          organization: responses.organization,
          contactMethod: responses.contactMethod,

          // Section 1: Investor Profile & Experience
          investorType: responses.q1,
          aum: responses.q2,
          tradingExperience: responses.q3,
          algorithmicPercentage: responses.q4,

          // Section 2: Prediction Markets & Event-Driven Trading
          predictionMarketFamiliarity: responses.q5,
          predictionMarketValue: responses.q6,
          eventInterests: responses.q7,
          predictionMarketComfort: responses.q8,

          // Section 3: AI & Multi-Agent Trading Systems
          aiView: responses.q9,
          explainabilityImportance: responses.q10,
          aiCapabilitiesRanking: responses.q11,
          aiBiggestConcern: responses.q12,

          // Section 4: Copy Trading & Signal Following
          copyTradingInterest: responses.q13,
          copyTradingTransparency: responses.q14,
          signalDeliveryPreference: responses.q15,

          // Section 5: Risk Management & Performance
          returnExpectation: responses.q16,
          maxDrawdown: responses.q17,
          riskManagementFeatures: responses.q18,

          // Section 6: Pricing & Commercial Model
          pricingModel: responses.q19,
          subscriptionRange: responses.q20,
          performanceFee: responses.q21,

          // Section 7: Regulatory & Compliance
          regulatoryImportance: responses.q22,
          dueDiligenceRequired: responses.q23,

          // Section 8: Interest & Next Steps
          overallInterest: responses.overallInterest,
          additionalComments: responses.additionalComments,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit survey")
      }

      setSubmitSuccess(true)

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" })

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      console.error("[v0] Error submitting survey:", error)
      alert("Failed to submit survey. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {submitSuccess && (
          <Card className="mb-8 backdrop-blur-sm bg-green-50/80 border-green-200/40 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-green-900">Thank You!</h2>
                <p className="text-green-800">Your survey has been successfully submitted. We'll be in touch soon!</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-8">
          {/* Section 1: Investor Profile & Experience */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/40 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-balance">Investor Profile & Experience</CardTitle>
              <CardDescription>Help us understand your investment background and approach.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <QuestionRadio
                id="q1"
                question="Q1. What best describes your primary role or organization type?"
                options={[
                  "Hedge Fund / Multi-Strategy Fund",
                  "Family Office / Private Wealth Manager",
                  "Proprietary Trading Firm",
                  "Institutional Asset Manager (Pension, Endowment, Insurance)",
                  "Registered Investment Advisor (RIA)",
                  "High-Net-Worth Individual Investor",
                ]}
                value={responses.q1}
                onChange={(value) => handleResponseChange("q1", value)}
                hasOther
              />

              <QuestionRadio
                id="q2"
                question="Q2. What is your approximate total Assets Under Management (AUM) or personal investment portfolio size?"
                options={[
                  "Under $1 million",
                  "$1 million – $10 million",
                  "$10 million – $100 million",
                  "$100 million – $500 million",
                  "$500 million – $1 billion",
                  "Over $1 billion",
                ]}
                value={responses.q2}
                onChange={(value) => handleResponseChange("q2", value)}
              />

              <QuestionRadio
                id="q3"
                question="Q3. How many years of experience do you have with algorithmic or systematic trading strategies?"
                options={["No prior experience", "Less than 2 years", "2–5 years", "5–10 years", "More than 10 years"]}
                value={responses.q3}
                onChange={(value) => handleResponseChange("q3", value)}
              />

              <QuestionRadio
                id="q4"
                question="Q4. What percentage of your current portfolio utilizes algorithmic or automated trading strategies?"
                options={["0% (None)", "1–25%", "26–50%", "51–75%", "76–100%"]}
                value={responses.q4}
                onChange={(value) => handleResponseChange("q4", value)}
              />
            </CardContent>
          </Card>

          {/* Section 2: Prediction Markets & Event-Driven Trading */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/40 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-balance">Prediction Markets & Event-Driven Trading</CardTitle>
              <CardDescription>Your perspective on prediction markets and event-based strategies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <QuestionRadio
                id="q5"
                question="Q5. How familiar are you with prediction markets (e.g., Polymarket, Kalshi) as an asset class or information source?"
                options={[
                  "Not at all familiar",
                  "Somewhat familiar – I have heard of them but never used them",
                  "Moderately familiar – I have researched or monitored prediction markets",
                  "Very familiar – I actively trade or monitor prediction markets",
                  "Expert – I regularly use prediction market data in my investment process",
                ]}
                value={responses.q5}
                onChange={(value) => handleResponseChange("q5", value)}
              />

              <QuestionRadio
                id="q6"
                question="Q6. How valuable do you consider prediction market data (event probabilities, odds movements) as trading signals for equities or ETFs?"
                options={[
                  "Not valuable at all",
                  "Slightly valuable – limited utility",
                  "Moderately valuable – useful as a supplementary data source",
                  "Very valuable – a key input for certain strategies",
                  "Extremely valuable – a primary driver of trading decisions",
                ]}
                value={responses.q6}
                onChange={(value) => handleResponseChange("q6", value)}
              />

              <QuestionCheckbox
                id="q7"
                question="Q7. Which types of events would you be most interested in receiving trading signals for? (Select all that apply)"
                options={[
                  "Macroeconomic announcements (Federal Reserve decisions, inflation data, GDP)",
                  "Political/Geopolitical events (elections, trade policy, regulatory changes)",
                  "Corporate events (earnings, M&A, product launches)",
                  "Market structure events (VIX spikes, liquidity shifts, sector rotations)",
                  "Cryptocurrency and blockchain-related events",
                ]}
                values={responses.q7 || []}
                onChange={(option, checked) => handleCheckboxChange("q7", option, checked)}
                hasOther
              />

              <QuestionRadio
                id="q8"
                question="Q8. How comfortable are you with trading strategies that incorporate prediction market probabilities as primary inputs?"
                options={[
                  "Very uncomfortable – I would not consider this approach",
                  "Somewhat uncomfortable – I need significant validation before considering",
                  "Neutral – I am open to evaluating this approach",
                  "Somewhat comfortable – I see potential value in this approach",
                  "Very comfortable – I already incorporate similar data sources",
                ]}
                value={responses.q8}
                onChange={(value) => handleResponseChange("q8", value)}
              />
            </CardContent>
          </Card>

          {/* Section 3: AI & Multi-Agent Trading Systems */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/40 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-balance">AI & Multi-Agent Trading Systems</CardTitle>
              <CardDescription>Your views on artificial intelligence in investment management.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <QuestionRadio
                id="q9"
                question="Q9. How do you currently view AI/machine learning applications in investment decision-making?"
                options={[
                  "Skeptical – I prefer traditional fundamental/technical analysis",
                  "Cautious – I see potential but have concerns about reliability and transparency",
                  "Open-minded – I am exploring AI tools as a complement to existing strategies",
                  "Positive – I actively use AI-driven insights in my investment process",
                  "Highly confident – AI is central to my investment strategy",
                ]}
                value={responses.q9}
                onChange={(value) => handleResponseChange("q9", value)}
              />

              <QuestionRadio
                id="q10"
                question="Q10. How important is explainability and transparency in AI-generated trading signals to you?"
                options={[
                  "Not important – I only care about performance results",
                  "Slightly important – I prefer some explanation but focus on outcomes",
                  "Moderately important – I want to understand the general methodology",
                  "Very important – I require detailed explanations of how signals are generated",
                  "Critical – I will not use any system without full transparency into the logic",
                ]}
                value={responses.q10}
                onChange={(value) => handleResponseChange("q10", value)}
              />

              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Q11. Which AI-driven trading capabilities would be most valuable to your investment process? (Rank
                  1-5, with 1 being most valuable)
                </Label>
                <div className="space-y-4 pl-4">
                  {[
                    "Real-time sentiment analysis of news and social media",
                    "Multi-agent debate systems (Bull vs. Bear AI analysis)",
                    "Technical pattern recognition and signal generation",
                    "Prediction market arbitrage identification",
                    "Portfolio risk management and position sizing recommendations",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between gap-4">
                      <Label className="text-sm flex-1">{item}</Label>
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        className="w-20 bg-white/80"
                        value={responses.q11?.[`option${index}`] || ""}
                        onChange={(e) => handleRatingChange("q11", `option${index}`, Number.parseInt(e.target.value))}
                        placeholder="1-5"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <QuestionRadio
                id="q12"
                question="Q12. What is your biggest concern about using AI-powered trading platforms?"
                options={[
                  'Lack of transparency / "black box" risk',
                  "Regulatory uncertainty",
                  "Over-reliance on historical data patterns that may not repeat",
                  "Technology/infrastructure reliability",
                  "Difficulty integrating with existing systems and workflows",
                ]}
                value={responses.q12}
                onChange={(value) => handleResponseChange("q12", value)}
                hasOther
              />
            </CardContent>
          </Card>

          {/* Section 4: Copy Trading & Signal Following */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/40 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-balance">Copy Trading & Signal Following</CardTitle>
              <CardDescription>Interest in following successful traders and receiving signals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <QuestionRadio
                id="q13"
                question="Q13. How interested would you be in a feature that allows you to copy trades from top-performing traders on prediction markets?"
                options={[
                  "Not interested",
                  "Slightly interested – would consider for a small allocation",
                  "Moderately interested – would allocate a meaningful portion",
                  "Very interested – this is a compelling feature",
                  "Extremely interested – this would be a primary reason to use the platform",
                ]}
                value={responses.q13}
                onChange={(value) => handleResponseChange("q13", value)}
              />

              <QuestionRadio
                id="q14"
                question="Q14. What level of transparency would you require to copy another trader's positions?"
                options={[
                  "Basic – overall track record and win rate is sufficient",
                  "Moderate – I want to see historical positions and strategy description",
                  "Detailed – I require full trade history, risk metrics, and drawdown analysis",
                  "Complete – I need real-time position updates and risk exposure monitoring",
                  "I would not copy trades regardless of transparency offered",
                ]}
                value={responses.q14}
                onChange={(value) => handleResponseChange("q14", value)}
              />

              <QuestionCheckbox
                id="q15"
                question="Q15. How would you prefer to receive high-conviction trading signals?"
                options={[
                  "Mobile push notifications",
                  "Email alerts",
                  "Dashboard/platform interface only",
                  "API integration with my existing trading systems",
                  "Telegram/Discord bot notifications",
                  "All of the above",
                ]}
                values={responses.q15 || []}
                onChange={(option, checked) => handleCheckboxChange("q15", option, checked)}
              />
            </CardContent>
          </Card>

          {/* Section 5: Risk Management & Performance */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/40 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-balance">Risk Management & Performance</CardTitle>
              <CardDescription>Your expectations for returns and risk management features.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <QuestionRadio
                id="q16"
                question="Q16. What is your target annual return expectation for an AI-driven, event-based trading strategy?"
                options={[
                  "5–10% (capital preservation focus)",
                  "10–20% (moderate growth)",
                  "20–40% (aggressive growth)",
                  "40%+ (high-risk, high-reward)",
                  "Return is secondary to risk-adjusted metrics (Sharpe ratio, max drawdown)",
                ]}
                value={responses.q16}
                onChange={(value) => handleResponseChange("q16", value)}
              />

              <QuestionRadio
                id="q17"
                question="Q17. What maximum drawdown would you consider acceptable for this type of strategy?"
                options={[
                  "Less than 5%",
                  "5–10%",
                  "10–20%",
                  "20–30%",
                  "Greater than 30% if upside potential justifies it",
                ]}
                value={responses.q17}
                onChange={(value) => handleResponseChange("q17", value)}
              />

              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Q18. How important are the following risk management features to you? (Rate 1-5: 1=Not Important,
                  5=Critical)
                </Label>
                <div className="space-y-4 pl-4">
                  {[
                    "Automated stop-loss execution",
                    "Portfolio correlation analysis (diversification metrics)",
                    "Real-time volatility monitoring and position sizing",
                    "Stress testing and scenario analysis tools",
                    "Regulatory compliance and audit trail",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between gap-4">
                      <Label className="text-sm flex-1">{item}</Label>
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        className="w-20 bg-white/80"
                        value={responses.q18?.[`option${index}`] || ""}
                        onChange={(e) => handleRatingChange("q18", `option${index}`, Number.parseInt(e.target.value))}
                        placeholder="1-5"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 6: Pricing & Commercial Model */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/40 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-balance">Pricing & Commercial Model</CardTitle>
              <CardDescription>Your preferences for pricing structure and fee models.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <QuestionRadio
                id="q19"
                question="Q19. Which pricing model would you prefer for an AI-powered trading signal platform?"
                options={[
                  "Flat monthly subscription (predictable cost, no performance fees)",
                  "Performance-based fee only (percentage of net gains)",
                  "Hybrid model (lower subscription + performance fee)",
                  "Per-signal or per-trade fee structure",
                  "Enterprise/custom pricing based on AUM or usage",
                ]}
                value={responses.q19}
                onChange={(value) => handleResponseChange("q19", value)}
              />

              <QuestionRadio
                id="q20"
                question="Q20. What monthly subscription range would you consider reasonable for institutional-grade AI trading signals?"
                options={[
                  "Under $100/month",
                  "$100–$500/month",
                  "$500–$2,000/month",
                  "$2,000–$5,000/month",
                  "$5,000+/month (enterprise tier)",
                ]}
                value={responses.q20}
                onChange={(value) => handleResponseChange("q20", value)}
              />

              <QuestionRadio
                id="q21"
                question="Q21. Would you consider paying a performance fee (percentage of net gains) for a trading signal service if it demonstrated consistent alpha generation?"
                options={[
                  "No – I strongly prefer flat-fee models only",
                  "Maybe – Only if the performance threshold is meaningful (e.g., above a hurdle rate)",
                  "Yes – A 10–15% performance fee on net gains is reasonable",
                  "Yes – A 15–25% performance fee is acceptable for proven alpha",
                  "Yes – I would pay 25%+ for significant, consistent outperformance",
                ]}
                value={responses.q21}
                onChange={(value) => handleResponseChange("q21", value)}
              />
            </CardContent>
          </Card>

          {/* Section 7: Regulatory & Compliance */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/40 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-balance">Regulatory & Compliance</CardTitle>
              <CardDescription>Requirements for regulatory oversight and due diligence.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <QuestionRadio
                id="q22"
                question="Q22. How important is regulatory compliance (SEC, CFTC registration/oversight) when evaluating a new trading platform or signal provider?"
                options={[
                  "Not important – I prioritize performance over regulatory status",
                  "Slightly important – I prefer compliant platforms but it's not a dealbreaker",
                  "Moderately important – Compliance is one of several factors I consider",
                  "Very important – I require platforms to be registered or working toward registration",
                  "Critical – I will only use fully regulated platforms",
                ]}
                value={responses.q22}
                onChange={(value) => handleResponseChange("q22", value)}
              />

              <QuestionRadio
                id="q23"
                question="Q23. Would you require a formal due diligence questionnaire (DDQ) or operational due diligence process before allocating capital to an AI trading platform?"
                options={[
                  "No – A strong track record and references are sufficient",
                  "Possibly – Depends on the allocation size and strategy complexity",
                  "Yes – A standard DDQ process would be required",
                  "Yes – A comprehensive operational due diligence including on-site visits",
                  "Yes – Full institutional-grade due diligence with third-party verification",
                ]}
                value={responses.q23}
                onChange={(value) => handleResponseChange("q23", value)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Section 8: Interest & Next Steps */}
        <Card className="backdrop-blur-sm bg-white/60 border-white/40 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-balance">Contact Information</CardTitle>
            <CardDescription>
              We will get back to you in 1-3 days for scheduling a demo of the web service dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Q24: Overall interest */}
            <div>
              <QuestionRadio
                id="overallInterest"
                question="24. Overall, how interested are you in AI Broker?"
                options={[
                  "Very interested - would like to schedule a demo immediately",
                  "Interested - want to learn more",
                  "Somewhat interested - need more information",
                  "Not very interested at this time",
                ]}
                value={responses.overallInterest}
                onChange={(value) => handleResponseChange("overallInterest", value)}
              />
            </div>

            {/* Q25: Preferred contact method */}
            <div>
              <Label className="text-base font-medium">
                25. What is your preferred method of follow-up communication?
              </Label>
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={responses.name || ""}
                    onChange={(e) => handleResponseChange("name", e.target.value)}
                    placeholder="John Doe"
                    className="bg-white/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={responses.organization || ""}
                    onChange={(e) => handleResponseChange("organization", e.target.value)}
                    placeholder="Your Company"
                    className="bg-white/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={responses.email || ""}
                    onChange={(e) => handleResponseChange("email", e.target.value)}
                    placeholder="john@example.com"
                    className="bg-white/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={responses.phone || ""}
                    onChange={(e) => handleResponseChange("phone", e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="bg-white/80"
                  />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label>Preferred contact method</Label>
                <RadioGroup
                  value={responses.contactMethod}
                  onValueChange={(value) => handleResponseChange("contactMethod", value)}
                >
                  <div className="flex flex-wrap gap-4">
                    {["Email", "Phone", "Video call (Zoom/Teams)", "In-person meeting"].map((method) => (
                      <div key={method} className="flex items-center space-x-2">
                        <RadioGroupItem value={method} id={`contact-${method}`} />
                        <Label htmlFor={`contact-${method}`} className="font-normal cursor-pointer">
                          {method}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Q26: Additional comments */}
            <div>
              <QuestionTextarea
                id="additionalComments"
                question="26. Any additional comments, questions, or suggestions?"
                value={responses.additionalComments}
                onChange={(value) => handleResponseChange("additionalComments", value)}
                placeholder="Share any additional thoughts..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center pb-12">
          <Button size="lg" onClick={handleSubmit} className="px-12 shadow-lg" disabled={isSubmitting || submitSuccess}>
            {isSubmitting ? "Submitting..." : submitSuccess ? "Submitted!" : "Submit Survey"}
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="backdrop-blur-md bg-white/70 border-t border-white/20 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-slate-600">
          <p>© 2025 AI Broker. All rights reserved.</p>
          <p className="mt-2">
            Your responses are confidential and will only be used for product development purposes.
          </p>
        </div>
      </footer>
    </div>
  )
}

function QuestionRadio({
  id,
  question,
  options,
  value,
  onChange,
  hasOther = false,
}: {
  id: string
  question: string
  options: string[]
  value: string
  onChange: (value: string) => void
  hasOther?: boolean
}) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">{question}</Label>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option} className="flex items-start space-x-2">
              <RadioGroupItem value={option} id={`${id}-${option}`} className="mt-0.5" />
              <Label htmlFor={`${id}-${option}`} className="font-normal cursor-pointer leading-relaxed">
                {option}
              </Label>
            </div>
          ))}
          {hasOther && (
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id={`${id}-other`} />
              <Label htmlFor={`${id}-other`} className="font-normal cursor-pointer">
                Other:
              </Label>
              <Input className="max-w-xs bg-white/80" placeholder="Please specify" onClick={() => onChange("other")} />
            </div>
          )}
        </div>
      </RadioGroup>
    </div>
  )
}

function QuestionCheckbox({
  id,
  question,
  options,
  values,
  onChange,
  hasOther = false,
}: {
  id: string
  question: string
  options: string[]
  values: string[]
  onChange: (option: string, checked: boolean) => void
  hasOther?: boolean
}) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">{question}</Label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option} className="flex items-start space-x-2">
            <Checkbox
              id={`${id}-${option}`}
              checked={values.includes(option)}
              onCheckedChange={(checked) => onChange(option, checked as boolean)}
              className="mt-0.5"
            />
            <Label htmlFor={`${id}-${option}`} className="font-normal cursor-pointer leading-relaxed">
              {option}
            </Label>
          </div>
        ))}
        {hasOther && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`${id}-other`}
              checked={values.includes("other")}
              onCheckedChange={(checked) => onChange("other", checked as boolean)}
            />
            <Label htmlFor={`${id}-other`} className="font-normal cursor-pointer">
              Other:
            </Label>
            <Input className="max-w-xs bg-white/80" placeholder="Please specify" />
          </div>
        )}
      </div>
    </div>
  )
}

function QuestionTextarea({
  id,
  question,
  value,
  onChange,
  placeholder,
}: {
  id: string
  question: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">{question}</Label>
      <Textarea
        id={id}
        rows={5}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="resize-none bg-white/80"
      />
    </div>
  )
}
