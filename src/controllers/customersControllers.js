import { connection } from "../database/database.js"

export async function listCustomers(req, res){
    const { cpf } = req.query;

    try{
        let customers = [];

        if(!cpf){
            customers = await connection.query('SELECT * FROM customers;');
        } else {
            customers = await connection.query(`SELECT * FROM customers WHERE customers.cpf LIKE $1;`, [cpf + "%"])
        }

        return res.send(customers.rows);
    }catch(err){
        return res.status(500).send('error no servidor');
    }
}

export async function singleClient (req, res){
    const { id } = req.params;

    try{

        const client = await connection.query(`SELECT * FROM  customers WHERE customers.id=$1`, [id])

        if(!client){
            return res.sendStatus(404);
        }

        return res.send(client.rows);
    }catch(err){
        return res.status(500).send('error no servidor');
    }
}

export async function insertClient(req, res){
    const { name, phone, cpf , birthday } = req.body;

    try{

    }catch(err){
        return res.status(500).send('error no servidor');
    }
}