/**
 * Development Environment Configuration
 * Enterprise-grade Nuxeo integration settings for local development
 */

import { INuxeoConfig } from '../core/interfaces';

export const environment = {
  production: false,
  name: 'development',
  
  // Nuxeo Platform Configuration
  nuxeo: {
    baseURL: 'http://localhost:8080/nuxeo/',
    auth: {
      method: 'basic' as const,
      username: 'Administrator',
      password: 'Administrator'
    },
    timeout: 30000, // 30 seconds
    httpTimeout: 30000, // 30 seconds  
    transactionTimeout: 300, // 5 minutes in seconds
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
    debug: true,
    logLevel: 'debug' as const
  },

  // API Configuration
  api: {
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
    enableCaching: false,
    cacheTimeout: 300000 // 5 minutes
  },

  // Security Configuration
  security: {
    enableCSRF: false, // Disabled for development
    corsEnabled: true,
    allowedOrigins: ['http://localhost:4201']
  }
};