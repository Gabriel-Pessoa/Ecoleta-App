import path from 'path'

// knex não suporta export default
module.exports = {
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite') // cria arquivo em diretório src/database/database.sqlite
    },
    migrations: { // refere-se as pastas onde foram criadas as migrations
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },
    useNullAsDefault: true
}