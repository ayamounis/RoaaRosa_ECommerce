import { GIRLS_PRODUCTS, GIRLS_CATEGORIES, GIRLS_AGE_GROUPS } from '../src/data/girlsCatalog';
import * as fs from 'fs';
import * as path from 'path';

const outPath = path.resolve(__dirname, '../../backend/prisma/girls-catalog.json');
fs.writeFileSync(outPath, JSON.stringify({
  categories: GIRLS_CATEGORIES,
  products: GIRLS_PRODUCTS,
  ageGroups: GIRLS_AGE_GROUPS
}, null, 2));

console.log('Successfully exported catalog to:', outPath);
