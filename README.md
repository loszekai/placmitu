## Docker

After `docker compose up -d`, run:

```text
docker compose exec -u root nodejs chown -R app:app /var/www/app/node_modules
```

in order to fix permission for `node_modules/`.
