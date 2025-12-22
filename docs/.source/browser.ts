// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
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
}>();
const browserCollections = {
  docs: create.doc("docs", {"broker-app-agreement.md": () => import("../content/docs/broker-app-agreement.md?collection=docs"), "brokers.md": () => import("../content/docs/brokers.md?collection=docs"), "DASHBOARD_API_README.md": () => import("../content/docs/DASHBOARD_API_README.md?collection=docs"), "fundamentals.md": () => import("../content/docs/fundamentals.md?collection=docs"), "index.md": () => import("../content/docs/index.md?collection=docs"), "initialization-and-usage.md": () => import("../content/docs/initialization-and-usage.md?collection=docs"), "investment-dictionary.md": () => import("../content/docs/investment-dictionary.md?collection=docs"), "paper-forecasting-agents.md": () => import("../content/docs/paper-forecasting-agents.md?collection=docs"), "research-analyst-debate.md": () => import("../content/docs/research-analyst-debate.md?collection=docs"), "risk-disclosure.md": () => import("../content/docs/risk-disclosure.md?collection=docs"), "technical-indicators.md": () => import("../content/docs/technical-indicators.md?collection=docs"), "timeseries-correlations.md": () => import("../content/docs/timeseries-correlations.md?collection=docs"), "trading-strategies.md": () => import("../content/docs/trading-strategies.md?collection=docs"), }),
};
export default browserCollections;