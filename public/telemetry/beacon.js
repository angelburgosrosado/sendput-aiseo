/**
 * Lightweight Zero-Dependency AI Website Enhancer Telemetry Beacon SDK
 * Operational client telemetry: errors, vitals, and network failures.
 */
(function (root) {
  'use strict';

  var currentScript = document.currentScript;
  var defaultSiteId = currentScript ? currentScript.getAttribute('data-site-id') : 'default-site';
  var defaultEndpoint = currentScript ? currentScript.getAttribute('data-endpoint') : '/api/v1/telemetry/beacon';

  var config = {
    siteId: defaultSiteId || 'default-site',
    endpoint: defaultEndpoint || '/api/v1/telemetry/beacon',
    enabled: true
  };

  function sendEvent(eventType, payload) {
    if (!config.enabled) return;

    var body = JSON.stringify({
      site_id: config.siteId,
      event_type: eventType,
      url: window.location.href,
      payload: payload,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });

    if (navigator.sendBeacon) {
      try {
        var blob = new Blob([body], { type: 'application/json' });
        var queued = navigator.sendBeacon(config.endpoint, blob);
        if (queued) return;
      } catch (e) {
        // Fallback to fetch
      }
    }

    if (typeof fetch === 'function') {
      try {
        fetch(config.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: body,
          keepalive: true
        }).catch(function () {});
      } catch (e) {}
    }
  }

  // 1. Error Tracking
  window.addEventListener('error', function (event) {
    sendEvent('error', {
      message: event.message || 'Script error',
      filename: event.filename || '',
      lineno: event.lineno || 0,
      colno: event.colno || 0,
      stack: event.error ? event.error.stack : null
    });
  });

  window.addEventListener('unhandledrejection', function (event) {
    var reason = event.reason;
    sendEvent('error', {
      message: 'Unhandled Promise Rejection: ' + (reason ? (reason.message || String(reason)) : 'unknown'),
      stack: reason && reason.stack ? reason.stack : null
    });
  });

  // 2. Performance Tracking
  function recordPerformanceVitals() {
    var nav = performance.getEntriesByType('navigation')[0] || performance.timing;
    var vitals = {
      ttfb: 0,
      domContentLoaded: 0,
      load: 0,
      fcp: 0,
      lcp: 0
    };

    if (nav) {
      if (typeof nav.responseStart === 'number' && typeof nav.requestStart === 'number') {
        vitals.ttfb = Math.max(0, Math.round(nav.responseStart - nav.requestStart));
      }
      if (typeof nav.domContentLoadedEventEnd === 'number' && typeof nav.startTime === 'number') {
        vitals.domContentLoaded = Math.max(0, Math.round(nav.domContentLoadedEventEnd - nav.startTime));
      }
      if (typeof nav.loadEventEnd === 'number' && typeof nav.startTime === 'number') {
        vitals.load = Math.max(0, Math.round(nav.loadEventEnd - nav.startTime));
      }
    }

    var paintEntries = performance.getEntriesByType('paint');
    for (var i = 0; i < paintEntries.length; i++) {
      if (paintEntries[i].name === 'first-contentful-paint') {
        vitals.fcp = Math.round(paintEntries[i].startTime);
      }
    }

    sendEvent('performance', vitals);
  }

  if (document.readyState === 'complete') {
    setTimeout(recordPerformanceVitals, 0);
  } else {
    window.addEventListener('load', function () {
      setTimeout(recordPerformanceVitals, 100);
    });
  }

  // 3. API and Fetch Failure Tracking
  if (typeof window.fetch === 'function') {
    var originalFetch = window.fetch;
    window.fetch = function () {
      var args = arguments;
      var targetUrl = (typeof args[0] === 'string') ? args[0] : (args[0] && args[0].url ? args[0].url : 'unknown');

      // Do not intercept beacon endpoint calls to avoid recursion
      if (targetUrl.indexOf(config.endpoint) !== -1) {
        return originalFetch.apply(this, args);
      }

      var start = Date.now();
      return originalFetch.apply(this, args).then(function (response) {
        if (!response.ok) {
          sendEvent('api_failure', {
            targetUrl: targetUrl,
            status: response.status,
            statusText: response.statusText,
            durationMs: Date.now() - start
          });
        }
        return response;
      }).catch(function (error) {
        sendEvent('api_failure', {
          targetUrl: targetUrl,
          status: 0,
          statusText: error ? (error.message || 'Network Failure') : 'Network Failure',
          durationMs: Date.now() - start
        });
        throw error;
      });
    };
  }

  // Public Interface
  root.initAIEnhancerBeacon = function (userOptions) {
    if (userOptions) {
      if (userOptions.siteId) config.siteId = userOptions.siteId;
      if (userOptions.endpoint) config.endpoint = userOptions.endpoint;
      if (typeof userOptions.enabled === 'boolean') config.enabled = userOptions.enabled;
    }
    return config;
  };

  root.trackTelemetryEvent = function (eventType, payload) {
    sendEvent(eventType, payload);
  };

})(typeof window !== 'undefined' ? window : this);
