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
docker compose up -d
```
For production
```cmd
docker compose -f compose.yml -f compose.prod.yml up -d
```