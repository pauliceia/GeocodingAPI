const pg = require('pg');

const db_user = process.env.DATABASE_USER || "postgres";
const db_pass = process.env.DATABASE_PASS || "postgres";
const db_host = process.env.DATABASE_HOST || "localhost";
const db_name = process.env.DATABASE_NAME || "pauliceia";

const connectionString = {
    host: db_host,
    port: 5432,
    user: db_user,
    database: db_name,
    password: db_pass,
    connectionTimeoutMillis: 5000 // timeout after 5 seconds
}

console.log('starting server')

const client = new pg.Client(connectionString);

client.connect((err) => {
    if(err) {
        console.error('Failed to connect to the database:', err);
        return;
    }
    console.log('Successfully connected to the database');
});

module.exports = client;