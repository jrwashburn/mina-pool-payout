import Module from 'pg-promise';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw Error('DATABASE_URL must be specified');
}

const pgp = Module();

pgp.pg.types.setTypeParser(20, Number); // Type Id 20 = BIGINT | BIGSERIAL
pgp.pg.types.setTypeParser(1700, Number); // Type Id 1700 = NUMERIC

export const db = pgp(databaseUrl);

export const helpers = pgp.helpers;
