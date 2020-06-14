import { Request, Response} from 'express';
import knex from '../database/connection';

class ItensController{
    async index(req: Request,res: Response){
        const itens = await knex('itens').select('*');
        
        const serializedItens = itens.map(item =>{
            return{
                id: item.id,
                title: item.title,
                image_url: `http://localhost:3333/uploads/${item.image}`,
            };
        });

        return res.json(serializedItens);
    }
}

export default ItensController;

/* 
const itens = await knex('itens').select('*');

const serializedItens = itens.map(item => {
    return {
        id: item.id,
        title: item.title,
        image_url: `http://localhost:3333/uploads/${item.image}`,
    }
    return res.json(serializedItens);
});
*/