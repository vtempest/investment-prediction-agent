import { baseUrl, createMetadata } from '@/lib/metadata'
import '@/styles/globals.css'
import type { Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Body } from './layout.client'
import { Providers } from './providers'
import { NextProvider } from 'fumadocs-core/framework/next'
import { TreeContextProvider } from 'fumadocs-ui/contexts/tree'
import { source } from '@/lib/source'
import { url } from '@/lib/url'
import { DOCS_TITLE, DOCS_DESCRIPTION } from '@/lib/constants'

const geist = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
})

const mono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const metadata = createMetadata({
  title: {
    template: '%s | ' + DOCS_TITLE,
    default: DOCS_TITLE,
  },
  description: DOCS_DESCRIPTION,
  metadataBase: baseUrl,
  alternates: {
    types: {
      'application/rss+xml': [
        {
          title: DOCS_TITLE,
          url: url('/rss.xml'),
        },
      ],
    },
  },
})

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#fff' },
  ],
}

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang='en'
      className={`${geist.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <Body tree={source.pageTree}>
        <NextProvider>
          <TreeContextProvider tree={source.pageTree}>
            <Providers>{children}</Providers>
          </TreeContextProvider>
        </NextProvider>
      </Body>
    </html>
  )
}
