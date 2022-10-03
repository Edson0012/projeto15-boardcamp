import { connection } from "../database/database.js";

export async function listGames(req, res){
    const {name} = req.query;
    let games;
    try {

        if(!name){
            games = await connection.query(`
                      SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId"=categories.id;
                  `);
          } else {
            games = await connection.query(`
                      SELECT games.*, categories.name as "categoryName" FROM games JOIN categories 
                      ON games."categoryId"=categories.id WHERE LOWER(games.name) LIKE LOWER($1);
                  `,
              [name + "%"]
            );
          } 

       return   res.send(games.rows);
    }catch(err){
       return res.status(500).send('error no servidor');
    }
}

export async function insertGame(req, res){
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {
        
        if (!name) {
          return res.sendStatus(400);
        }
        if (stockTotal <= 0 || pricePerDay <= 0) {
          return res.sendStatus(400);
        }

        const categoryExists = await connection.query(`SELECT * FROM categories WHERE id=$1;`, [categoryId]);

        if (!categoryExists.rows[0]) {
            return res.sendStatus(400);
        }
    
        const gameExists = await connection.query(`SELECT * FROM games WHERE name=$1;`,[name]);

        if (gameExists.rows[0]) {
            return res.sendStatus(409);
        }
    
        await connection.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);`,
            [name, image, stockTotal, categoryId, pricePerDay]
        );
        return res.sendStatus(201);
    }catch(err){
      return res.status(500).send('error no servidor');
    }
};