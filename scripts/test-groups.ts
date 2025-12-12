import 'reflect-metadata';
import 'tsconfig-paths/register';
import { initializeDataSource } from '../src/db/AppDataSource';
import AppDataSource from '../src/db/AppDataSource';
import { Group } from '../src/db/entity/Group.entity';

async function testGroups() {
  if (!process.env.DB) {
    process.env.DB = './db/vki-web-orm.db';
  }
  
  await initializeDataSource();
  console.log('DB path:', AppDataSource.options.database);
  
  const repo = AppDataSource.getRepository(Group);
  const all = await repo.find();
  console.log('All groups via find():', all.length);
  
  const withQuery = await repo.createQueryBuilder('g').getMany();
  console.log('With query builder:', withQuery.length);
  
  try {
    const raw = await AppDataSource.query('SELECT * FROM "group"');
    console.log('Raw SQL:', raw.length);
    if (raw.length > 0) {
      console.log('First group:', raw[0]);
    }
  } catch (e) {
    console.log('Raw SQL error:', e);
  }
  
  if (all.length > 0) {
    console.log('\nGroups:');
    all.forEach(g => console.log(`  - ${g.name} (ID: ${g.id})`));
  }
}

testGroups().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });

