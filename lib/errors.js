/**
 * Error codes for the SCI Solia Invest PWA
 * 
 * This file defines all error codes used throughout the application
 * with their corresponding messages and severity levels.
 */

export const ERROR_CODES = {
  // Server Configuration Errors
  ER_SERVER_CONFIG: {
    code: 'ER_SERVER_CONFIG',
    message: 'Problème de configuration du serveur',
    description: 'Une erreur s\'est produite lors de la configuration du serveur. Vérifiez les variables d\'environnement et les fichiers de configuration.',
    severity: 'critical',
    category: 'server'
  },

  // Build Errors
  ER_BUILD_FAIL: {
    code: 'ER_BUILD_FAIL',
    message: 'Échec au moment de la compilation ou du build',
    description: 'La compilation ou le build de l\'application a échoué. Vérifiez les logs de build pour plus de détails.',
    severity: 'critical',
    category: 'build'
  },

  // Network Errors
  ER_NETWORK_ISSUE: {
    code: 'ER_NETWORK_ISSUE',
    message: 'Indisponibilité réseau',
    description: 'Une erreur réseau s\'est produite. Vérifiez votre connexion internet ou la disponibilité du serveur.',
    severity: 'high',
    category: 'network'
  },

  // Service Worker Errors
  ER_SW_REGISTER_FAIL: {
    code: 'ER_SW_REGISTER_FAIL',
    message: 'Échec lors de l\'enregistrement du service worker',
    description: 'Le service worker n\'a pas pu être enregistré. Vérifiez que HTTPS est activé et que le navigateur supporte les service workers.',
    severity: 'high',
    category: 'pwa'
  },

  // Manifest Errors
  ER_MANIFEST_ERROR: {
    code: 'ER_MANIFEST_ERROR',
    message: 'Fichier manifest.json invalide ou introuvable',
    description: 'Le fichier manifest.json est manquant, mal formaté ou contient des erreurs. Vérifiez sa présence et sa validité.',
    severity: 'medium',
    category: 'pwa'
  },

  // Cache Strategy Errors
  ER_CACHE_STRATEGY: {
    code: 'ER_CACHE_STRATEGY',
    message: 'Problème avec les stratégies de cache',
    description: 'Une erreur s\'est produite lors de l\'utilisation des stratégies de cache. Vérifiez la configuration du cache et les règles de mise en cache.',
    severity: 'medium',
    category: 'pwa'
  }
};

/**
 * Get error details by code
 * @param {string} code - The error code
 * @returns {Object|null} The error details or null if not found
 */
export function getErrorByCode(code) {
  return ERROR_CODES[code] || null;
}

/**
 * Get all errors by category
 * @param {string} category - The error category
 * @returns {Array} Array of error objects
 */
export function getErrorsByCategory(category) {
  return Object.values(ERROR_CODES).filter(error => error.category === category);
}

/**
 * Get all errors by severity
 * @param {string} severity - The error severity
 * @returns {Array} Array of error objects
 */
export function getErrorsBySeverity(severity) {
  return Object.values(ERROR_CODES).filter(error => error.severity === severity);
}

/**
 * Check if an error code exists
 * @param {string} code - The error code to check
 * @returns {boolean} True if the error code exists
 */
export function isValidErrorCode(code) {
  return code in ERROR_CODES;
}

export default ERROR_CODES;
