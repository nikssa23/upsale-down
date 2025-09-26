// Main content script for Upsale Blocker
(async function() {
  // Helper to get domain
  function getDomain() {
    return window.location.hostname.replace(/^www\./, '');
  }

  // All configs bundled here (add new domains as needed)
  const UPSALE_CONFIGS = {
    "drive.google.com": {
      "patterns": [
        {
          "pattern": "Изпробване на Workspace",
          "lang": ["bg"],
          "parentLevels": 15
        }
      ]
    },
    "mail.google.com": {
      "patterns": [
        {
          "pattern": "Използвате Gmail за бизнеса си?",
          "lang": ["bg"],
          "parentLevels": 12
        },
        {
          "pattern":"Получаване на професионален имейл, например @your-company.com",
          "lang": ["bg"],
          "parentLevels": 3
        },
        {
          "pattern":"Реклама",
          "lang": ["bg"],
          "parentLevels": 2
        }
      ]
    },
    "photos.google.com": {
      "patterns": [
        {
          "pattern": "Получете 20% отстъпка за поръчки на фотоалбуми",
          "lang": ["bg"],
          "parentLevels": 2
        }
      ]
    },
    "calendar.google.com": {
      "patterns": [
        {
          "pattern": "Използвате Gmail за бизнеса",
          "lang": ["bg"],
          "parentLevels": 12
        }
      ]
    }
  };

  // Find and hide upsale messages
  function hideUpsaleMessages(config) {
    if (!config || !config.patterns) return;
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
          for (let i = 0; i < (parentLevels || 0) && el; i++) {
            el = el.parentElement;
          }
          // Only remove if not already removed by us
          if (el && el.getAttribute('data-upsale-blocked') !== 'true') {
            anyMatch = true;
            el.setAttribute('data-upsale-blocked', 'true');
            el.remove();
          }
        }
      }
    });
    if (anyMatch) {
      // alert('Upsale pattern matched and hidden.');
      console.log('Upsale pattern matched and hidden.');
    } else {
      console.log('No upsale patterns matched this time.');
    }
  }

  const domain = getDomain();
  const config = UPSALE_CONFIGS[domain];
  if (config) {
    // Run first check instantly
    hideUpsaleMessages(config);
    // Set up a MutationObserver to check on DOM changes
    const observer = new MutationObserver(() => {
      hideUpsaleMessages(config);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
})();
