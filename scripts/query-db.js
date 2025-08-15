// Simple script to query your database
import { db } from '../lib/db/index.js';
import { periodEntries } from '../lib/db/schema.js';
import { count, avg } from 'drizzle-orm';

async function queryDatabase() {
  try {
    console.log('🔍 Fetching all period entries...');
    
    const entries = await db.select().from(periodEntries);
    
    console.log(`📊 Found ${entries.length} entries:`);
    console.table(entries);
    
    // Get statistics
    const stats = await db
      .select({
        count: count(),
        avgCycle: avg(periodEntries.cycleLength),
        avgDuration: avg(periodEntries.periodDuration)
      })
      .from(periodEntries);
    
    console.log('📈 Statistics:', stats[0]);
    
  } catch (error) {
    console.error('❌ Error querying database:', error);
  }
}

queryDatabase();
