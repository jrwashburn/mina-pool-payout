import Module from 'pg-promise';

const databaseUrl = process.env.DATABASE_URL;

const pgp = Module();

pgp.pg.types.setTypeParser(20, Number); // Type Id 20 = BIGINT | BIGSERIAL
pgp.pg.types.setTypeParser(1700, Number); // Type Id 1700 = NUMERIC

function getDb() {
  if (!databaseUrl) {
    throw Error('DATABASE_URL must be specified');
  }
  return pgp(databaseUrl);
}

export const db = new Proxy({} as ReturnType<typeof pgp>, {
  get(_target, prop) {
    const dbInstance = getDb();
    const value = dbInstance[prop as keyof typeof dbInstance];
    return typeof value === 'function' ? value.bind(dbInstance) : value;
  },
});

export const helpers = pgp.helpers;
