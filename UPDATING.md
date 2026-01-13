# Updating the Pixbetbicho System

This guide explains how to apply updates to the Pixbetbicho system, specifically focusing on database schema changes.

## Prerequisites

- Node.js installed
- Database connection string configured in `.env` (DATABASE_URL)

## Applying Updates

To update the system (apply database schema changes), run the following command in the project root:

```bash
npm run db:update
```

This command will:
1. Connect to your database using the `DATABASE_URL`.
2. Compare your local schema (`shared/schema.ts`) with the actual database structure.
3. Apply any necessary changes (create tables, add columns, etc.) to make the database match your code.

## Making Changes to the Schema

If you need to add new features that require database changes:

1. Edit `shared/schema.ts` to define your new tables or columns.
2. Run `npm run db:update` to apply these changes to your local/dev database.
3. Commit your changes to `shared/schema.ts`.

## Troubleshooting

If you encounter errors:
- Check your database connection string in `.env`.
- Ensure your database server is running.
- If there are conflicts, `drizzle-kit` might ask for confirmation or manual intervention.
