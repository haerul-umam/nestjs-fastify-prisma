/*
This is a temporary workaround until the Prisma team provides an official fix for this type issue.
Please keep in mind that this patch modifies the generated client directly and may break with future Prisma updates.
*/

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/generated/prisma/client.ts');

let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  /export const (DbNull|JsonNull|AnyNull) = runtime\.objectEnumValues\.instances\.\1/g,
  'export const $1 = NullTypes.$1',
);

fs.writeFileSync(filePath, content);

console.log('✅ Prisma types have been successfully modified.');