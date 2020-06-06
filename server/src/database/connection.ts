import knex from 'knex'
import path from 'path' // auxilia nos diretórios de arquivos para os diferente tipos de sistemas

const connection = knex({ // objeto de configuração de db
    client: 'sqlite3',
    connection: {
        // nome do arquivo e caminho
        filename: path.resolve(__dirname, 'database.sqlite') // 
    },
    useNullAsDefault: true
})

export default connection

// Migrations = histórico do banco de dados