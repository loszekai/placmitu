## Coding rules
Do not add code comments unless it must describe something unclear.


## API
When you need to reference an API endpoint, get current structure from URL: http://localhost:9020/doc.json


## CLI
When you need to call a CLI command, first change to the project directory, then use the Docker container. For example, to run `npm run dev`, use `cd /path/to/project && docker compose exec nodejs npm run dev`.


## UI
Use light theme.
