import multer from 'multer' // biblioteca de upload
import path from 'path'
import crypto from 'crypto'

//configurações da biblioteca multer
export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename(request, file, callback) {
            const hash = crypto.randomBytes(6).toString('hex') // criando string aleatória para renomear arquivos de upload. 

            const fileName = `${hash}-${file.originalname}` // nomeando arquivo de entrada do upload

            callback(null, fileName) // primeiro parâmetro é um erro, segundo é o nome do arquivo com todas as alterações anteriores

        }     
    })
}