"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ExternalLink, Eye, EyeOff, Save, Moon, Sun, Monitor, Copy, RefreshCw } from "lucide-react";
import { TeamsManager } from "@/components/settings/teams-manager";
import { PremiumUpgrade } from "@/components/settings/premium-upgrade";

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
  }
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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/user/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data || {});
        setApiKey(data?.apiKey || "");
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

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success("API key copied to clipboard");
  };

  const regenerateApiKey = async () => {
    setRegenerating(true);
    try {
      const response = await fetch("/api/user/api-key/regenerate", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setApiKey(data.apiKey);
        toast.success("API key regenerated successfully");
      } else {
        toast.error("Failed to regenerate API key");
      }
    } catch (error) {
      console.error("Failed to regenerate API key:", error);
      toast.error("Failed to regenerate API key");
    } finally {
      setRegenerating(false);
    }
  };

  if (loading || !mounted) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-12 pb-24">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your API keys and preferences</p>
          </div>
          <Button onClick={handleSave} disabled={saving} size="lg">
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="space-y-12">
        <section id="premium-upgrade">
          <PremiumUpgrade />
        </section>

        {/* API Key Section */}
        <section id="api-key" className="scroll-mt-20">
          <Card>
            <CardHeader>
              <CardTitle>API Key</CardTitle>
              <CardDescription>
                Use this key as Bearer to authenticate requests to the TimeTravel API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">Your API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="apiKey"
                      type={showApiKey ? "text" : "password"}
                      value={apiKey || "No API key generated yet"}
                      readOnly
                      className="pr-10 font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      {showApiKey ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyApiKey}
                    disabled={!apiKey}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={regenerateApiKey}
                    disabled={regenerating}
                  >
                    {regenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate
                      </>
                    )}
                  </Button>
                </div>
                <h4 className="font-medium mb-2"><a target="_blank" href="/api/docs">API Documentation</a></h4>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Appearance Section */}
        <section id="appearance" className="scroll-mt-20">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Choose your preferred color scheme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setTheme("light")}
                  className={`relative flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors hover:bg-accent ${theme === "light" ? "border-primary" : "border-muted"
                    }`}
                >
                  <Sun className="h-8 w-8" />
                  <span className="font-medium">Light</span>
                  {theme === "light" && (
                    <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>

                <button
                  onClick={() => setTheme("dark")}
                  className={`relative flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors hover:bg-accent ${theme === "dark" ? "border-primary" : "border-muted"
                    }`}
                >
                  <Moon className="h-8 w-8" />
                  <span className="font-medium">Dark</span>
                  {theme === "dark" && (
                    <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>

                <button
                  onClick={() => setTheme("system")}
                  className={`relative flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors hover:bg-accent ${theme === "system" ? "border-primary" : "border-muted"
                    }`}
                >
                  <Monitor className="h-8 w-8" />
                  <span className="font-medium">System</span>
                  {theme === "system" && (
                    <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                {theme === "system"
                  ? "Your theme will match your system preferences"
                  : `Currently using ${theme} mode`}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* LLM Providers Section */}
        <section id="llm" className="scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">LLM Providers</h2>
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
                      <th className="text-left py-2 w-[15%]">Provider</th>
                      <th className="text-left py-2 w-[30%]">API Key</th>
                      <th className="text-left py-2 w-[25%]">Models</th>
                      <th className="text-left py-2 w-[15%]">Links</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LLM_PROVIDERS.map((provider) => (
                      <tr key={provider.name} className="border-b hover:bg-muted/50">
                        <td className="py-3 font-medium align-middle">{provider.name}</td>
                        <td className="py-3 align-middle pr-4">
                          <div className="relative">
                            <Input
                              id={provider.field}
                              type={showKeys[provider.field] ? "text" : "password"}
                              placeholder={provider.isEndpoint ? "http://localhost:11434" : "sk-..."}
                              value={settings[provider.field] || ""}
                              onChange={(e) => updateField(provider.field, e.target.value)}
                              className="h-9"
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
                        </td>
                        <td className="py-3 text-muted-foreground text-xs align-middle">
                          {provider.models}
                        </td>
                        <td className="py-3 align-middle">
                          <div className="flex flex-col gap-1">
                            <a
                              href={provider.docs}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1 text-xs"
                            >
                              Docs <ExternalLink className="h-3 w-3" />
                            </a>
                            <a
                              href={provider.keys}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1 text-xs"
                            >
                              Get Key <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Preferred Provider */}
              <div className="pt-4 border-t">
                <Label htmlFor="preferredProvider">Preferred LLM Provider</Label>
                <select
                  id="preferredProvider"
                  className="w-full mt-2 p-2 border rounded-md bg-background"
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
        </section>

        {/* Brokers Section */}
        <section id="brokers" className="scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Brokers</h2>
          <div className="grid gap-6">
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
          </div>
        </section>

        {/* Data Providers Section */}
        <section id="data" className="scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Data Providers</h2>
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
        </section>

        {/* Teams Section */}
        <section id="teams" className="scroll-mt-20">
          <TeamsManager />
        </section>
      </div>
    </div>
  );
}
