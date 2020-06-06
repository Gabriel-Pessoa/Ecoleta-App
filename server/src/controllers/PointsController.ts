import {Request, Response} from 'express' // importamos  para reconhecimento do typeScript
import knex from '../database/connection' // importa arquivo de conexão

class PointsController {
    async index(request: Request, response: Response) {
        const { city, uf, items} = request.query   

        const parsedItems = String(items).split(',') // transforma o itens  numa  array separado por vírgula
            .map(item => Number(item.trim())) // remove todos os espaços da direita e da esquerda

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id') 
            .whereIn('point_items.item_id', parsedItems) // busque todos os  pontos que coletam itens específicos baseado no parsedItems
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct() // retorna pontos de coletas distintos. Para não haver duplicidade dos pontos de coleta
            .select('points.*') // retorna todos os dados da tabela points


            const serializedPoints = points.map(point => { // transformo os dados para ser mais acessível
                return {
                   ...point, // clona todos os dados do ponto
                    image_url: `http://192.168.0.105:3333/uploads/${point.image}` //lembrar de mudar 192.168.0.105 para localhost
                }
            })
       
        return response.json(serializedPoints)
    }

    async show(request: Request, response: Response) {
        const id = request.params.id //recebe parâmetro id

        const point = await knex('points').where('id', id).first() // retorna o primeiro resultado encontrado do id

        // point false; caso erro
        if(!point) { 
            return response.status(400).json({ message: 'Point not found.' })
        }

        const serializedPoint = { // transformo os dados para ser mais acessível
            ...point, // clona todos os dados do ponto
            image_url: `http://192.168.0.105:3333/uploads/${point.image}` //lembrar de mudar 192.168.0.105 para localhost 
        }
   

        // retorna todos os itens relacionados com o id do point
        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id).select('items.title')

        return response.json({ point: serializedPoint, items }) // provável lugar onde colocar avaliação
    }
    
    async create(request: Request, response: Response) {
        const { // desestruturação para pegar cada propriedade de request.body
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items,
            //rating
        } = request.body

        const trx = await knex.transaction() // varíavel que liga os dois insert, caso um não nçao funcione bloqueia o outro

        // criar novo ponto de coleta 
        const point = { 
            image: request.file.filename, // pega nome do arquivo e salva
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            //rating
        }

        const insertedIds = await trx('points').insert(point) // retorna um array de ids

        const point_id = insertedIds[0] // retorna o primeiro id

        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id
                }
            })

        await trx('point_items').insert(pointItems)

        await trx.commit() // ao final dos transaction é obrigátorio invocar o commit

        return response.json({
            id: point_id, // retorna id  e todo as propriedades do objeto point
            ...point
        })
    }
}


export default PointsController