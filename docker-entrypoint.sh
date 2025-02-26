#!/bin/sh
npx typeorm-ts-node-commonjs migration:run -d src/databases/data-source.ts && npm run start:prod