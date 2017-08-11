/**
 * Get deep value from object
 * @param {Object} obj
 * @param {string} graphPath
 * @return {*|null}
 */
export function getDeepValue(obj, graphPath) {
  const parts = graphPath.split('.');
  let root = obj;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (root[part] && root.hasOwnProperty(part)) {
      root = root[part];
    } else {
      return null;
    }
  }
  return graphPath.split('.').reduce((a, b) => a[b], obj);
}

/**
 * Creating an object with values equal to its keys
 * @function keyMirror
 * @access public
 * @param {Object} obj
 * @returns {Object}
 */
export function keyMirror(obj) {
  Object.keys(obj).forEach(key => Object.assign(obj, {[key]: key}));
  return obj;
}

/**
 * Convert declarative reducer to standard reducer
 * @function createReducer
 * @access public
 * @param {Object} initialState
 * @param {Object} reducerMap
 * @returns {Object}
 */
export function createReducer(initialState, reducerMap) {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type];
    return reducer ? reducer(state, action.payload, action.meta) : state;
  };
}

/**
 * Returns the decoded query part of the URI string parameters
 *
 * @function setQueryParams
 * @access public
 * @param {Object} query - Queries set
 * @returns {string}
 */
export function setQueryParams(query) {
  const params = Object.keys(query)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
    .join('&')
    .replace(/%20/g, '+');
  return `?${params}`;
}

/**
 * Formats the specified date using the rules of this date format
 *
 * @function formatDateString
 * @access public
 * @param {string} dateString - Date String
 * @param {string} [locale=en-US] - Locale String
 * @returns {string}
 */
export function formatDateString(dateString, locale = 'en-US') {
  const date = new Date(Date.parse(dateString));
  return date.toLocaleString(locale);
}

/**
 * Gets a user locale language
 *
 * @function formatDateString
 * @access public
 * @param {Object} [options={}]
 * @param {Array} options.supportedLocales An array of supported locales
 * @returns {string|boolean}
 */
export function getCurrentLocale(options = {}) {
  const defaultLocale = 'en-US';
  if (typeof navigator === 'undefined') return defaultLocale;
  const browserLanguage = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
  if (typeof options.supportedLocales === 'undefined') return browserLanguage;
  if (options.supportedLocales.indexOf(browserLanguage) > -1) return browserLanguage;
  return defaultLocale;
}

/**
 * Open a window
 * @function openWindow
 * @access public
 * @param {string} url
 * @param {boolean} [useBlank=true]
 * @param {boolean} [crossDomain=false]
 */
export function openWindow(url, useBlank = true, crossDomain = false) {
  if (useBlank) {
    const target = window.open(url, '_blank');
    if (!target && !crossDomain) window.location.assign(url, '_blank');
  } else {
    window.location.replace(url);
  }
}
