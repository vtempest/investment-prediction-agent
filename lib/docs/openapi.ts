import { createOpenAPI } from 'fumadocs-openapi/server'

export const openapi = createOpenAPI({
    input: ['./content/docs/api-reference/openapi.json'],
})
