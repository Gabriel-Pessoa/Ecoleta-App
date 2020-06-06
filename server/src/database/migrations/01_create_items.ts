import Knex from 'knex'

export async function up(knex: Knex) { // cria tabela sql
    return knex.schema.createTable('items', table => { // cria tabela sql e determina os campos
        table.increments('id').primary() // número autoincrementável para cada nova entrada de registro, que representa a chave primária
        table.string('image').notNullable() // salva a referência da image, esse campo não pode ser nulo, sempre deve haver uma imagem
        table.string('title').notNullable()
    })
}


export async function down(knex: Knex) { // desfaz, semelhante à um ctrl+z  
    return knex.schema.dropTable('items')
}