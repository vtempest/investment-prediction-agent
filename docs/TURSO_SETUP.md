# Turso Database Setup Guide

This project uses [Turso](https://turso.tech/) - an edge-ready, distributed SQLite database built on libSQL. Turso provides SQLite's simplicity with the scalability and global distribution you need for production applications.

## Why Turso?

- **Edge-Ready**: Deploy your database close to your users globally
- **SQLite Compatible**: Use familiar SQLite syntax and tools
- **Embedded Replicas**: Lightning-fast reads with local replicas
- **Generous Free Tier**: 500 databases, 9GB storage, 1B row reads/month
- **Zero Config**: Works out of the box with Drizzle ORM

## Local Development

For local development, no setup is required! The application uses a local SQLite file:

```bash
# .env or .env.local
DATABASE_URL=file:./local.db
# DATABASE_AUTH_TOKEN not needed for local file
```

The database file will be created automatically when you first run the application.

## Production Setup with Turso

### 1. Install Turso CLI

```bash
# macOS/Linux
curl -sSfL https://get.tur.so/install.sh | bash

# Or via Homebrew
brew install tursodatabase/tap/turso

# Windows
# Download from https://github.com/tursodatabase/turso-cli/releases
```

### 2. Sign Up and Authenticate

```bash
# Sign up (opens browser)
turso auth signup

# Or login if you have an account
turso auth login
```

### 3. Create Your Database

```bash
# Create a new database
turso db create stock-prediction-db

# The command will output your database URL
# Example: libsql://stock-prediction-db-[username].turso.io
```

### 4. Create an Authentication Token

```bash
# Create a token for your database
turso db tokens create stock-prediction-db

# Copy the token - you'll need it for DATABASE_AUTH_TOKEN
```

### 5. Update Environment Variables

Update your `.env` or `.env.local` file:

```bash
# Turso Production Database
DATABASE_URL=libsql://stock-prediction-db-[username].turso.io
DATABASE_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

### 6. Push Database Schema

```bash
# Install Drizzle Kit (if not already installed)
npm install -D drizzle-kit

# Generate migration files
npx drizzle-kit generate:sqlite

# Push schema to Turso
npx drizzle-kit push:sqlite
```

## Database Migrations

### Generate Migration

When you modify the schema in `lib/db/schema.ts`:

```bash
# Generate migration
npx drizzle-kit generate:sqlite

# This creates SQL files in ./drizzle directory
```

### Apply Migration

```bash
# Push to database
npx drizzle-kit push:sqlite

# Or use migrate command
npx drizzle-kit migrate
```

### View Schema

```bash
# Inspect current schema
npx drizzle-kit introspect:sqlite
```

## Turso Dashboard

Access your databases through the [Turso Dashboard](https://turso.tech/):

- View database metrics
- Monitor queries
- Manage authentication tokens
- Create database replicas
- View usage and billing

## Database Schema

The application uses the following tables:

- `users` - User accounts and profiles
- `sessions` - Authentication sessions
- `accounts` - OAuth provider accounts
- `verifications` - Email and account verifications
- `strategies` - User trading strategies
- `signals` - Stock watchlist and signals
- `positions` - Open trading positions
- `trades` - Trade history
- `portfolios` - Portfolio summaries

## Advanced Features

### Multi-Region Replicas

Create replicas closer to your users:

```bash
# Create a replica in a different region
turso db replicate stock-prediction-db --location ams

# List all locations
turso db locations
```

### Database Backups

```bash
# Create a backup
turso db dump stock-prediction-db --output backup.sql

# Restore from backup
turso db shell stock-prediction-db < backup.sql
```

### Database Shell

```bash
# Open interactive SQL shell
turso db shell stock-prediction-db

# Run SQL directly
turso db shell stock-prediction-db "SELECT * FROM users LIMIT 5"
```

## Troubleshooting

### Database Not Found

```bash
# List all your databases
turso db list

# Make sure you're using the correct database name
```

### Authentication Failed

```bash
# Verify your token is valid
turso db tokens validate stock-prediction-db [your-token]

# Create a new token if needed
turso db tokens create stock-prediction-db
```

### Migration Errors

```bash
# Reset local migration state
rm -rf drizzle

# Regenerate migrations
npx drizzle-kit generate:sqlite

# Force push schema
npx drizzle-kit push:sqlite --force
```

## Local to Production Migration

To migrate from local SQLite to Turso:

1. **Export local data**:
```bash
sqlite3 local.db .dump > local-dump.sql
```

2. **Import to Turso**:
```bash
turso db shell stock-prediction-db < local-dump.sql
```

3. **Update environment variables** to point to Turso

4. **Verify data**:
```bash
turso db shell stock-prediction-db "SELECT COUNT(*) FROM users"
```

## Cost Optimization

Turso's free tier includes:
- 500 databases
- 9 GB total storage
- 1 billion row reads/month
- Unlimited row writes

For production at scale:
- **Starter**: $29/month - 50GB storage, 50B row reads
- **Scaler**: $99/month - 200GB storage, 200B row reads
- **Enterprise**: Custom pricing

Tips to stay within free tier:
- Use local development databases
- Implement caching for frequent queries
- Use embedded replicas for read-heavy workloads
- Archive old data periodically

## Resources

- [Turso Documentation](https://docs.turso.tech/)
- [Drizzle ORM with Turso](https://orm.drizzle.team/docs/get-started-sqlite#turso)
- [Turso CLI Reference](https://docs.turso.tech/reference/turso-cli)
- [LibSQL Documentation](https://docs.turso.tech/libsql)
- [Turso Pricing](https://turso.tech/pricing)

## Support

- Turso Discord: [https://discord.gg/turso](https://discord.gg/turso)
- Turso GitHub: [https://github.com/tursodatabase/turso-cli](https://github.com/tursodatabase/turso-cli)
- Documentation: [https://docs.turso.tech/](https://docs.turso.tech/)
