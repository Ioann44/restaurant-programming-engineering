Connect to db in CLI:
```cmd
psql -h database -U user -d database
1234
```
Then list tables
```cmd
\c database
\dt
```
## Delpoy
For development simply
```cmd
docker -f compose.yml -f compose.prod.yml up -d
```
For production
```cmd
docker compose -f compose.yml -f compose.prod.yml up -d
```
If you need SSL and access without ports (and only without them in case not using `dev` compose file). Backend will be available on http://localhost/api and images on http://images
<br>
```cmd
docker -f compose.yml -f compose.prod.yml -f compose.nginx.yml up -d
```
<br>or
<br>
```cmd
docker -f compose.yml -f compose.dev.yml -f compose.nginx.yml up -d
```