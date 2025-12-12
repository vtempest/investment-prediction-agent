"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ExternalLink, Eye, EyeOff, Save } from "lucide-react";

const LLM_PROVIDERS = [
  {
    name: "XAI",
    models: "Grok, Grok Vision",
    docs: "https://docs.x.ai/docs#models",
    keys: "https://console.x.ai/",
    valuation: "$80B",
    revenue: "$100M",
    cost: "$15.00",
    field: "xaiApiKey",
  },
  {
    name: "Groq",
    models: "Llama, DeepSeek, Gemini, Mistral",
    docs: "https://console.groq.com/docs/overview",
    keys: "https://console.groq.com/keys",
    valuation: "$2.8B",
    revenue: "-",
    cost: "$0.79",
    field: "groqApiKey",
  },
  {
    name: "Ollama",
    models: "llama, mistral, mixtral, vicuna, gemma, qwen, deepseek",
    docs: "https://ollama.com/docs",
    keys: "https://ollama.com/settings/keys",
    valuation: "-",
    revenue: "$3.2M",
    cost: "$0",
    field: "ollamaEndpoint",
    isEndpoint: true,
  },
  {
    name: "OpenAI",
    models: "o1, o1-mini, o4, gpt-4, gpt-4-turbo, gpt-4-omni",
    docs: "https://platform.openai.com/docs/overview",
    keys: "https://platform.openai.com/api-keys",
    valuation: "$300B",
    revenue: "$3.7B",
    cost: "$8.00",
    field: "openaiApiKey",
  },
  {
    name: "Anthropic",
    models: "Claude Sonnet, Claude Opus, Claude Haiku",
    docs: "https://docs.anthropic.com/en/docs/welcome",
    keys: "https://console.anthropic.com/settings/keys",
    valuation: "$61.5B",
    revenue: "$1B",
    cost: "$15.00",
    field: "anthropicApiKey",
  },
  {
    name: "TogetherAI",
    models: "Llama, Mistral, Mixtral, Qwen, Gemma, WizardLM",
    docs: "https://docs.together.ai/docs/quickstart",
    keys: "https://api.together.xyz/settings/api-keys",
    valuation: "$3.3B",
    revenue: "$50M",
    cost: "$0.90",
    field: "togetheraiApiKey",
  },
  {
    name: "Perplexity",
    models: "Sonar, Sonar Deep Research",
    docs: "https://docs.perplexity.ai/models/model-cards",
    keys: "https://www.perplexity.ai/account/api/keys",
    valuation: "$18B",
    revenue: "$20M",
    cost: "$15.00",
    field: "perplexityApiKey",
  },
  {
    name: "Cloudflare",
    models: "Llama, Gemma, Mistral, Phi, Qwen, DeepSeek",
    docs: "https://developers.cloudflare.com/workers-ai/",
    keys: "https://dash.cloudflare.com/profile/api-tokens",
    valuation: "$62.3B",
    revenue: "$1.67B",
    cost: "$2.25",
    field: "cloudflareApiKey",
  },
  {
    name: "Google",
    models: "Gemini",
    docs: "https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models",
    keys: "https://cloud.google.com/vertex-ai/generative-ai/docs/start/express-mode/overview#api-keys",
    valuation: "-",
    revenue: "~$400M",
    cost: "$10.00",
    field: "googleApiKey",
  },
];

const BROKERS = [
  {
    name: "Alpaca",
    fields: ["alpacaApiKey", "alpacaApiSecret", "alpacaPaper"],
    docs: "https://alpaca.markets/docs/",
    keys: "https://app.alpaca.markets/paper/dashboard/overview",
  },
  {
    name: "Webull",
    fields: ["webullUsername", "webullPassword", "webullDeviceId"],
    docs: "https://www.webull.com/api",
    keys: "https://app.webull.com/",
  },
  {
    name: "Robinhood",
    fields: ["robinhoodUsername", "robinhoodPassword"],
    docs: "https://robinhood.com/us/en/support/",
    keys: "https://robinhood.com/account",
  },
  {
    name: "Interactive Brokers",
    fields: ["ibkrUsername", "ibkrPassword"],
    docs: "https://www.interactivebrokers.com/api/",
    keys: "https://www.interactivebrokers.com/",
  },
  {
    name: "TD Ameritrade",
    fields: ["tdaApiKey", "tdaRefreshToken"],
    docs: "https://developer.tdameritrade.com/apis",
    keys: "https://developer.tdameritrade.com/user/me/apps",
  },
];

const DATA_PROVIDERS = [
  {
    name: "Alpha Vantage",
    field: "alphaVantageApiKey",
    docs: "https://www.alphavantage.co/documentation/",
    keys: "https://www.alphavantage.co/support/#api-key",
  },
  {
    name: "Finnhub",
    field: "finnhubApiKey",
    docs: "https://finnhub.io/docs/api",
    keys: "https://finnhub.io/dashboard",
  },
  {
    name: "Polygon.io",
    field: "polygonApiKey",
    docs: "https://polygon.io/docs",
    keys: "https://polygon.io/dashboard/api-keys",
  },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/user/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data || {});
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success("Settings saved successfully");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [field]: value }));
  };

  const toggleShowKey = (field: string) => {
    setShowKeys((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your API keys and broker connections</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="llm" className="space-y-6">
        <TabsList>
          <TabsTrigger value="llm">LLM Providers</TabsTrigger>
          <TabsTrigger value="brokers">Brokers</TabsTrigger>
          <TabsTrigger value="data">Data Providers</TabsTrigger>
        </TabsList>

        <TabsContent value="llm" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>LLM API Keys</CardTitle>
              <CardDescription>
                Configure your API keys for various LLM providers. These will be used for AI-powered analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Provider Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Provider</th>
                      <th className="text-left py-2">Models</th>
                      <th className="text-left py-2">Docs</th>
                      <th className="text-left py-2">Keys</th>
                      <th className="text-right py-2">Valuation</th>
                      <th className="text-right py-2">Revenue (2024)</th>
                      <th className="text-right py-2">Cost (1M Output)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LLM_PROVIDERS.map((provider) => (
                      <tr key={provider.name} className="border-b hover:bg-muted/50">
                        <td className="py-3 font-medium">{provider.name}</td>
                        <td className="py-3 text-muted-foreground text-xs">{provider.models}</td>
                        <td className="py-3">
                          <a
                            href={provider.docs}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            Docs <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                        <td className="py-3">
                          <a
                            href={provider.keys}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            Keys <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                        <td className="py-3 text-right">{provider.valuation}</td>
                        <td className="py-3 text-right">{provider.revenue}</td>
                        <td className="py-3 text-right font-medium">{provider.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* API Key Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                {LLM_PROVIDERS.map((provider) => (
                  <div key={provider.field} className="space-y-2">
                    <Label htmlFor={provider.field}>
                      {provider.name} {provider.isEndpoint ? "Endpoint" : "API Key"}
                    </Label>
                    <div className="relative">
                      <Input
                        id={provider.field}
                        type={showKeys[provider.field] ? "text" : "password"}
                        placeholder={provider.isEndpoint ? "http://localhost:11434" : "sk-..."}
                        value={settings[provider.field] || ""}
                        onChange={(e) => updateField(provider.field, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowKey(provider.field)}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                      >
                        {showKeys[provider.field] ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Preferred Provider */}
              <div className="pt-4 border-t">
                <Label htmlFor="preferredProvider">Preferred LLM Provider</Label>
                <select
                  id="preferredProvider"
                  className="w-full mt-2 p-2 border rounded-md"
                  value={settings.preferredProvider || "groq"}
                  onChange={(e) => updateField("preferredProvider", e.target.value)}
                >
                  {LLM_PROVIDERS.map((provider) => (
                    <option key={provider.field} value={provider.field.replace("ApiKey", "").replace("Endpoint", "")}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brokers" className="space-y-6">
          {BROKERS.map((broker) => (
            <Card key={broker.name}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{broker.name}</CardTitle>
                    <CardDescription>Configure your {broker.name} connection</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <a href={broker.docs} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Docs
                      </Button>
                    </a>
                    <a href={broker.keys} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Get Keys
                      </Button>
                    </a>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {broker.fields.map((field) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field}>
                      {field
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())
                        .trim()}
                    </Label>
                    {field === "alpacaPaper" ? (
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={field}
                          checked={settings[field] !== false}
                          onCheckedChange={(checked) => updateField(field, checked)}
                        />
                        <Label htmlFor={field} className="font-normal">
                          Use Paper Trading
                        </Label>
                      </div>
                    ) : (
                      <div className="relative">
                        <Input
                          id={field}
                          type={showKeys[field] ? "text" : "password"}
                          placeholder={field.includes("Key") || field.includes("Secret") ? "••••••••" : ""}
                          value={settings[field] || ""}
                          onChange={(e) => updateField(field, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => toggleShowKey(field)}
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                        >
                          {showKeys[field] ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Provider API Keys</CardTitle>
              <CardDescription>
                Configure API keys for market data providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {DATA_PROVIDERS.map((provider) => (
                <div key={provider.field} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={provider.field}>{provider.name}</Label>
                    <div className="flex gap-2">
                      <a href={provider.docs} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="mr-1 h-3 w-3" />
                          Docs
                        </Button>
                      </a>
                      <a href={provider.keys} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="mr-1 h-3 w-3" />
                          Keys
                        </Button>
                      </a>
                    </div>
                  </div>
                  <div className="relative">
                    <Input
                      id={provider.field}
                      type={showKeys[provider.field] ? "text" : "password"}
                      placeholder="API Key"
                      value={settings[provider.field] || ""}
                      onChange={(e) => updateField(provider.field, e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey(provider.field)}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      {showKeys[provider.field] ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
