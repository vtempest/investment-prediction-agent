import { defineConfig } from '@hey-api/openapi-ts';

export const baseUrl = process.env.API_URL || 'https://autoinvestment.broker/api';

export const config = {
  input: '../lib/openapi/investment-agent-openapi.json',
  output: './src',
  plugins: [
    {
      name: '@hey-api/client-fetch',
      runtimeConfigPath: '../baseurl.ts',
    },
  ],
};

export default defineConfig(config);
