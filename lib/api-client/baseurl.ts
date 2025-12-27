import type { CreateClientConfig } from './src/client.gen';

export const baseUrl = 'https://autoinvestment.broker/api';

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  baseUrl,
});
