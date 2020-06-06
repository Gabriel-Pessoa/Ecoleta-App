import { Request, Response } from 'express'
import knex from '../database/connection'

class ItemsController {
    async index(request: Request, response: Response) { //
        const items = await knex('items').select('*')
    
        const serializedItems = items.map(item => { // transformo os dados para ser mais acessível
            return {
                id: item.id,
                title: item.title,
                image_url: `http://192.168.0.105:3333/uploads/${item.image}` //lembrar de mudar 192.168.0.105 para localhost
            }
        })
    
        return response.json(serializedItems) // retorno final da função
    }
}
export default ItemsController