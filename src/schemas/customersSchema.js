import joi from "joi";

const CustomersSchema = joi.object({
    name: joi.string().trim().required(),
    phone: joi.string().pattern(/^[0-9]+$/).min(10).max(11),
    cpf: joi.string().pattern(/^[0-9]+$/).length(11).required(),
    birthday: joi.date().required()
});

export default CustomersSchema;