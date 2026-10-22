Images for the Synthetic Audiences gallery on `synthetic-audiences.html`.

A static site cannot list a folder, so the page reads `images.json` in this folder. Drop your image files here, then list them in `images.json` like this:

```json
[
  { "src": "persona-template.png", "alt": "The persona template", "caption": "The template each persona follows." },
  { "src": "agent-setup.png", "alt": "The agent setup screen", "caption": "Guidance prompts and files attached to the agent." }
]
```

`src` is the filename in this folder. `alt` and `caption` are optional. When the list is empty, the gallery stays hidden.
