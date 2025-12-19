// @ts-nocheck
import { frontmatter as __fd_glob_15 } from "../content/docs/trading-strategies.md?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_14 } from "../content/docs/timeseries-correlations.md?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_13 } from "../content/docs/technical-indicators.md?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_12 } from "../content/docs/risk-disclosure.md?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_11 } from "../content/docs/research-analyst-debate.md?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_10 } from "../content/docs/investment-dictionary.md?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_9 } from "../content/docs/initialization-and-usage.md?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_8 } from "../content/docs/index.md?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_7 } from "../content/docs/fundamentals.md?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_6 } from "../content/docs/debate-agents-prompts.md?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_5 } from "../content/docs/brokers.md?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_4 } from "../content/docs/broker-app-agreement.md?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_3 } from "../content/docs/REALTIME_CHARTS.md?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_2 } from "../content/docs/DASHBOARD_API_README.md?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_1 } from "../content/docs/API_DATA_SUMMARY.md?collection=docs&only=frontmatter"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
    docs: {
      /**
       * extracted references (e.g. hrefs, paths), useful for analyzing relationships between pages.
       */
      extractedReferences: import("fumadocs-mdx").ExtractedReference[];
    },
  }
} & {
  DocData: {
    docs: {
      /**
       * Last modified date of document file, obtained from version control.
       *
       */
      lastModified?: Date;
    },
  }
}>({"doc":{"passthroughs":["extractedReferences","lastModified"]}});

export const docs = await create.docsLazy("docs", "content/docs", {"meta.json": __fd_glob_0, }, {"API_DATA_SUMMARY.md": __fd_glob_1, "DASHBOARD_API_README.md": __fd_glob_2, "REALTIME_CHARTS.md": __fd_glob_3, "broker-app-agreement.md": __fd_glob_4, "brokers.md": __fd_glob_5, "debate-agents-prompts.md": __fd_glob_6, "fundamentals.md": __fd_glob_7, "index.md": __fd_glob_8, "initialization-and-usage.md": __fd_glob_9, "investment-dictionary.md": __fd_glob_10, "research-analyst-debate.md": __fd_glob_11, "risk-disclosure.md": __fd_glob_12, "technical-indicators.md": __fd_glob_13, "timeseries-correlations.md": __fd_glob_14, "trading-strategies.md": __fd_glob_15, }, {"API_DATA_SUMMARY.md": () => import("../content/docs/API_DATA_SUMMARY.md?collection=docs"), "DASHBOARD_API_README.md": () => import("../content/docs/DASHBOARD_API_README.md?collection=docs"), "REALTIME_CHARTS.md": () => import("../content/docs/REALTIME_CHARTS.md?collection=docs"), "broker-app-agreement.md": () => import("../content/docs/broker-app-agreement.md?collection=docs"), "brokers.md": () => import("../content/docs/brokers.md?collection=docs"), "debate-agents-prompts.md": () => import("../content/docs/debate-agents-prompts.md?collection=docs"), "fundamentals.md": () => import("../content/docs/fundamentals.md?collection=docs"), "index.md": () => import("../content/docs/index.md?collection=docs"), "initialization-and-usage.md": () => import("../content/docs/initialization-and-usage.md?collection=docs"), "investment-dictionary.md": () => import("../content/docs/investment-dictionary.md?collection=docs"), "research-analyst-debate.md": () => import("../content/docs/research-analyst-debate.md?collection=docs"), "risk-disclosure.md": () => import("../content/docs/risk-disclosure.md?collection=docs"), "technical-indicators.md": () => import("../content/docs/technical-indicators.md?collection=docs"), "timeseries-correlations.md": () => import("../content/docs/timeseries-correlations.md?collection=docs"), "trading-strategies.md": () => import("../content/docs/trading-strategies.md?collection=docs"), });