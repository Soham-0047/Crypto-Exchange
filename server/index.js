const express = require('express')
const app = express();
const {Client} = require('pg')
const port = 8000
const dotenv = require('dotenv')
const { pool } = require('./routes/db')
const fetch = require('node-fetch')
const cors = require('cors')
dotenv.config();


//* For the cross origin policy conflict
app.use(cors({
    origin:'http://127.0.0.1:5500'
}))

app.use(express.json());

//Create a Connection here
// const connectDb = async () => {
//     try {

//         await pool.connect()
//         console.log("Connected")
//         await pool.end()
//     } catch (error) {
//         console.log(error)
//     }
// }

// connectDb()


//Command for creating the table in PostgreSQL database 

async function createCryptoDataTable() {
    const client = await pool.connect();
    try {
        
        console.log("Connected")
        await client.query('BEGIN');

        // Define the SQL command to create the table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS crypto_data (
                name VARCHAR(255) PRIMARY KEY,
                last DECIMAL(10,2),
                buy DECIMAL(10,2),
                sell DECIMAL(10,2),
                volume DECIMAL(10,2),
                base_unit VARCHAR(255)
            );
        `;

        await client.query(createTableQuery);
        await client.query('COMMIT');
        console.log("table created")
        
        
    } catch (error) {
        console.error('Error creating table:', error);
    } finally{
        client.release();
    }
}

// Call the function to create the 'crypto_data' table when the server starts
createCryptoDataTable();


async function fetchstoreData(){

    try {
        const res = await fetch('https://api.wazirx.com/api/v2/tickers')
        const data = await res.json()

        const client = await pool.connect();
        await client.query('BEGIN')
        // console.log("before update ",data)

        const pairs = Object.keys(data);
        const first10Pairs = pairs.slice(0, 10); 

        for (const pair of first10Pairs){
          

                const {name,last,buy,sell,volume,base_unit} = data[pair];

                
                const query = `
                    INSERT INTO crypto_data (name, last, buy, sell, volume, base_unit)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    ON CONFLICT (name) DO UPDATE 
                    SET last = EXCLUDED.last, 
                    buy = EXCLUDED.buy, 
                    sell = EXCLUDED.sell, 
                    volume = EXCLUDED.volume;
                `;

                await client.query(query, [name, last, buy, sell, volume, base_unit]); 

                // await client.query(query, formattedData); 

                
            
        }


        await client.query('COMMIT');
       client.release()

    } catch (error) {
       console.log(error) 
    }
}


//* Update route, to get the data that are fetch from API and populate from the database\

app.get('/update', async(req,res) =>{
    let client;
    try {
        // Call fetchAndStoreData() to update the database with fresh data

        client = await pool.connect();
        await client.query('BEGIN')

        await fetchstoreData();

        // Query the database to retrieve the updated data
        const query = 'SELECT * FROM crypto_data  LIMIT 10';
        const result = await pool.query(query);

        // Send the updated data as a JSON response
        res.status(200).json(result.rows);
        console.log("result ",result.rows)
        
        await client.query('COMMIT')
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred.' });
        await client.query('ROLLBACK');
    }finally {

        if(client){
            client.release();
        }
    }
})

//* Simple conformation message

app.get("/", (req,res) =>{
    res.json({message:"OK"})
})


//* Website will listen in this port
app.listen(port, () => {
    console.log(`Server running at http://localhost:8000`)
})