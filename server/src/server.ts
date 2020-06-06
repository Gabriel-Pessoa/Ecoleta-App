import express from 'express' // é preciso instalar a definição de tipos do express, para que o 
import cors from 'cors'
import routes from './routes'
import path from 'path'
import { errors } from 'celebrate'

const app = express()

app.use(cors())

app.use(express.json()) // para interpretar dados json na requisição

app.use(routes) // serve o arquivo específico

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads'))) // servindo arquivos estáticos (imagens). Usando path para evitar problemas de diretórios nos mais variados sistemas

app.use(errors()) // retorno dos erros de validação

app.listen(3333)