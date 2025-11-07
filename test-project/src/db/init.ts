import { db } from './index';
import { sql } from 'drizzle-orm';

export function initDatabase() {
  try {
    // Create todos table
    db.run(sql`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER DEFAULT 0 NOT NULL,
        created_at INTEGER DEFAULT (unixepoch()) NOT NULL,
        updated_at INTEGER DEFAULT (unixepoch()) NOT NULL
      )
    `);

    // Create indexes
    db.run(sql`CREATE INDEX IF NOT EXISTS completed_idx ON todos (completed)`);
    db.run(sql`CREATE INDEX IF NOT EXISTS created_at_idx ON todos (created_at)`);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}
