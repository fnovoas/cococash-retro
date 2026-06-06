# cr-auth-db

Base de datos SQLite para usuarios registrados y la asociación usuario → wallet.

## Qué guarda

| Campo | Descripción |
|-------|-------------|
| `email` | Identificador del usuario |
| `name` | Nombre visible |
| `password_hash` | Contraseña hasheada (bcrypt) |
| `wallet_id` | UUID que identifica la wallet del usuario |

No almacena saldo, movimientos ni datos de la wallet (siguen en el navegador, keyed por `wallet_id`).

## Archivo de datos

Por defecto: `data/auth.db` (montado en el contenedor `auth-ms` como `/data/auth.db`).

## Reset en local

```bash
make down
rm -f cr-auth-db/data/auth.db
make up
```

Para borrar también las wallets en el navegador, limpia `localStorage` (claves `mock_wallet_data_*` y `cococash_token`).
