# Upsale Blocker Chrome Extension

This extension hides upsale messages and divs on websites, based on configurable patterns per website and language.

## How it works
- For each website, add a config file in `configs/DOMAIN.json`.
- Each config lists patterns (regex, can be multi-language) and how many parent levels to hide.
- The extension scans the page for matching text and hides the specified parent element.

## Example config (`configs/example.com.json`):
```json
{
  "patterns": [
    {
      "pattern": "increase to plan maximum|повишете до максимален план|auf maximalen plan upgraden",
      "lang": ["en", "bg", "de"],
      "parentLevels": 5
    }
  ]
}
```

## Usage
1. Add or edit config files for each domain.
2. Load the extension in Chrome (Developer mode > Load unpacked).
3. Visit a site and upsale messages matching your patterns will be hidden.


## Aditional project names
- Dismisser
- Upsale Down
- DeAnnoier