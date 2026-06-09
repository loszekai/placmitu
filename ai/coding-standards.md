## Coding rules
Do not add code comments unless it must describe something unclear. Use English language for comments.


## Agent
Do not read files outside project root.


## API
When you need to reference an API endpoint, get current structure from URL: http://localhost:9020/doc.json


## CLI
When you need to call a CLI command, first change to the project directory, then use the Docker container. For example, to run `npm run dev`, use `cd /path/to/project && docker compose exec nodejs npm run dev`.


## npm
Do not run `npm run build`. During development I already use `npm run dev`, which rebuilds project on changes.


## UI
Use light theme.


## Language
Use Polish language for every text in the UI.


## Next.js
Do not create `middleware.ts` file. Use `proxy.ts` file instead.
