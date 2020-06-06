import Knex from 'knex'

export async function up(knex: Knex) { // cria tabela sql
    return knex.schema.createTable('point_items', table => { // cria tabnela sql e determina os campos
        table.increments('id').primary() // número autoincrementável para cada nova entrada de registro, que representa a chave primária
        
        table.integer('point_id').notNullable().references('id').inTable('points') // faz relação com outra tabela, precisa da chave estrageira
        table.integer('item_id').notNullable().references('id').inTable('items')
    })
}


export async function down(knex: Knex) { // desfaz, semelhante à um ctrl+z  
    return knex.schema.dropTable('point_items')
}