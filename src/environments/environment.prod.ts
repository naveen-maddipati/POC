/**
 * Production Environment Configuration
 * Enterprise-grade Nuxeo integration settings for production deployment
 */

import { INuxeoConfig } from '../core/interfaces';

export const environment = {
  production: true,
  name: 'production',
  
  // Nuxeo Platform Configuration
  nuxeo: {
    baseURL: '/nuxeo/',
    auth: {
      method: 'token' as const,
      token: '' // Set your production token here or configure at runtime
    },
    timeout: 60000, // 60 seconds
    httpTimeout: 60000, // 60 seconds
    transactionTimeout: 600, // 10 minutes in seconds
    schemas: ['dublincore', 'common', 'file'],
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    repositoryName: 'default'
  } as INuxeoConfig,

  // Application Configuration
  app: {
    name: 'POC Enterprise Nuxeo Integration',
    version: '1.0.0',
    debug: false,
    logLevel: 'error' as const
  },

  // API Configuration
  api: {
    retryAttempts: 5,
    retryDelay: 2000, // 2 seconds
    enableCaching: true,
    cacheTimeout: 600000 // 10 minutes
  },

  // Security Configuration
  security: {
    enableCSRF: true,
    corsEnabled: false,
    allowedOrigins: ['http://localhost:8080']
  }
};