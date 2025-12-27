'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { ApiReferenceReact } from '@scalar/api-reference-react'
import '@scalar/api-reference-react/style.css'

interface APIPageProps {
  document?: any
  operations?: Array<{ path: string; method: string }>
  className?: string
  children?: React.ReactNode
}

export function APIPage({ className, children, document, operations, ...props }: APIPageProps) {
  if (document && typeof document === 'object') {
    let spec = document

    // Optional: Filter operations if needed
    if (operations && Array.isArray(operations) && operations.length > 0) {
      // Filter paths in the spec to only show the requested operations
      const filteredPaths: Record<string, any> = {}
      let hasMatches = false

      operations.forEach(op => {
        // Handle path matching (simple exact match for now)
        // OpenAPI paths might have variables {x}, check exact string match from prop
        const pathKey = op.path
        if (spec.paths && spec.paths[pathKey]) {
          if (!filteredPaths[pathKey]) filteredPaths[pathKey] = {}
          // If method is specified, include only that method
          if (op.method) {
            const method = op.method.toLowerCase()
            if (spec.paths[pathKey][method]) {
              filteredPaths[pathKey][method] = spec.paths[pathKey][method]
              hasMatches = true
            }
          } else {
            // Include all methods for this path?
            filteredPaths[pathKey] = spec.paths[pathKey]
            hasMatches = true
          }
        }
      })

      if (hasMatches) {
        spec = {
          ...spec,
          paths: filteredPaths
        }
      }
    }

    return (
      <div className={cn('api-page rounded-lg border bg-card overflow-hidden', className)} {...props}>
        <ApiReferenceReact
          configuration={{
            spec: { content: spec },
            darkMode: true,
            hideModels: true, // Optional: clean up view for single endpoints
            // hideSidebar: true // If we only want the content
          }}
        />
      </div>
    )
  }

  // Fallback to children (if any)
  return (
    <div
      className={cn('api-page rounded-lg border bg-card p-6', className)}
      {...props}
    >
      {children}
    </div>
  )
}
