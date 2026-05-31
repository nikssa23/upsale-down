// Main content script for Upsale Blocker
(async function() {
  // Helper to get domain
  function getDomain() {
    return window.location.hostname.replace(/^www\./, '');
  }

  // Load config for the current domain from configs/{domain}.json
  async function loadConfig(domain) {
    try {
      const url = chrome.runtime.getURL(`configs/${domain}.json`);
      const response = await fetch(url);
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      return null;
    }
  }

  // Find and hide upsale messages
  function hideUpsaleMessages(config) {
    if (!config || !config.patterns || !document.body) return;
    try {
      let anyMatch = false;
      config.patterns.forEach(patternObj => {
        const { pattern, lang, parentLevels } = patternObj;
        // Search for text nodes matching the pattern
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        const regex = new RegExp(pattern, 'i');
        while ((node = walker.nextNode())) {
          if (regex.test(node.textContent)) {
            let el = node.parentElement;
            for (let i = 0; i < (parentLevels || 0) && el && el !== document.body; i++) {
              el = el.parentElement || el;
            }
            // Only hide if not already hidden by us
            if (el && el !== document.body && el.getAttribute('data-upsale-blocked') !== 'true') {
              anyMatch = true;
              el.setAttribute('data-upsale-blocked', 'true');
              el.style.opacity = '0';
              el.style.pointerEvents = 'none';
            }
          }
        }
      });
      if (anyMatch) {
        console.log('Upsale pattern matched and hidden.');
      } else {
        console.log('No upsale patterns matched this time.');
      }
    } catch (e) {
      console.warn('Upsale Blocker error:', e);
    }
  }

  const domain = getDomain();
  const config = await loadConfig(domain);
  if (config) {
    // Run first check instantly
    hideUpsaleMessages(config);
    // Debounce to prevent recursive MutationObserver firing
    let debounceTimer = null;
    const observer = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        observer.disconnect();
        hideUpsaleMessages(config);
        if (document.body) {
          observer.observe(document.body, { childList: true, subtree: true });
        }
      }, 300);
    });
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }
})();
