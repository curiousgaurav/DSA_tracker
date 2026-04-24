# Supabase Migration Guide for DSA Tracker

## ✅ What's Been Updated
- ✓ `.env` file updated with Supabase credentials
- ✓ `supabase_schema.sql` created with all table definitions

## 📋 Migration Steps

### Step 1: Execute Schema on Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project: **ypaxkhlfweykuwyuowpj**
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the entire contents of `supabase_schema.sql`
6. Click **Run** (or Ctrl+Enter)
7. You should see: "Query successful" message

### Step 2: Export Data from Local Database

If you have existing data in your local database, export it using `pg_dump`:

```bash
# On Windows PowerShell or Command Prompt
pg_dump -h localhost -U postgres -d dsa_tracker -F c -b -v -f dsa_tracker_backup.dump
```

When prompted, enter password: **Gaurav@123**

This creates a `dsa_tracker_backup.dump` file in your project root.

### Step 3: Import Data to Supabase (Optional)

If you have exported data, restore it to Supabase:

```bash
# First, create a plain SQL dump (easier for import)
pg_dump -h localhost -U postgres -d dsa_tracker --no-owner --no-privileges -f dsa_tracker_backup.sql
```

Then:

1. Go to Supabase SQL Editor
2. Create a new query
3. Copy and paste the SQL from `dsa_tracker_backup.sql`
4. Run it

**OR** use `psql` to restore directly:

```bash
psql -h db.ypaxkhlfweykuwyuowpj.supabase.co -U postgres -d postgres < dsa_tracker_backup.sql
```

When prompted, enter password: **Gaurav9660322376**

### Step 4: Test the Connection

From your backend, restart the server:

```bash
# In backend folder
npm run dev
```

You should see: "Server running on port 5000"

Try logging in or creating an account through the frontend. If it works, your migration is complete!

### Step 5: Verify in Supabase

1. Go to Supabase Dashboard
2. Click **Table Editor**
3. You should see all your tables: `users`, `topics`, `problems`, `user_progress`
4. Click each table to verify data was migrated

## 🔗 Connection String (for reference)

```
postgresql://postgres:Gaurav9660322376@db.ypaxkhlfweykuwyuowpj.supabase.co:5432/postgres
```

## ⚠️ Important Notes

- **Never commit `.env` to Git** - It contains sensitive credentials
- **Backup your local database** before migration
- **Keep DB_NAME as "postgres"** - Supabase uses "postgres" as the default database
- Your backend code **does NOT need any changes** - The `pg` package works with any PostgreSQL database

## 🆘 Troubleshooting

### Connection Refused
- Ensure your Supabase project is running
- Check that IP whitelist allows your connection (Supabase allows all by default)
- Verify credentials are correct in `.env`

### Schema Creation Failed
- Check for syntax errors in the SQL
- Ensure you're running against the correct database
- Try running each CREATE TABLE statement separately

### Data Import Failed
- Check for foreign key conflicts
- Ensure schema exists before importing data
- Check table/column names match exactly

## 📚 Useful Supabase Links

- [Supabase Dashboard](https://app.supabase.com/)
- [Supabase PostgreSQL Docs](https://supabase.com/docs/guides/database)
- [Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
