const pg = require('pg');

const db_user = process.env.DATABASE_USER || "postgres";
const db_pass = process.env.DATABASE_PASS || "teste";
const db_host = process.env.DATABASE_HOST || "localhost";
const db_name = process.env.DATABASE_NAME || "db_pauliceia";

const connectionString = new Client({
  host: db_host,
  port: 5334,
  user: db_user,
  database: db_name,
  password: db_pass
});

const client = new pg.Client(connectionString);
client.connect();
const query = client.query('select * from tb_street');
console.log('Done!')
query.on('end', () => { client.end(); });

