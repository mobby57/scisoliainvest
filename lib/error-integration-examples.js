/**
 * Example integration of error handling in Next.js PWA
 * 
 * This file demonstrates how to integrate the error handling system
 * into a Next.js application with PWA features.
 */

import { defaultLogger } from './lib/error-logger.js';
import { ERROR_CODES } from './lib/errors.js';

// ============================================================================
// Example 1: Initialize in _app.js
// ============================================================================

/**
 * pages/_app.js
 * Initialize the error logger and set up global error handlers
 * 
 * Example code (JSX):
 * 
 * import { useEffect } from 'react';
 * import { defaultLogger } from '../lib/error-logger';
 * 
 * function MyApp({ Component, pageProps }) {
 *   useEffect(() => {
 *     // Initialize the logger
 *     defaultLogger.initialize().then(() => {
 *       console.log('Error logger initialized');
 *     });
 *     
 *     // Global error handler for unhandled errors
 *     window.addEventListener('error', async (event) => {
 *       await defaultLogger.logError('ER_BUILD_FAIL', {
 *         message: event.message,
 *         filename: event.filename,
 *         lineno: event.lineno,
 *         colno: event.colno,
 *         stack: event.error?.stack,
 *         timestamp: new Date().toISOString()
 *       });
 *     });
 *     
 *     // Handler for unhandled promise rejections
 *     window.addEventListener('unhandledrejection', async (event) => {
 *       await defaultLogger.logNetworkIssue({
 *         reason: event.reason,
 *         promise: String(event.promise),
 *         timestamp: new Date().toISOString()
 *       });
 *     });
 *     
 *     // Register Service Worker with error handling
 *     if ('serviceWorker' in navigator) {
 *       navigator.serviceWorker
 *         .register('/sw.js')
 *         .then(registration => {
 *           console.log('SW registered:', registration);
 *         })
 *         .catch(async (error) => {
 *           await defaultLogger.logServiceWorkerFailure({
 *             error: error.message,
 *             stack: error.stack,
 *             userAgent: navigator.userAgent,
 *             protocol: window.location.protocol
 *           });
 *         });
 *     }
 *   }, []);
 *   
 *   return <Component {...pageProps} />;
 * }
 * 
 * export default MyApp;
 */
export function setupAppErrorHandling() {
  // This is a placeholder function for the example above
  return 'See comment block above for JSX implementation';
}

// ============================================================================
// Example 2: API Route with Error Handling
// ============================================================================

/**
 * pages/api/users.js
 * Example API route with comprehensive error handling
 */
export async function apiHandler(req, res) {
  try {
    // Validate request
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Fetch data
    const response = await fetch(process.env.API_URL + '/users');
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const users = await response.json();
    res.status(200).json(users);
    
  } catch (error) {
    // Log the error
    await defaultLogger.logServerConfigError({
      endpoint: '/api/users',
      method: req.method,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    // Return error response
    res.status(500).json({
      error: 'Internal Server Error',
      code: ERROR_CODES.ER_SERVER_CONFIG.code,
      message: ERROR_CODES.ER_SERVER_CONFIG.message
    });
  }
}

// ============================================================================
// Example 3: Component with Network Error Handling
// ============================================================================

/**
 * Component that fetches data with retry logic and error logging
 * 
 * Example code (JSX):
 * 
 * import { useState, useEffect } from 'react';
 * import { defaultLogger } from '../lib/error-logger';
 * 
 * function DataFetcher() {
 *   const [data, setData] = useState(null);
 *   const [error, setError] = useState(null);
 *   const [loading, setLoading] = useState(true);
 *   
 *   useEffect(() => {
 *     async function fetchWithRetry(url, retries = 3) {
 *       for (let i = 0; i < retries; i++) {
 *         try {
 *           const response = await fetch(url);
 *           
 *           if (!response.ok) {
 *             throw new Error(`HTTP ${response.status}`);
 *           }
 *           
 *           return await response.json();
 *           
 *         } catch (error) {
 *           await defaultLogger.logNetworkIssue({
 *             url,
 *             attempt: i + 1,
 *             maxRetries: retries,
 *             error: error.message,
 *             component: 'DataFetcherComponent'
 *           });
 *           
 *           if (i === retries - 1) {
 *             throw error;
 *           }
 *           
 *           await new Promise(resolve => 
 *             setTimeout(resolve, Math.pow(2, i) * 1000)
 *           );
 *         }
 *       }
 *     }
 *     
 *     fetchWithRetry('/api/data')
 *       .then(result => {
 *         setData(result);
 *         setLoading(false);
 *       })
 *       .catch(error => {
 *         setError(error);
 *         setLoading(false);
 *       });
 *   }, []);
 *   
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   return <div>{JSON.stringify(data)}</div>;
 * }
 * 
 * export default DataFetcher;
 */
export function setupDataFetcherErrorHandling() {
  // This is a placeholder function for the example above
  return 'See comment block above for JSX implementation';
}

// ============================================================================
// Example 4: Build-time Error Handling
// ============================================================================

/**
 * next.config.js
 * Handle build errors and log them
 */
export function nextConfigWithErrorHandling() {
  const { defaultLogger } = require('./lib/error-logger.js');
  
  return {
    webpack: (config, { dev, isServer }) => {
      // Add error handling for webpack compilation
      config.plugins.push({
        apply: (compiler) => {
          compiler.hooks.done.tap('ErrorLogger', async (stats) => {
            if (stats.hasErrors()) {
              const errors = stats.compilation.errors;
              
              for (const error of errors) {
                await defaultLogger.logBuildFailure({
                  error: error.message,
                  stack: error.stack,
                  module: error.module?.resource,
                  isServer,
                  timestamp: new Date().toISOString()
                });
              }
            }
          });
        }
      });
      
      return config;
    }
  };
}

// ============================================================================
// Example 5: PWA Manifest Error Detection
// ============================================================================

/**
 * Validate manifest.json and log errors
 */
export async function validateManifest() {
  try {
    const response = await fetch('/manifest.json');
    
    if (!response.ok) {
      throw new Error(`Manifest not found (${response.status})`);
    }
    
    const manifest = await response.json();
    
    // Validate required fields
    const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
    const missingFields = requiredFields.filter(field => !manifest[field]);
    
    if (missingFields.length > 0) {
      await defaultLogger.logManifestError({
        reason: 'Missing required fields',
        fields: missingFields,
        manifest: manifest
      });
      return false;
    }
    
    // Validate icons
    if (!manifest.icons || manifest.icons.length === 0) {
      await defaultLogger.logManifestError({
        reason: 'No icons defined',
        manifest: manifest
      });
      return false;
    }
    
    // Check for 512x512 icon
    const has512Icon = manifest.icons.some(icon => 
      icon.sizes === '512x512' || icon.sizes.includes('512x512')
    );
    
    if (!has512Icon) {
      await defaultLogger.logManifestError({
        reason: 'Missing 512x512 icon',
        icons: manifest.icons
      });
      return false;
    }
    
    return true;
    
  } catch (error) {
    await defaultLogger.logManifestError({
      error: error.message,
      stack: error.stack
    });
    return false;
  }
}

// ============================================================================
// Example 6: Service Worker with Cache Strategy Error Handling
// ============================================================================

/**
 * public/sw.js
 * Service Worker with comprehensive error handling
 */
export const serviceWorkerCode = `
const CACHE_NAME = 'solia-invest-v1';
const CACHE_URLS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_URLS))
      .catch(error => {
        // Log cache strategy error
        console.error('Cache installation failed:', error);
        // Could send to logging endpoint here
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        );
      })
      .catch(error => {
        console.error('Cache cleanup failed:', error);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then(response => {
            // Only cache successful GET requests
            if (event.request.method === 'GET' && response.status === 200) {
              const responseToCache = response.clone();
              
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseToCache))
                .catch(error => {
                  console.error('Failed to cache response:', error);
                  // Could log ER_CACHE_STRATEGY here
                });
            }
            
            return response;
          });
      })
      .catch(error => {
        console.error('Fetch failed:', error);
        // Return offline page
        return caches.match('/offline');
      })
  );
});
`;

// ============================================================================
// Example 7: Custom Handler for External Monitoring
// ============================================================================

/**
 * Set up custom handlers for external services
 */
export async function setupMonitoring() {
  // Handler for Sentry
  defaultLogger.registerHandler(async (logEntry) => {
    if (logEntry.severity === 'critical' || logEntry.severity === 'high') {
      // Send to Sentry
      if (typeof Sentry !== 'undefined') {
        Sentry.captureException(new Error(logEntry.message), {
          level: logEntry.severity,
          tags: {
            errorCode: logEntry.code,
            category: logEntry.category
          },
          extra: logEntry.context
        });
      }
    }
  });
  
  // Handler for Slack notifications
  defaultLogger.registerHandler(async (logEntry) => {
    if (logEntry.severity === 'critical') {
      try {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 Critical Error: ${logEntry.code}`,
            attachments: [{
              color: 'danger',
              fields: [
                { title: 'Message', value: logEntry.message, short: false },
                { title: 'Severity', value: logEntry.severity, short: true },
                { title: 'Category', value: logEntry.category, short: true },
                { title: 'Time', value: logEntry.timestamp, short: false }
              ]
            }]
          })
        });
      } catch (error) {
        console.error('Failed to send Slack notification:', error);
      }
    }
  });
  
  // Handler for custom analytics
  defaultLogger.registerHandler(async (logEntry) => {
    try {
      await fetch('/api/analytics/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: logEntry.code,
          severity: logEntry.severity,
          category: logEntry.category,
          timestamp: logEntry.timestamp
        })
      });
    } catch (error) {
      console.error('Failed to send analytics:', error);
    }
  });
}

// ============================================================================
// Example 8: Error Monitoring Dashboard API
// ============================================================================

/**
 * pages/api/admin/error-stats.js
 * API endpoint for error statistics dashboard
 */
export async function errorStatsHandler(req, res) {
  // Add authentication here
  
  try {
    const logs = await defaultLogger.getLogs();
    
    // Calculate statistics
    const stats = {
      total: logs.length,
      bySeverity: {
        critical: logs.filter(l => l.severity === 'critical').length,
        high: logs.filter(l => l.severity === 'high').length,
        medium: logs.filter(l => l.severity === 'medium').length,
        low: logs.filter(l => l.severity === 'low').length
      },
      byCategory: {
        server: logs.filter(l => l.category === 'server').length,
        build: logs.filter(l => l.category === 'build').length,
        network: logs.filter(l => l.category === 'network').length,
        pwa: logs.filter(l => l.category === 'pwa').length
      },
      byCode: {},
      recent: logs.slice(-10).reverse(),
      hourly: calculateHourlyStats(logs)
    };
    
    // Count by error code
    logs.forEach(log => {
      stats.byCode[log.code] = (stats.byCode[log.code] || 0) + 1;
    });
    
    res.status(200).json(stats);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

function calculateHourlyStats(logs) {
  const hourly = {};
  const now = new Date();
  
  for (let i = 0; i < 24; i++) {
    const hour = new Date(now);
    hour.setHours(now.getHours() - i);
    const key = hour.toISOString().substring(0, 13);
    hourly[key] = 0;
  }
  
  logs.forEach(log => {
    const hour = log.timestamp.substring(0, 13);
    if (hour in hourly) {
      hourly[hour]++;
    }
  });
  
  return hourly;
}

// ============================================================================
// Example 9: Testing Error Logging
// ============================================================================

/**
 * Manual testing of error logging system
 */
export async function testErrorLogging() {
  console.log('Testing error logging system...');
  
  // Test each error type
  await defaultLogger.logServerConfigError({ 
    test: true, 
    reason: 'Testing server config error' 
  });
  
  await defaultLogger.logBuildFailure({ 
    test: true, 
    reason: 'Testing build failure' 
  });
  
  await defaultLogger.logNetworkIssue({ 
    test: true, 
    reason: 'Testing network issue' 
  });
  
  await defaultLogger.logServiceWorkerFailure({ 
    test: true, 
    reason: 'Testing SW failure' 
  });
  
  await defaultLogger.logManifestError({ 
    test: true, 
    reason: 'Testing manifest error' 
  });
  
  await defaultLogger.logCacheStrategyError({ 
    test: true, 
    reason: 'Testing cache strategy error' 
  });
  
  // Get and display logs
  const logs = await defaultLogger.getLogs();
  console.log(`Total errors logged: ${logs.length}`);
  console.log('Logs:', logs);
  
  // Clean up test logs
  await defaultLogger.clearLogs();
  console.log('Test logs cleared');
}

// Export for use
export default {
  setupAppErrorHandling,
  apiHandler,
  setupDataFetcherErrorHandling,
  validateManifest,
  setupMonitoring,
  errorStatsHandler,
  testErrorLogging
};
