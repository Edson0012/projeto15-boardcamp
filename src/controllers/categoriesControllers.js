import { connection } from "../database/database.js";

export async function listCategories (req, res){
    try {
        const queryCategories = await connection.query('SELECT * FROM categories;');

        return res.send(queryCategories.rows);
    } catch(err){
        return res.status(500)
    }
}

export async function insertCategories(req, res){
    try {
        const { name } = req.body;

        if(name === ''){
            return res.sendStatus(400);
        }

        const verifyCategory = await connection.query(`SELECT * FROM categories WHERE name LIKE $1;`, [name]);
        if (verifyCategory.rows.length > 0){
            return res.sendStatus(409);
        }

        const insertCategories = await connection.query(`INSERT INTO categories (name) VALUES ($1);`, [name])

        return res.sendStatus(209);
    }catch(err){
        res.status(500);
    }
}