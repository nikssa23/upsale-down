# Configs for Upsale Blocker

Add a JSON file per domain, e.g. `example.com.json`.

Each file should have a `patterns` array, with objects like:
- `pattern`: Regex string (can include alternations for multiple languages)
- `lang`: Array of language codes (for documentation)
- `parentLevels`: How many parent elements above the match to hide
