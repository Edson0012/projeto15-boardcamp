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

export async function insertGame(){};