const fs = require('fs');
const { Client } = require('pg');

const connectionString = "postgresql://postgres.rhdstfwxovfvuaggjduo:0303%40456FDZ%40@aws-1-us-west-2.pooler.supabase.com:5432/postgres";

async function main() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to Supabase DB');
        
        const schema = fs.readFileSync('schema.sql', 'utf8');
        await client.query(schema);
        
        console.log('Schema created successfully');
    } catch (err) {
        console.error('Error executing schema:', err);
    } finally {
        await client.end();
    }
}

main();
