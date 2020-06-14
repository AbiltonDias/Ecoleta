import { Request, Response } from 'express';
import knex from "../database/connection";

class PointsController{
    async index(req: Request, res: Response){
        const { city, uf, itens} = req.query;

        const itensConvertidos = String(itens)
        .split(',')
        .map(item => Number(item.trim()));

        const points = await knex('points')
        .join('point_itens','points.id','=','point_itens.point_id')
        .whereIn('point_itens.itens_id', itensConvertidos)
        .where('city',String(city))
        .where('uf',String(uf))
        .distinct()
        .select('points.*');
     
        return res.json(points)
    }
   
    async create(request:Request, response:Response){
           
        const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        itens
        } = request.body;

        const trx = await knex.transaction();

        const point = {
            image:'https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }

        try {
            const insertedIds = await trx('points').insert(point);
            
            const point_id = insertedIds[0];

            const pointItens = itens.map((itens_id: number) => { 
            return  {
                itens_id,
                point_id
            }
        });

            await trx('point_itens').insert(pointItens);

            await trx.commit();

            return response.json({
            id: point_id,
            ...point
            })    
        } catch (error) {
            return response.send({
                error,
                message:"Agora vamos descobrir erro!"
            })
        }
        
    }
    
    async show(req:Request, res: Response){
        const { id } = req.params;
        
        const point = await knex('points').where('id', id).first();
        
        if(!point){
            return res.status(400).json({ message: "Point not found!"});
        }

        const itens = await knex('itens')
        .join('point_itens', 'itens.id','=','point_itens.itens_id')
        .where('point_itens.point_id', id)
        .select('itens.title')

        return res.json({ point, itens});
    }

}

export default PointsController;   