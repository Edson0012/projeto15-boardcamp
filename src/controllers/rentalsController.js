import { connection } from "../database/database.js"
import dayjs from "dayjs";

export async function listRentals(req, res){
    const { customerId, gameId } = req.query;

    try{

        let rentals = [];
        if(!customerId && gameId){
            rentals = await connection.query(`SELECT rentals.*, json_bhuild_object(
                'id', customers.id, 'name', customers.name 
            ) as customer, json_build_object(
                'id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', (
                SELECT categories.name FROM categories WHERE games."categoryId"=categories.id
                )
            ) as game FROM rentals JOIN customers ON rentals."customerId"=customers.id JOIN games ON rentals."gameId"=games.id;`)
        } else {
            rentals = await connection.query(`
                SELECT * FROM rentals WHERE rentals."customerId"=$1 OR rentals."gameId"=$2;
            `, [customerId, gameId]);
        }

        if(!rentals.rows[0]){
            return res.sendStatus(404);
        }

        return res.send(rentals.rows);
    }catch(err){
        return res.status(500).send('erro do servidor');
    }
}

export async function insertRentals(req, res){
    const { customerId, gameId, daysRented } = req.body;

    try{
        if ( daysRented <= 0){
            return res.sendStatus(400);
        }

        const clientExist = await connection.query(`SELECT * FROM customers WHERE id=$1;`, [customerId]);
        console.log(clientExist)
        
        const gameExist = await connection.query(`SELECT * FROM games WHERE id=$1;`, [gameId]);
        
        if(!clientExist.rows[0] || !gameExist.rows[0]){
            return res.sendStatus(400);
        }

        const rented = await connection.query(`SELECT * FROM rentals WHERE rentals."gameId"=$1 AND rentals."returnDate" IS NULL;`, [gameId]);

        const isAvailable = gameExist.rows[0].stockTotal - rented.rows.length;
        if(isAvailable <= 0){
            return res.sendStatus(400);
        }

        await connection.query(`INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate", "delayFee")
                VALUES ($1, $2, $3, $4, $5, $6, $7);
        ` , [customerId, gameId, daysRented, dayjs().format("YYYY-MM-DD"), daysRented * gameExist.rows[0].pricePerDay,null,null]);

        return res.sendStatus(201);
    }catch(err){
        return res.status(500).send("error no servidor");
    }
}

export async function deleteRentals(req, res) {
    const { id } = req.params;
  
    try {
      const rentalExists = await connection.query(`SELECT * FROM rentals WHERE id=$1;`,[id]);

      if (!rentalExists.rows[0]) {
        return res.sendStatus(404);
      }
      if (!rentalExists.rows[0].returnDate) {
        return res.sendStatus(400);
      }
  
      await connection.query(`DELETE FROM rentals WHERE id=$1;`,[id]);
      return res.sendStatus(200);
    } catch (err) {
      return res.Status(500).send('error no servidor');
    }
  };

export async function returnRentals(req, res){
    const { id } = req.params;
    const UTCday = 1440 * 60 * 1000;

    try{
        const rentalExist = await connection.query(`SELECT * FROM rentals WHERE id=$1;`, [id])

        if(!rentalExist.rows[0]){
            return res.sendStatus(404);
        }

        if(rentalExist.rows[0].returnDate){
            return res.sendStatus(400);
        }

        const dateRented = Date.parse(rentalExist.rows[0].rentDate.toISOString().substring(0, 10));
        const dateLimit = dateRented + rentalExist.rows[0].daysRented * UTCday;
        const daysDelayed = Math.ceil((dateLimit - Date.now()) / UTCday);

        if(daysDelayed < 0) {
            await connection.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3;`, [ dayjs().format("YYYY-MM-DD"),
            rentalExist.rows[0].originalPrice * Math.abs(daysDelayed),
            id]);
        } {
            await connection.query(`UPDATE rentals SET "returnDate"=$2 WHERE id=$3;`, [dayjs().format("YYYY-MM-DD"), 0, id]);
        }

        return res.sendStatus(200);
    }catch(err){
        return res.status(500).send('error no servidor')
    }
} 