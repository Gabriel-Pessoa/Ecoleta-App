import express from 'express'
import multer from 'multer' // biblioteca de upload
import multerConfig from './config/multer' // configurações da biblioteca de upload
import { celebrate, Joi } from 'celebrate'

import PointsController from './controllers/PointsController' // importando classe PointsController
import ItemsController from './controllers/ItemsController'

const routes = express.Router() //desacoplar as rotas do arquivo principal
const upload = multer(multerConfig) // variável de upload

const pointsController = new PointsController() // instanciando classe PointsController
const itemsController = new ItemsController() // instanciando classe ItemsController


routes.get('/items', itemsController.index) // retorna itens

routes.post('/points',// rota
    upload.single('image'), // Recebe upload de uma única foto
    // validação
    celebrate({ 
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.string().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required(), // regex() poderia utilizar um regex para validar números separado por vírgula sem espaço

        })
    },{
        abortEarly: false
    }),
    pointsController.create) // cria novo ponto. 

routes.get('/points', pointsController.index) // lista todos os pontos de coleta.

routes.get('/points/:id', pointsController.show) // lista ponto de coleta com id específico


export default routes // exportando rotas para ter acesso em outro arquivo