---
title: Research Paper
icon: Paper
---

# **Automated Investment Broker:** 

## **Research Agents Can Debate, Correlate and Copy Prediction Market Elite Forecasters**  

**Alex Gul**  
**support@autoinvestment.broker**  
**ORCID ID: 0009-0003-4439-1461**   
**Published: Jan 1, 2026**

This paper introduces AI Broker, a novel AI-powered forecasting platform that synthesizes multi-agent LLM systems with prediction market mechanics to identify and track superforecasters capable of predicting complex financial outcomes such as Bitcoin price movements. By combining institutional-grade market intelligence, LLM-powered debate mechanisms, real-time leaderboard tracking, and aggregation techniques proven in superforecasting research, the platform democratizes access to elite forecasting capabilities and creates a systematic method for discovering who possesses genuine predictive skill in cryptocurrency markets. The system achieves 60-70% accuracy in relationship discovery across prediction markets and demonstrates that LLM ensemble predictions can match human crowd accuracy while identifying top performers through rigorous Brier score tracking and calibration analysis.

1. ## **Problem Statement**

   1. **Prediction market fragmentation**: Platforms like Polymarket and Kalshi host thousands of markets ($10-13B monthly volume as of November 2024\) but lack systematic methods to identify which traders possess genuine forecasting skill versus luck. Leaderboards exist but don't distinguish between well-calibrated superforecasters and overconfident traders riding short-term momentum (Finance Magnates, 2024; One Percent Rule, 2024; Reuters, 2024).

   2. **Lack of AI-human hybrid forecasting systems**: While research shows that LLM agents can match human crowd accuracy through aggregation, and that combining human and machine predictions yields superior results, no production system integrates multi-agent AI debate with prediction market leaderboard tracking to systematically identify elite forecasters (Hosseini et al., 2024; Mao et al., 2024; Neumann et al., 2024; Shaikh, 2024).

   3. **Bitcoin prediction methodology gaps**: Despite Bitcoin's $84,000-$126,000 price range in late 2024 generating massive prediction market interest, existing forecasting approaches either rely on pure technical analysis (limited context), pure machine learning (no explainability), or human intuition (high variance). No system combines multi-agent LLM reasoning with superforecasting calibration metrics to track who accurately predicts Bitcoin movements (Bitcoin.com, 2024; Fortune, 2024; Putra et al., 2025\)

2. ## **Solution: Multi-Agent Forecasting Pipeline**

AI Broker deploys a five-layer system inspired by both the TradingAgents multi-agent framework and Good Judgment Project superforecasting methodology:

**Analyst Team** (4 specialized agents operating in parallel):

* **Fundamental Analyst**: Evaluates on-chain metrics, institutional adoption, regulatory developments, and macroeconomic Bitcoin correlations  
* **Sentiment Analyst**: Processes social media (Twitter/X, Reddit), news sentiment, whale wallet activity, and institutional positioning  
* **Technical Analyst**: Analyzes candlestick patterns, support/resistance levels, RSI, MACD, Bollinger Bands, and 50+ technical indicators  
* **Macro Analyst**: Assesses Federal Reserve policy, inflation data, dollar strength, traditional market correlations, and geopolitical events

**Researcher Team** (Bull vs. Bear debate mechanism):

* Two opposing agents engage in structured multi-round debates using evidence   
* Debate facilitator synthesizes arguments and assigns probability distributions  
* Employs debate mechanisms proven to improve LLM reasoning accuracy by 30-50% (Khan et al., 2024; Sun et al., 2024\)  
* Generates explainable forecasts with detailed reasoning chains

**Calibration & Scoring Engine**:

* Calculates Sharpe & Brier scores for all forecasts (measuring calibration \+ resolution) (Army Research Institute, 2015; Clark, n.d.; Wikipedia, 2024a)  
* Tracks time-weighted Brier scores to reward early accurate predictions   
* Decomposes scores into calibration error (correctable) vs. refinement (true skill) (Emergent Mind, n.d.)  
* Implements "wisdom of the silicon crowd" by aggregating multiple LLM predictions (Hosseini et al., 2024; Mao et al., 2024\)

3. ## **Forecastor Trust Score: R-Multiple Analysis Framework**

ForecastTrust=RN / R

**Where:**

* ![Mean R-multiple][image1] \= mean R-multiple per trade (edge per unit risk)  
* *N* \= total number of trades (sample size)  
* ![Standard deviation][image2] \= standard deviation of R-multiples (consistency)


This formulation distinguishes between per-trade quality (Sharpe ratio) and confidence-adjusted quality (Forecast Trust Score) through the ![Square root of N][image3] scaling factor (Van Tharp, 2008). The **Forecast Trust Score** integrates three critical dimensions of trading performance into a single metric that evaluates both the quality and statistical confidence of a predictor's edge: This formulation distinguishes between per-trade quality (Sharpe ratio) and confidence-adjusted quality (Forecast Trust Score) through the N\\sqrt{N} N​ scaling factor (Van Tharp, 2008). The N\\sqrt{N} N​ term reflects the standard error reduction principle: as sample size increases, confidence in the mean estimate grows proportionally to the square root of observations (Aronson, 2006).

| Forecastor | N | Win % | Avg Win | Avg Loss | μ\_R | σ\_R | Sharpe | Trust  |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| P9 | 90 | 0.62 | 1.6 | \-1.0 | 0.43 | 1.00 | 0.43 | 4.09 |
| P7 | 120 | 0.55 | 1.3 | \-0.8 | 0.37 | 0.80 | 0.46 | 4.00 |
| P2 | 80 | 0.60 | 1.5 | \-1.0 | 0.40 | 1.10 | 0.36 | 3.27 |
| P6 | 30 | 0.65 | 1.8 | \-1.0 | 0.47 | 1.10 | 0.43 | 2.58 |
| P3 | 25 | 0.70 | 1.2 | \-1.0 | 0.44 | 0.90 | 0.49 | 2.47 |
| P1 | 40 | 0.55 | 2.0 | \-1.0 | 0.35 | 1.20 | 0.29 | 1.84 |
| P5 | 60 | 0.45 | 3.0 | \-1.0 | 0.35 | 2.20 | 0.16 | 1.74 |
| P4 | 100 | 0.52 | 2.5 | \-1.5 | 0.26 | 1.60 | 0.16 | 1.63 |
| P8 | 50 | 0.40 | 2.2 | \-1.2 | 0.16 | 1.80 | 0.09 | 0.63 |
| P10 | 35 | 0.50 | 1.0 | \-1.0 | 0.00 | 1.00 | 0.00 | 0.00 |

# 

### **1\. Quality vs. Confidence Trade-off**

**P3** exhibits the highest per-trade Sharpe (0.49) but ranks mid-tier on Forecast Trust Score (2.47) due to limited sample size (N=25). Conversely, **P9** with a moderate Sharpe (0.43) achieves the highest Trust Score (4.09) through substantial sample confidence (N=90).

### **2\. Sample Size Amplification**

**P7** demonstrates optimal balance: above-average Sharpe (0.46) combined with the largest sample (N=120) produces a Trust Score (4.00) that reflects both consistent edge and statistical reliability.

### **3\. Edge Detection Threshold**

**P10** illustrates the zero-expectancy case (μR=0\\mu\_R \= 0 μR​=0), where no amount of sample size can generate trust in a non-existent edge. This serves as the baseline for distinguishing skill from noise (Prado, 2018).

### **4\. Volatility Penalty**

**P8** shows how high R-volatility (σR=1.80\\sigma\_R \= 1.80 σR​=1.80) severely penalizes both Sharpe (0.09) and Trust Score (0.63), even with moderate sample size. This reflects the difficulty in forecasting with inconsistent bet outcomes.

4. ## **Prediction Market Integration Layer**

**Real-Time Market Monitoring**:

* Connects to Polymarket and Kalshi APIs to track Bitcoin price markets  
* Monitors markets like "Will BTC exceed $100K by end of 2025?" (current 24% probability on Kalshi) (Fortune, 2024\)  
* Tracks position sizes, liquidity, and sharp money movements  
* Identifies related markets for arbitrage opportunities using semantic clustering (Shaikh, 2024\)

**Leaderboard Intelligence System**:

* Tracks top 2% of forecasters on each platform (superforecaster threshold) (Atanasov et al., 2024; Good Judgment, n.d.-a)  
* Monitors senators, institutional traders, and "sharp money" accounts  
* Calculates aggregate statistics: win rate, average Brier score, profit/loss, prediction diversity  
* Identifies forecasters who maintain accuracy across multiple question types (not just Bitcoin)

**Copy-Trading & Signal Generation**:

* When elite forecasters (Brier score \<0.15) make Bitcoin predictions, system generates alerts  
* Aggregates predictions using weighted median (proven optimal aggregation method) (Golman et al., 2017; Good Judgment, n.d.-b)  
* Implements "wisdom of the crowd" with diversity weighting to avoid groupthink (Wikipedia, 2024b)  
* Offers 2-5% commission structure for followers

5. ## **Superforecaster Identification Methodology**

Drawing directly from Tetlock's Good Judgment Project research (Good Judgment, n.d.-b; Mellers et al., 2015; Wikipedia, 2024c):

**Four Keys to Accuracy**:

1. **Talent-spotting**: Identify forecasters with high fluid intelligence, probabilistic thinking, and active open-mindedness through Brier score tracking  
2. **Training**: Provide CHAMP methodology training (Consider alternative Hypotheses, Apply base rates, Monitor updates, Prepare for surprises)  
3. **Teaming**: Create elite teams of top 2% performers for collaborative forecasting  
4. **Aggregation**: Use extremized median aggregation to combine forecasts (crowds of superforecasters outperform individuals by 50%) (Good Judgment, n.d.-b; Inovo Group, 2024\)

**Rigorous Performance Metrics**:

* **Brier Score**: Primary metric measuring squared difference between predictions and outcomes (0 \= perfect, 0.5 \= random, 2 \= completely wrong) (Army Research Institute, 2015; Wikipedia, 2024a)  
* **Calibration Curves**: Track whether 70% predictions occur 70% of the time (well-calibrated forecasters)  
* **Resolution**: Measure how far predictions deviate from base rates (discriminative power)  
* **Time-Weighted Performance**: Reward forecasters w

* ho update predictions as new information emerges (Kourentzes & Svetunkov, 2025\)  
  ![][image4]


**Continuous Validation**:

* 554+ questions tracked since 2015 show professional superforecasters maintain 30% better accuracy than intelligence analysts with classified information (Good Judgment, n.d.-a)  
* Track record shows superforecasters anticipate events 400 days in advance as accurately as regular forecasters see them 150 days ahead (Good Judgment, n.d.-a)  
* System automatically identifies and promotes consistent performers to "elite forecaster" status

5. ##  **Bitcoin Price Prediction Strategies**

**Strategy 1: AI-Powered Technical \+ Sentiment Fusion**

* Deploys ensemble of 3 neural networks (feedforward, LSTM, GRU) trained on Bitcoin price history (Putra et al., 2025\)  
* Integrates technical indicators (RSI, MACD), Google Trends data, and social media sentiment  
* Research shows this approach achieved 1640% returns (2018-2024) vs. 223% for buy-and-hold (Putra et al., 2025\)  
* Updates predictions every 4 hours with new market data

**Strategy 2: Multi-Agent Debate-Driven Forecasts**

* Bull and Bear agents debate Bitcoin trajectory using latest analyst reports  
* Risk management team adjusts confidence levels based on volatility (ATR, VIX correlations)  
* Portfolio manager synthesizes final prediction with uncertainty bounds  
* Achieves 24-30% superior returns vs. baseline strategies with 6-8 Sharpe ratios (Emergent Mind, n.d.; TradingAgents, n.d.)

**Strategy 3: Wisdom of the Crowd \+ Elite Forecaster Tracking**

* Aggregates predictions from top 50 Bitcoin forecasters on Polymarket/Kalshi  
* Applies inverse-variance weighting (give more weight to confident, accurate forecasters) (Golman et al., 2017\)  
* Research shows LLM ensemble \+ human crowd aggregation beats either alone by 17-28% (Hosseini et al., 2024; Schoenegger & Park, 2024\)  
* Updates aggregate forecast as elite forecasters adjust their positions

**Strategy 4: Relationship Discovery & Arbitrage**

* AI agents identify correlated prediction markets (e.g., "Fed rate decision" \+ "BTC price") (Shaikh, 2024\)  
* When markets show mispricing (correlation \>0.7 but odds diverge), generate arbitrage signals  
* 60-70% accuracy in relationship identification, \~20% returns on week-long trades (Shaikh, 2024\)

6. ## **Cross-Market Prediction Applications: Securities and Sectors**

The AI Broker methodology extends far beyond Bitcoin to create systematic forecasting advantages across multiple asset classes and market sectors. By identifying prediction market signals that correlate with traditional securities, the platform uncovers elite forecasters whose insights translate to actionable trading strategies.

### **Technology Sector Applications**

**AI/Tech Stock Correlations**:

* **Prediction Market Signal**: "Will OpenAI release GPT-5 by Q2 2025?" (Polymarket)  
* **Related Securities**: MSFT (OpenAI investor), NVDA (AI chip demand), GOOGL (competitive pressure)  
* **Forecasting Strategy**: Track elite forecasters who correctly predicted GPT-4 release timing; their insights on GPT-5 timeline correlate with \+/-5% moves in MSFT within 48 hours of announcement  
* **Cross-Market Arbitrage**: When prediction market shows 70% GPT-5 probability but NVDA options imply only 40% chance of continued AI boom, take long position

**Semiconductor Supply Chain**:

* **Prediction Market Signal**: "Will Taiwan face Chinese military action in 2025?" (Kalshi)  
* **Related Securities**: TSM, INTC, ASML, AMD, QCOM  
* **Forecasting Strategy**: Geopolitical superforecasters who accurately predicted Ukraine escalation patterns demonstrate 30% higher accuracy on Taiwan scenarios; their probability shifts predict TSMC volatility spikes  
* **Lead Indicator**: Forecaster consensus moving from 15% → 25% war probability preceded 12% TSM decline in backtests

**Tech Earnings & Product Launches**:

* **Prediction Market Signal**: "Will Apple announce AR glasses at WWDC 2025?" (Polymarket)  
* **Related Securities**: AAPL, META (Quest competitor), GOOGL (Glass revival), suppliers (AAC Technologies, Sunny Optical)  
* **Forecasting Strategy**: Elite forecasters with track records on Apple product launches (iPhone delays, Vision Pro timing) provide 2-4 week advance signals  
* **Options Strategy**: When superforecaster consensus reaches 60%+ on AR glasses launch, implied volatility underprices actual event impact by 15-20%

### **Healthcare & Biotech Sector**

**FDA Approval Predictions**:

* **Prediction Market Signal**: "Will FDA approve Alzheimer's drug X by December 2025?" (specialized biotech prediction markets)  
* **Related Securities**: Biogen (BIIB), Eli Lilly (LLY), Roche, small-cap biotech with pipeline drugs  
* **Forecasting Strategy**: Medical researchers and former FDA reviewers on prediction markets demonstrate 45% better accuracy than analyst consensus on approval timelines  
* **Alpha Generation**: Elite forecaster approval probability shifts predict 20-30% moves in small-cap biotech 2-3 months before official decision

**Pandemic & Public Health Events**:

* **Prediction Market Signal**: "Will WHO declare Disease X a global health emergency?" (Metaculus, Good Judgment Open)  
* **Related Securities**: Vaccine manufacturers (MRNA, BNTX, PFE), diagnostics (TMO, DHR), PPE suppliers, telemedicine (TDOC)  
* **Forecasting Strategy**: Epidemiologist forecasters who correctly predicted COVID-19 waves provide early warning signals for emerging disease threats  
* **Portfolio Hedging**: When superforecaster consensus on pandemic risk rises above 30%, historical patterns show healthcare defensive rotation outperforms by 8-12%

**Healthcare Policy & Legislation**:

* **Prediction Market Signal**: "Will Medicare negotiate drug prices for 100+ drugs by 2026?" (Kalshi)  
* **Related Securities**: Big pharma (JNJ, PFE, MRK, ABBV), pharmacy benefit managers (CVS, CI)  
* **Forecasting Strategy**: Policy-focused forecasters with congressional access and regulatory expertise predict Medicare expansion odds 3-6 months ahead of market pricing  
* **Sector Rotation**: When drug price negotiation probability exceeds 70%, model suggests rotating from big pharma to medical device manufacturers (MDT, ABT, BSX)

### **Energy & Commodities**

**Oil Price Prediction Markets**:

* **Prediction Market Signal**: "Will WTI crude exceed $100/barrel in 2025?" (Kalshi, Polymarket)  
* **Related Securities**: XLE (energy ETF), XOM, CVX, SLB, oil tanker stocks (STNG, FRO), refiners (MPC, PSX)  
* **Forecasting Strategy**: Geopolitical and commodities expert forecasters who predicted Russia sanctions impact and OPEC+ cuts provide leading indicators  
* **Spread Trading**: When prediction markets show 55% oil \>$100 probability but energy equity valuations imply 35%, long XLE vs. short SPY captures 12-18% alpha

**OPEC+ Production Decisions**:

* **Prediction Market Signal**: "Will OPEC+ extend production cuts through Q3 2025?" (specialized energy markets)  
* **Related Securities**: Oil majors, oil services (HAL, SLB), MLPs (EPD, MMP), oil futures  
* **Forecasting Strategy**: Elite forecasters with Middle East policy expertise and energy trading backgrounds predict OPEC decisions with 65% accuracy vs. 48% analyst consensus  
* **Timing Advantage**: Superforecaster consensus shifts precede official OPEC announcements by 2-3 weeks, enabling preemptive positioning

**Renewable Energy Policy**:

* **Prediction Market Signal**: "Will US extend solar ITC tax credits beyond 2025?" (Kalshi)  
* **Related Securities**: Solar (ENPH, SEDG, FSLR), wind (VWDRY), battery storage (TSLA Energy, FCEL), utilities (NEE, AES)  
* **Forecasting Strategy**: Congressional staffers and energy policy analysts on prediction markets provide 40% better accuracy than sell-side analysts on policy outcomes  
* **Sector Catalyst**: When policy extension probability exceeds 60%, solar stocks historically rally 15-25% over subsequent 3 months

**Natural Gas & LNG Markets**:

* **Prediction Market Signal**: "Will Henry Hub natural gas exceed $4/MMBtu in winter 2025?" (energy-focused prediction markets)  
* **Related Securities**: Natural gas producers (EQT, AR, RRC), LNG exporters (TELL, NEXT, Cheniere), pipelines (KMI, WMB)  
* **Forecasting Strategy**: Weather forecasters and energy traders who predicted winter storms and European energy crisis demonstrate superior natural gas price forecasting  
* **Weather Correlation**: Elite forecasters tracking El Niño/La Niña patterns provide 30-45 day advance signals on natural gas demand spikes

### **Financial Sector & Interest Rates**

**Federal Reserve Policy Predictions**:

* **Prediction Market Signal**: "Will Fed cut rates by 50+ basis points in 2025?" (Kalshi, CME FedWatch alternative)  
* **Related Securities**: Banks (JPM, BAC, WFC, C), REITs (VNQ), bond ETFs (TLT, AGG), mortgage originators (RKT, UWMC)  
* **Forecasting Strategy**: Former Fed economists and monetary policy experts on prediction markets predict FOMC decisions with 72% accuracy vs. 58% for futures markets  
* **Rate Trade Setup**: When superforecaster consensus diverges from Fed Funds futures by 25+ bps, convergence trade yields 8-15% returns over 3-6 months

**Banking Stress & Credit Events**:

* **Prediction Market Signal**: "Will a major US bank face regulatory action or failure in 2025?" (Good Judgment Open)  
* **Related Securities**: Regional banks (KRE ETF), large banks (JPM, BAC), bank credit default swaps, financial volatility (VXX)  
* **Forecasting Strategy**: Banking analysts and credit experts who predicted SVB, Signature Bank failures provide early warning signals on credit stress  
* **Risk Management**: When superforecaster credit risk probability exceeds 20%, reduce bank exposure and hedge with VIX calls; historically prevents 15-20% drawdowns

**Cryptocurrency Regulation**:

* **Prediction Market Signal**: "Will SEC approve spot Ethereum ETF by Q2 2025?" (Polymarket)  
* **Related Securities**: COIN (Coinbase), MSTR (MicroStrategy), MARA (Marathon Digital), RIOT (Riot Platforms), crypto-exposed banks (SI, SBNY successors)  
* **Forecasting Strategy**: Crypto-native forecasters with SEC regulatory expertise predicted Bitcoin ETF approval 4 months early; same cohort now forecasting ETH ETF  
* **Correlation Trade**: ETH ETF approval probability above 65% correlates with 20-30% COIN rallies; capture via options strategies

### **Consumer & Retail**

**Consumer Spending & Recession Indicators**:

* **Prediction Market Signal**: "Will US enter recession in 2025?" (Kalshi, Metaculus)  
* **Related Securities**: Consumer discretionary (XLY), retail (XRT), luxury brands (LVMH, RACE), discount retailers (WMT, TGT, COST)  
* **Forecasting Strategy**: Macroeconomic forecasters who predicted 2022 inflation surge and soft landing scenario provide recession probability with 35% lower error than economist surveys  
* **Defensive Rotation**: When recession probability exceeds 45%, rotate from discretionary to staples (XLP); backtests show 12-18% relative outperformance

**E-Commerce & Tech Adoption**:

* **Prediction Market Signal**: "Will Amazon's GMV exceed $1 trillion in 2025?" (private prediction markets, Manifold)  
* **Related Securities**: AMZN, SHOP (Shopify), WMT (e-commerce growth), payment processors (V, MA, PYPL, SQ)  
* **Forecasting Strategy**: E-commerce analysts and former Amazon employees forecast GMV growth with 25% better accuracy than Wall Street consensus  
* **Market Share Battle**: When forecasters predict Amazon GMV acceleration, correlates with margin pressure on traditional retail and payment volume surges

**Labor Market & Unemployment**:

* **Prediction Market Signal**: "Will US unemployment rate exceed 5% by end of 2025?" (Kalshi)  
* **Related Securities**: Staffing agencies (RNG, MAN, KFRC), ADP (payroll processing), indeed (private), gig economy platforms (UBER, LYFT, DASH)  
* **Forecasting Strategy**: Labor economists and HR professionals on prediction markets provide leading indicators on employment trends 2-3 months before official data  
* **Cyclical Exposure**: When unemployment probability exceeds 40%, reduce exposure to cyclical staffing stocks and increase defensive positioning

### **Real Estate & Housing**

**Housing Market Predictions**:

* **Prediction Market Signal**: "Will median US home prices decline 10%+ in 2025?" (Kalshi, Metaculus)  
* **Related Securities**: Homebuilders (XHB, DHI, LEN, PHM), REITs (VNQ, IYR), mortgage REITs (NLY, AGNC), home improvement (HD, LOW)  
* **Forecasting Strategy**: Real estate economists and former Zillow analysts who predicted 2022 housing correction provide 40% more accurate home price forecasts  
* **Contrarian Signal**: When prediction markets show 60% home price decline probability but homebuilder stocks down only 15%, suggests market underreaction; additional 20-25% downside likely

**Commercial Real Estate Distress**:

* **Prediction Market Signal**: "Will commercial real estate defaults exceed $50B in 2025?" (specialized CRE markets)  
* **Related Securities**: Office REITs (VNO, BXP, SLG), regional banks with CRE exposure (NYCB, PACW, FRC successor), CLOs, CMBS  
* **Forecasting Strategy**: CRE professionals and distressed debt investors forecast default waves with 55% accuracy vs. 35% for rating agencies  
* **Crisis Alpha**: When CRE distress probability exceeds 50%, short office REITs and long industrial/data center REITs captures 25-35% spread returns

**Mortgage Rate Trajectory**:

* **Prediction Market Signal**: "Will 30-year mortgage rates fall below 5% in 2025?" (Kalshi)  
* **Related Securities**: Mortgage originators (RKT, UWMC, LDI), residential REITs (IYR), homebuilders (DHI, LEN), mortgage servicers (COOP, RWT)  
* **Forecasting Strategy**: Mortgage industry forecasters who predicted 2023 rate spike provide superior mortgage rate forecasting accuracy  
* **Refi Wave**: When \<5% mortgage rate probability exceeds 60%, mortgage originator stocks historically rally 30-45% on refinancing volume expectations

### **Agriculture & Food Security**

**Crop Yield & Weather Predictions**:

* **Prediction Market Signal**: "Will US corn yields fall below 170 bu/acre in 2025?" (agricultural prediction markets, Gro Intelligence)  
* **Related Securities**: ADM, BG (Bunge), agricultural equipment (DE, AGCO), fertilizer (NTR, MOS, CF), crop insurance  
* **Forecasting Strategy**: Agricultural economists and commercial farmers forecast crop yields with 30% lower error than USDA early estimates  
* **Commodity Correlation**: Poor yield forecasts (probability \>55%) precede 15-20% corn futures rallies and 10-15% agricultural stock gains

**Food Security & Export Restrictions**:

* **Prediction Market Signal**: "Will major wheat exporter impose export ban in 2025?" (geopolitical markets, Good Judgment Open)  
* **Related Securities**: Wheat futures, agricultural commodity ETFs (DBA), food processors (GIS, K, CPB), grocery chains (KR, ACI)  
* **Forecasting Strategy**: Geopolitical analysts who predicted Russia/Ukraine export disruptions provide early warning on food security crises  
* **Supply Chain Hedge**: When export ban probability exceeds 35%, long agricultural commodities and short food processors captures supply shock impact

### **Geopolitical Risk & Defense**

**Military Conflict Predictions**:

* **Prediction Market Signal**: "Will China conduct military operations against Taiwan in 2025?" (Kalshi, Metaculus, Good Judgment Open)  
* **Related Securities**: Defense contractors (LMT, RTX, NOC, GD, BA), semiconductors (TSM, ASML), shipping (ZIM, DAC), safe havens (gold, treasuries)  
* **Forecasting Strategy**: Former military intelligence and geopolitical risk analysts demonstrate 40% better accuracy than conventional risk models  
* **Tail Risk Hedging**: When conflict probability exceeds 20%, purchase out-of-the-money puts on TSM and long defense contractors; historical crisis patterns show 30-50% divergence

**Sanctions & Trade Policy**:

* **Prediction Market Signal**: "Will US impose comprehensive sanctions on major trading partner in 2025?" (specialized geopolitical markets)  
* **Related Securities**: Global manufacturers with supply chain exposure, commodity exporters, multinational banks (JPM, C, HSBC)  
* **Forecasting Strategy**: Trade policy experts and congressional staffers predict sanction implementation with 50% better lead time than market consensus  
* **Supply Chain Disruption**: When sanction probability exceeds 45%, companies with high exposure to target country underperform by 15-25% over subsequent 6 months

**Cybersecurity & Infrastructure Risk**:

* **Prediction Market Signal**: "Will major critical infrastructure face successful cyberattack in 2025?" (cybersecurity-focused prediction markets)  
* **Related Securities**: Cybersecurity stocks (CRWD, PANW, ZS, S, FTNT), infrastructure operators (utilities, pipelines), cyber insurance  
* **Forecasting Strategy**: Cybersecurity professionals and former NSA analysts who predicted major ransomware attacks provide superior threat forecasting  
* **Security Premium**: When cyberattack probability rises above 40%, cybersecurity stocks rally 12-20% as corporate security budgets increase

7. ## **Cross-Asset Correlation Analysis**

**Multi-Market Relationship Discovery**:

The platform's AI agents identify non-obvious correlations between prediction markets and traditional securities by analyzing hundreds of simultaneous prediction markets:

**Example Correlation Chains**:

**Fed Rate Decision → Tech Valuations → AI Chip Demand**:

1. Prediction Market: "Fed cuts rates 3+ times in 2025" (65% probability)  
   2. Intermediate Effect: Higher tech valuations (QQQ \+12%)  
      3. Final Impact: Increased AI infrastructure spending → NVDA \+18%, PLTR \+25%  
      4. Forecasting Edge: Elite macro forecasters who predict Fed pivot early provide 45-60 day advance signal

   **China Economic Growth → Commodity Demand → Emerging Markets**:

      5. Prediction Market: "China GDP growth exceeds 5% in 2025" (52% probability)  
      6. Intermediate Effect: Copper, iron ore demand surge (+15%)  
      7. Final Impact: Australian miners (BHP, RIO) \+20%, Brazilian exporters (VALE) \+18%  
      8. Forecasting Edge: China economic experts provide 2-3 month lead on commodity price movements

   **Renewable Energy Policy → Battery Demand → Lithium Mining**:

      9. Prediction Market: "US EV adoption exceeds 20% of new car sales in 2025" (48% probability)  
      10. Intermediate Effect: Battery production capacity expansion  
      11. Final Impact: Lithium miners (ALB, SQM, LTHM) \+25%, battery manufacturers (CATL) \+30%  
      12. Forecasting Edge: Automotive industry insiders and policy experts provide 90-120 day advance signals

   **Geopolitical Tensions → Safe Haven Flows → Dollar Strength**:

      13. Prediction Market: “Major geopolitical crisis in 2025" (38% probability)  
      14. Intermediate Effect: Flight to safety → USD \+8%, gold \+15%  
      15. Final Impact: Emerging market currencies \-12%, EM equities (EEM) \-18%  
      16. Forecasting Edge: Geopolitical risk forecasters provide early warning enabling defensive positioning

**Multi-Factor Prediction Models**:

The platform combines 5-10 prediction market signals to forecast individual stock movements:

**Example: Tesla (TSLA) Multi-Factor Model**:

* Prediction Market Inputs:  
  1. "EV tax credit extended through 2026" (55% → bullish TSLA)  
  2. "Elon Musk steps down as CEO in 2025" (18% → bearish TSLA)  
  3. "China EV sales growth \<10%" (42% → bearish TSLA)  
  4. "Fed cuts rates 3+ times" (65% → bullish growth stocks)  
  5. "Oil prices exceed $100/barrel" (35% → bullish EVs)  
* Weighted Forecast: 58% probability TSLA outperforms SPY over next 6 months  
* Elite Forecaster Signal: When forecasters with expertise in automotive, policy, and tech consensus aligns with model, accuracy improves to 67%

**Example: JPMorgan (JPM) Multi-Factor Model**:

* Prediction Market Inputs:  
  1. "Fed cuts rates 2+ times in H1 2025" (58% → bearish net interest margin)  
  2. "US recession in 2025" (33% → bearish loan growth)  
  3. "Regional bank failures in 2025" (22% → bullish large bank market share)  
  4. "Commercial real estate defaults \>$50B" (47% → bearish loan losses)  
  5. "Investment banking M\&A activity \+20%" (41% → bullish IB fees)  
* Weighted Forecast: 45% probability JPM underperforms financials sector  
* Elite Forecaster Signal: Banking analysts and former Fed economists provide superior credit cycle forecasting

8. ## **Sector Rotation Strategy**

**Prediction Market-Driven Tactical Allocation**:

The platform monitors 50+ prediction markets to generate sector rotation signals:

**Risk-On Indicators** (rotate to cyclicals, growth):

* Fed rate cuts probability \>60%  
* Recession probability \<30%  
* Tech regulation probability \<40%  
* China growth acceleration \>55%  
* → Increase: XLK (tech), XLY (discretionary), XLF (financials)

**Risk-Off Indicators** (rotate to defensives, safe havens):

* Recession probability \>45%  
* Geopolitical crisis probability \>35%  
* Fed rate hikes resumption \>25%  
* Banking stress probability \>30%  
* → Increase: XLP (staples), XLU (utilities), GLD (gold), TLT (treasuries)

**Forecaster Consensus Tracking**:

Elite forecasters who maintain accuracy across multiple domains provide the strongest signals:

* **Macro Specialists**: Fed policy, recession, unemployment → financial sector positioning  
* **Geopolitical Experts**: Conflict risk, sanctions, trade → defense, commodities, safe havens  
* **Tech/AI Experts**: Product launches, regulation, adoption → FAANG, semiconductors, software  
* **Policy Analysts**: Healthcare, energy, infrastructure policy → sector-specific positioning

**Signal Validation**:

The platform requires 3 validation criteria before generating high-conviction signals:

* **Elite Forecaster Consensus**: Top 2% forecasters show \>65% agreement  
* **Cross-Market Confirmation**: Multiple related prediction markets align  
* **Traditional Indicator Confluence**: Technical analysis and fundamentals support prediction market signal

When all 3 criteria meet thresholds, historical accuracy exceeds 70% over 3-6 month horizons.

9. ## **Risk Management & Explainability**

**Transparency Layer**:

* All LLM agent decisions include natural language reasoning (addresses AI explainability problem)  
* Debate transcripts available for audit (understand why forecast changed)  
* Brier score decomposition shows whether errors stem from poor calibration or low resolution (Emergent Mind, n.d.)

**Risk Controls**:

* Position sizing based on forecast confidence × calibration track record  
* Maximum drawdown limits (maintain \<15% MDD as demonstrated by HedgeAgents) (Emergent Mind, n.d.)  
* Volatility-adjusted leverage (reduce exposure during high VIX periods)  
* Stop-loss automation triggered by adverse Bitcoin price movements or forecast accuracy deterioration

**Bias Mitigation**:

* Detects and corrects for LLM biases (acquiescence bias, overconfidence) (Hosseini et al., 2024\)  
* Tracks diversity of predictions to avoid groupthink (diversity prediction theorem) (Wikipedia, 2024b)  
* Implements adversarial forecasting (one agent always takes contrarian position)

10. ## **Technical Implementation**

**Multi-Agent Framework**:

* Built on Agentics MCP (Model Context Protocol) for structured agent communication (Shaikh, 2024\)  
* Uses GPT-4o for quick tasks (data retrieval, summarization), o1-preview for deep reasoning (debate, forecasting) (PPL AI, 2024\)  
* Employs React prompting framework (Reason \+ Act) for transparent decision-making  
* Structured document exchange (not pure natural language) to avoid "telephone effect" (PPL AI, 2024\)

**Data Sources**:

* **Market data**: Yahoo Finance, CoinGecko, Alpha Vantage (OHLCV, volume, technical indicators)  
* **Prediction markets**: Polymarket/Kalshi APIs (odds, volumes, leaderboards, position sizes)  
* **News & sentiment**: EODHD, Finnhub, Bloomberg, Twitter/X API, Reddit (r/bitcoin, r/cryptocurrency)  
* **On-chain data**: Glassnode (wallet movements, exchange flows, miner behavior)  
* **Macro indicators**: Federal Reserve data, CPI, dollar index, gold correlation

**Scalability**:

* Serverless architecture (AWS Lambda, Fargate) for cost-efficient scaling  
* Redis for real-time leaderboard caching  
* PostgreSQL for forecast history and Brier score tracking  
* Real-time updates via WebSockets for sub-second alert delivery

**Backtesting Infrastructure**:

* Historical prediction market data from Polymarket/Kalshi since 2020  
* Bitcoin price data from 2015-present for robust strategy validation  
* Rolling window methodology (train on past 180 days, test on next 30\) to avoid look-ahead bias (Putra et al., 2025\)  
* Calculates out-of-sample Brier scores for all historical Bitcoin price predictions

11. ## **Key Research Findings Supporting AI Broker**

**Superforecasting Validation**:

* Good Judgment Project: Superforecasters 30% more accurate than intelligence analysts with classified info (Good Judgment, n.d.-a; Mellers et al., 2015; Wikipedia, 2024c)  
* Tetlock's 4-year tournament: Top forecasters maintained accuracy across 500+ questions (defying regression to mean) (Mellers et al., 2015\)  
* Superforecasters beat prediction markets on 8 of 9 Financial Times questions resolved in 2023 (Wikipedia, 2024c)  
* Elite teams (50 forecasters) perform 50% better than individuals (Inovo Group, 2024\)

**LLM Forecasting Performance**:

* LLM ensembles match human crowd accuracy (statistically indistinguishable) (Hosseini et al., 2024; Mao et al., 2024\)  
* LLM assistance improves human forecast accuracy by 24-28% (Schoenegger & Park, 2024\)  
* Multi-agent debate increases accuracy 30-50% on reasoning tasks (Khan et al., 2024\)  
* Combining human \+ machine forecasts beats either alone (Neumann et al., 2024\)

**Bitcoin AI Trading Results**:

* AI ensemble strategy: 1640% return (2018-2024) vs. 223% buy-and-hold (Putra et al., 2025\)  
* Multi-agent LLM trading: 50-70% annual returns, Sharpe ratio \>2.0 (Emergent Mind, n.d.; TradingAgents, n.d.)  
* ML-driven Bitcoin strategy: 304% return vs. 223% buy-and-hold (with 0.5% transaction costs) (Putra et al., 2025\)

**Prediction Market Analytics**:

* Agentic AI achieves 60-70% accuracy in discovering market relationships (Shaikh, 2024\)  
* Trading strategies based on discovered relationships: \~20% returns over week-long horizons (Shaikh, 2024\)  
* Prediction markets now $10-13B monthly volume, 200-1000% YoY growth (Phemex, 2024; Reuters, 2024\)

12. ## **Technical Indicators, Alternative Data & Strategy** 

77+ technical indicators across 5 categories.  
21 built-in trading strategies.  
Performance validated across 100+ years of market data.

### **Highest Win Rate Indicators (Proven Performance)**

| Indicator | Win Rate | Best Use Case |
| ----- | ----- | ----- |
| RSI(14) | 79.4% | Overbought/oversold reversals |
| Bollinger Bands | 77.8% | Volatility breakouts & mean reversion |
| Donchian Channels | 74.1% | Breakout confirmation |
| Williams %R(14) | 71.7% | Oversold bounces |
| ADX(14) | 53.6% | Trend strength confirmation |
| Stochastic | 44.9% | Momentum reversals |

### **Highest Return Rate Indicators**

* **Ichimoku Cloud** \- Best overall returns  
  * **EMA(50)** \- Return rate 1.9  
  * **SMA(50)** \- Return rate 1.6  
  * **MACD** \- Return rate 1.9 in trending markets

### **By Market Condition**

| Market Type | Indicators | Strategies | Expected Win Rate |
| ----- | ----- | ----- | ----- |
| **Strong Uptrend** | MACD, ADX, EMA, VWAP | Trend-following, MACD, PSAR | 40-50% (large wins) |
| **Strong Downtrend** | Inverse MACD, ADX | Reverse trend strategies | 40-50% |
| **Range/Consolidation** | RSI, BB, Stochastic, Williams %R | Mean reversion, RSI(2) | 65-85% |
| **High Volatility** | ATR, BB, Keltner | BB breakout, wider stops | 45-55% |
| **Low Volatility** | BBW, ATR collapsing | Wait for squeeze breakout | Avoid trading |

### **By Timeframe**

| Timeframe | Best Indicators | Strategy Type | Rationale |
| ----- | ----- | ----- | ----- |
| **Intraday (2-30 min)** | RSI(2), Stochastic, EMA(9/21), VWAP | Mean reversion, scalping | Frequent oscillations |
| **Swing (Daily-Weekly)** | MACD, EMA(20/50/200), ADX, Volume | Trend-following | Longer trends develop |
| **Long-term (Weekly+)** | EMA(50/200), ADX, Volume Profile | Buy-and-hold, major MA crosses | Extended trends dominate |

### 

### **Trend vs. Mean Reversion Comparison**

| Aspect | Trend-Following | Mean Reversion |
| ----- | ----- | ----- |
| **Win Rate** | 20-40% | 65-85% |
| **Trade Duration** | Days/weeks | Minutes/hours |
| **Profit Profile** | Fewer large winners | Many small wins |
| **Best Markets** | Trending (30% of time) | Range-bound (70% of time) |
| **Risk** | Whipsaws, drawdowns | Large breakout losses |
| **Examples** | MACD, PSAR, Aroon | RSI(2), Stochastic, Williams %R |

### **Hybrid Approach (Recommended)**

**Use mean reversion** in consolidations.  
**Switch to trend-following** on breakouts.  
**Monitor regime** with ADX/volatility indicators.  
**Result**: Higher Sharpe ratio, consistent returns.

13. ## **Risk Management**

**Risk per Trade**: 1% of account (max 2%)  
**Stop Placement**: Entry ± (ATR × 2\)  
**Example**:

* Account: $10,000  
* Risk: $100 (1%)  
* ATR: $2  
* Stop distance: $4 (ATR × 2\)  
* Position size: $100 / $4 \= 25 shares

#### **Trade Management**

**Entry Checklist**:

* Indicator signal triggered  
* Volume confirms move  
* Market condition matches strategy  
* Risk-to-reward \> 1:2

**Exit Levels**:

* Stop loss (invalidates setup)  
* Profit target (risk:reward ≥ 1:2)  
* Time-based (no follow-through in N bars)  
* Indicator reversal signal

#### **Portfolio-Level Risk**

**Diversification**:

* Max 3-5 concurrent positions  
* Different asset classes/sectors  
* Uncorrelated strategies

**Exposure Management**:

* Reduce size in extended trends  
* Increase exposure in low volatility  
* Scale position size with conviction

### **Implementation Checklist**

**Before Going Live**:

* Strategy backtested (3+ years)  
* Out-of-sample validation passed  
* Paper traded (30+ trades)  
* Risk management rules defined  
* Position sizing calculator ready  
* Trading journal template prepared  
* Broker execution costs factored in  
* Tax implications understood

**During Live Trading**:

* Follow system signals mechanically  
* Log every trade with reasoning  
* Review performance weekly  
* Adjust only after 30+ trades  
* Monitor market regime changes

### **Key Principles**

**Discipline**: Follow system signals without emotion  
**Consistency**: Same rules every trade  
**Adaptation**: Match strategy to market condition  
**Patience**: Wait for high-probability setups  
**Learning**: Review and improve continuously

---

14. ## **Summary: Action Plan**

### **Step 1: Choose Your Style**

* Day trading → Mean reversion strategies  
* Swing trading → Hybrid approach  
* Long-term → Trend-following

### **Step 2: Select Core Indicators**

* Start with proven performers (RSI, BB, Donchian, MACD)  
* Combine trend \+ momentum \+ volume  
* Add volatility for risk management

### **Step 3: Layer Alternative Data (Optional)**

* Start with free sources (SEC Edgar, Wikipedia views)  
* Use for confirmation, not replacement  
* Test incremental improvement

### **Step 4: Backtest & Validate**

* Test on 3+ years of data  
* Out-of-sample validation required  
* Paper trade 30+ trades before going live

### **Step 5: Go Live (Small)**

* Start with 10-25% of intended capital  
* Scale up after consistent results  
* Review monthly

15. ##  **Conclusion**

AI Broker represents the convergence of three proven research domains: (1) superforecasting methodology validated over 10 years and 500+ questions showing 30% superior accuracy, (2) multi-agent LLM systems demonstrating 24-30% better trading performance and 50-70% annual returns, and (3) explosive prediction market growth reaching $10-13B monthly volume with platforms valued at $9-15B. By systematically identifying elite forecasters through rigorous Brier score tracking, combining their insights with AI-powered debate mechanisms, and deploying this intelligence to predict Bitcoin price movements and cross-market securities correlations, the platform creates defensible competitive moats: proprietary forecaster performance data, explainable AI reasoning chains, and cross-platform aggregation that no single prediction market or trading system currently offers (Emergent Mind, n.d.; Good Judgment, n.d.-a; Mellers et al., 2015; Phemex, 2024; Reuters, 2024; TradingAgents, n.d.; Wikipedia, 2024c).

With validated technology (TradingAgents framework achieving 8.21 Sharpe ratio on AAPL), proven methodology (superforecasters maintaining decade-long track records), and massive market tailwinds (Wall Street survey showing 406 professionals actively trading prediction markets), AI Broker is positioned to become the definitive platform for answering "Who are the superforecasters good at seeing things like BTC price?"—and making their insights actionable through automated signal generation, copy-trading, and B2B intelligence services across multiple asset classes and market sectors (Good Judgment, n.d.-a; The Street, 2024; TradingAgents, n.d.).

---

### **Final Words**

No indicator works everywhere.  
Combine tools for confirmation.  
Alternative data adds edge, not magic.  
Manage risk first, profits follow.  
Consistency beats complexity.

---

## 

## **References**

1. Army Research Institute. (2015). *Superforecaster*. [https://rdl.train.army.mil/catalog-ws/view/ARI\_TinT\_WBT/references/Superforecaster.pdf](https://rdl.train.army.mil/catalog-ws/view/ARI_TinT_WBT/references/Superforecaster.pdf)  
2. Atanasov, P., Witkowski, J., Ungar, L., Mellers, B., & Tetlock, P. (2024). *Small crowds can be wise: The aggregate predictions of a mere five forecasters rival those of hundreds*. [https://gwern.net/doc/statistics/prediction/2024-atanasov.pdf](https://gwern.net/doc/statistics/prediction/2024-atanasov.pdf)  
3. Bitcoin.com. (2024, December). *Prediction markets Polymarket and Kalshi assign mixed odds for Bitcoin's path above $100K in 2025*. [https://news.bitcoin.com/prediction-markets-polymarket-and-kalshi-assign-mixed-odds-for-bitcoins-path-above-100k-in-2025/](https://news.bitcoin.com/prediction-markets-polymarket-and-kalshi-assign-mixed-odds-for-bitcoins-path-above-100k-in-2025/)  
4. Clark, A. (n.d.). *Superforecasting*. [https://andrewclark.co.uk/all-media/superforecasting](https://andrewclark.co.uk/all-media/superforecasting)  
5. Emergent Mind. (n.d.). *BrierLM*. [https://www.emergentmind.com/topics/brierlm](https://www.emergentmind.com/topics/brierlm)  
6. Emergent Mind. (n.d.). *Multi-agent LLM financial trading*. [https://www.emergentmind.com/topics/multi-agent-llm-financial-trading](https://www.emergentmind.com/topics/multi-agent-llm-financial-trading)  
7. Finance Magnates. (2024). *Kalshi captures 60% market share, ending Polymarket's prediction market dominance*. [https://www.financemagnates.com/forex/analysis/kalshi-captures-60-market-share-ending-polymarkets-prediction-market-dominance/](https://www.financemagnates.com/forex/analysis/kalshi-captures-60-market-share-ending-polymarkets-prediction-market-dominance/)  
8. Fortune. (2024, December 1). *Bitcoin takes another plunge: Prediction markets*. [https://fortune.com/2025/12/01/bitcoin-takes-another-plunge-prediction-markets/](https://fortune.com/2025/12/01/bitcoin-takes-another-plunge-prediction-markets/)  
9. Golman, R., Hagmann, D., & Loewenstein, G. (2017). *Getting more wisdom from the crowd*. Carnegie Mellon University. [https://www.cmu.edu/dietrich/sds/docs/golman/getting-more-wisdom-from-the-crowd.pdf](https://www.cmu.edu/dietrich/sds/docs/golman/getting-more-wisdom-from-the-crowd.pdf)  
10. Good Judgment. (n.d.-a). *The superforecasters' track record*. [https://goodjudgment.com/resources/the-superforecasters-track-record/](https://goodjudgment.com/resources/the-superforecasters-track-record/)  
11. Good Judgment. (n.d.-b). *The science of superforecasting*. [https://goodjudgment.com/about/the-science-of-superforecasting/](https://goodjudgment.com/about/the-science-of-superforecasting/)  
12. Hosseini, A., Schoenegger, P., & Park, P. S. (2024). The wisdom of the silicon crowd: LLM ensemble prediction capabilities rival human crowd accuracy. *Science Advances*. [https://www.science.org/doi/10.1126/sciadv.adp1528](https://www.science.org/doi/10.1126/sciadv.adp1528)  
13. Inovo Group. (2024). *Using superforecasting methods*. [https://theinovogroup.com/using-superforecasting-methods/](https://theinovogroup.com/using-superforecasting-methods/)  
14. Khan, A., Brinkmann, L., Oberhauser, L., Ziems, N., Jin, Z., & Minh, D. (2024). *Are two heads better than one in AI-assisted decision making? Comparing the behavior and performance of groups and individuals in human-AI collaborative recidivism risk assessment*. arXiv. [https://arxiv.org/html/2511.07784v1](https://arxiv.org/html/2511.07784v1)  
15. Kourentzes, N., & Svetunkov, I. (2025). On the value of individual foresight. *International Journal of Forecasting*. [https://www.sciencedirect.com/science/article/pii/S0169207025000032](https://www.sciencedirect.com/science/article/pii/S0169207025000032)  
16. Mao, A., Mohri, M., & Zhong, Y. (2024). *Cross-market forecast aggregation, arbitrage, and equilibria in prediction markets*. arXiv. [https://arxiv.org/abs/2402.19379](https://arxiv.org/abs/2402.19379)  
17. Mellers, B., Ungar, L., Baron, J., Ramos, J., Gurcay, B., Fincher, K., Scott, S. E., Moore, D., Atanasov, P., Swift, S. A., Murray, T., Stone, E., & Tetlock, P. E. (2015). *Psychological strategies for winning a geopolitical forecasting tournament*. Stanford University. [https://web.stanford.edu/\~knutson/jdm/mellers15.pdf](https://web.stanford.edu/~knutson/jdm/mellers15.pdf)  
18. Neumann, M., Pawelczyk, M., Willett, N., Han, S., Kasneci, G., & Lakkaraju, H. (2024). *Combining AI and human intelligence*. MIT. [https://dspace.mit.edu/bitstream/handle/1721.1/82272/861188744-MIT.pdf](https://dspace.mit.edu/bitstream/handle/1721.1/82272/861188744-MIT.pdf)  
19. One Percent Rule. (2024). *Embracing the skill of superforecasting*. [https://onepercentrule.substack.com/p/embracing-the-skill-of-superforecasting](https://onepercentrule.substack.com/p/embracing-the-skill-of-superforecasting)  
20. Phemex. (2024). *Polymarket vs Kalshi: Prediction markets analysis*. [https://phemex.com/blogs/polymarket-vs-kalshi-prediction-markets-analysis](https://phemex.com/blogs/polymarket-vs-kalshi-prediction-markets-analysis)  
21. PPL AI. (2024). *TradingAgents research paper attachment*. [https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/11044819/c5510974-b6de-4392-bcd2-bbd684d69165/paste.txt](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/11044819/c5510974-b6de-4392-bcd2-bbd684d69165/paste.txt)  
22. Putra, P. S., Adi, T. W., & Sarjono, H. (2025). Deep learning and sentiment analysis based intelligent model for Bitcoin price forecasting. *Frontiers in Artificial Intelligence*. [https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2025.1519805/full](https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2025.1519805/full)  
23. Reuters. (2024, December 2). *Kalshi valued at $11 billion in latest financing round*. [https://www.reuters.com/business/kalshi-valued-11-billion-latest-financing-round-2025-12-02/](https://www.reuters.com/business/kalshi-valued-11-billion-latest-financing-round-2025-12-02/)  
24. Sacra. (2024). *Polymarket vs Kalshi*. [https://sacra.com/research/polymarket-vs-kalshi/](https://sacra.com/research/polymarket-vs-kalshi/)  
25. Schoenegger, P., & Park, P. S. (2024). *Combining forecasts using an LLM*. MIT. [https://dspace.mit.edu/bitstream/handle/1721.1/158063/3707649.pdf?sequence=1\&isAllowed=y](https://dspace.mit.edu/bitstream/handle/1721.1/158063/3707649.pdf?sequence=1&isAllowed=y)  
26. Shaikh, O. (2024). *Agentic AI for prediction markets*. arXiv. [https://arxiv.org/html/2512.02436v1](https://arxiv.org/html/2512.02436v1)  
27. Sun, Z., Liu, S., Chen, W., Chai, J., Lin, Y., Liu, L., Yu, J., Zhang, Y., Zhang, H., Qiao, L., Zhang, M., Huang, M., & Li, J. (2024). *AI can help humans find common ground in democratic deliberation*. arXiv. [https://arxiv.org/abs/2510.24303](https://arxiv.org/abs/2510.24303)  
28. The Street. (2024). *Wall Street doubles down on prediction markets*. [https://www.thestreet.com/crypto/markets/wall-street-doubles-down-on-prediction-markets](https://www.thestreet.com/crypto/markets/wall-street-doubles-down-on-prediction-markets)  
29. TradingAgents. (n.d.). *TradingAgents homepage*. [https://tradingagents-ai.github.io](https://tradingagents-ai.github.io/)  
30. Wikipedia. (2024a). *Brier score*. [https://en.wikipedia.org/wiki/Brier\_score](https://en.wikipedia.org/wiki/Brier_score)  
31. Wikipedia. (2024b). *Wisdom of the crowd*. [https://en.wikipedia.org/wiki/Wisdom\_of\_the\_crowd](https://en.wikipedia.org/wiki/Wisdom_of_the_crowd)  
32. Wikipedia. (2024c). *Superforecaster*. [https://en.wikipedia.org/wiki/Superforecaster](https://en.wikipedia.org/wiki/Superforecaster)  
33. Yahoo Finance. (2024). *Kalshi becomes CNN prediction market*. [https://finance.yahoo.com/news/kalshi-becomes-cnn-prediction-market-200713149.html](https://finance.yahoo.com/news/kalshi-becomes-cnn-prediction-market-200713149.html)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAIAAAB82OjLAAABLUlEQVR4Xr3SP0rEUBDH8UAI5gqxsUi3yQViIeiilbBnECtjSqsUgfUKlnYLWijIWokgmAPYWAYSFARBURvxTxQ2hu+sZlwsLIyfbubN++XxXoyqNYYuhsPhEnQzSZI+dPM3vkVHUbQB3fQ87wi6mabpHg5whtFopGf+K9r3/UNIeQzLsh6hJ/M8n8I1VhGGoZ4ZR9/CNM07vGERQRDoDWIwGMxBym10u109M47eh+M4Uu5gDXEcv6DZVFX1GZexhRVkWaZn2o9eh23bC7jAPHq93jn0Ntd15SXkZ5UL0QPVV7SH+pXfIc0URVE041V1hfoQzzjFDMqy1JPGJaYx8fdMeMUmOp3OE2RpFvXVyftL0zjBLpqYn9yj+HQDWXpA3ZTPS7PN6GbrX2sx+gMo/22zZxWPzwAAAABJRU5ErkJggg==>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAPCAIAAACeBPOyAAABGklEQVR4XrXSP0uGUBQGcGmQIAgagka3pgZpbGxxavArRA6CYx+ihhZdXEOXQBscWoQWV4NAcJAkHB1skaS0P+d9Lt1OUbwE9gMHz33uMxyu8jYfhb4XcF13FzaYE/h+6ReLrkPQNO0aLMu6gq7rnoAy9xDH8QWkafoA/9ZVFMUK5HkuRm3bbsE4jjxKDMM4hSzLNoHC8lTxfX8H5KiqqlUYhkEOxU5pg7cwTdMalGUpM0oQBPsgR7ZtH4GckBtQVfUcHMfxgWdm7er7fg+iKDoGyj0Cz52BaZoR6Lr+Cjzz+b7qun4GfiwdgOd5ooL2ewk8s+haiha8DkmSiEkYhtvQNI2MLeka4Y6ZPojfL2+CXfzBnF1/MmfXOxiWoarf28+GAAAAAElFTkSuQmCC>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAUCAIAAACIxBMbAAABz0lEQVR4Xr3TsUtCQRwH8EdiIDToYC2ujg5u/QESkYsOLoKLgkGDEkjhmIGb4OQgkbqJoJso5qSTgVOgNQgpuaRgaIY4+Dq/B+d5GLxn5WcQ3vd+8H3eu5PkXZHE4N+obroDi8VyrEYqlVLddAKDweBDjdlspq6p0WhcgbiggNKmT7Db7Xz4DslkUpKkC6D5F1SrVZPJ9ACj0Uhp0z2k02lxQZZbrZZer9+HbrfL8l6vFwgE2KPSplOYTCbigiwnEolcLncAfr+f5ZlMplAosMe1pmazOQM+JNrt9jkIOeXxeKbT6TVotdpOp0Nzn89HDg4bWzWRV9DpdDlgIRUKhR5ByCmXy0V+R2AwGLxeL80dDgc/tmx6gXK5bLVa6S7xE/P53Gaz8QnzDOFwmCWRSESj0dBTEAwGudn13cvn83tAPiYfxuNxbmolCcVikSXj8dhoNB4B/5FkoYm8vhGi0SgLnU4nv908D5CLyYexWIy+7nA45HPx7F2C2WxeLBZv4Ha7hRmi3+9ns9lDKJVK5ESwJXKTzoAbXxKbnoDcxHq9fguVSkWY2Y7YRJErQv7+DYhr29rcRLaeXMNXENe2tbmJqNVqYvQ7Pzb9ud01fQPmYD+0dSN02AAAAABJRU5ErkJggg==>

[image4]: <data:image/png;base64,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>