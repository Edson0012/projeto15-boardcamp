import CustomersSchema from "../schemas/customersSchema.js";

export async function CustomersValidation (req, res, next){
    const client = req.body;
    const validation = CustomersSchema.validate(client);

    if(validation.error){
        return res.status(400).send(validation.error.details[0].message);
    }

    next();
};

export default CustomersValidation;

