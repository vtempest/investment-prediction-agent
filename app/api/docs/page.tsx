import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen">
      <ApiReferenceReact
        configuration={{
          spec: {
            url: "/api/openapi",
          },
          theme: "default",
          layout: "modern",
          darkMode: true,
          searchHotKey: "k",
          showSidebar: true,
          customCss: `
            .scalar-app {
              --scalar-color-1: hsl(222.2 84% 4.9%);
              --scalar-color-2: hsl(210 40% 96.1%);
              --scalar-color-3: hsl(222.2 47.4% 11.2%);
              --scalar-border-color: hsl(214.3 31.8% 91.4%);
              --scalar-background-1: hsl(0 0% 100%);
              --scalar-background-2: hsl(210 40% 96.1%);
              --scalar-background-3: hsl(222.2 84% 4.9%);
            }
            .dark .scalar-app {
              --scalar-color-1: hsl(210 40% 98%);
              --scalar-color-2: hsl(222.2 84% 4.9%);
              --scalar-color-3: hsl(210 40% 96.1%);
              --scalar-border-color: hsl(217.2 32.6% 17.5%);
              --scalar-background-1: hsl(222.2 84% 4.9%);
              --scalar-background-2: hsl(217.2 32.6% 17.5%);
              --scalar-background-3: hsl(222.2 47.4% 11.2%);
            }
          `,
        }}
      />
    </div>
  );
}

export const metadata = {
  title: "API Documentation - Stock Prediction Agent",
  description: "Interactive API documentation for Stock Prediction Agent",
};
