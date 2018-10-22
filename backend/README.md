# Backend for domain-checker

## API

Endpoints:

- `GET /` - Hello world
- `GET /domain/:domain` - Query a domain w/o tld for all available tlds from the server

## Docker usage

```bash
# docker build -t domain-checker:backend .
# docker start -d -p 3000:3000 domain-checker:backend
```

## Env vars:

- `HOST: 0.0.0.0` ip to bind to
- `PORT: 3000` port to bind to
