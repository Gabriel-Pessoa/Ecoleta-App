import Knex from 'knex'

export async function up(knex: Knex) { // cria tabela sql
    return knex.schema.createTable('points', table => { // cria tabnela sql e determina os campos
        table.increments('id').primary() // número autoincrementável para cada nova entrada de registro, que representa a chave primária
        table.string('image').notNullable() // salva a referência da image, esse campo não pode ser nulo, sempre deve haver uma imagem
        table.string('name').notNullable()
        table.string('email').notNullable()
        table.string('whatsapp').notNullable()
        table.decimal('latitude').notNullable()
        table.decimal('longitude').notNullable()
        table.string('city').notNullable()
        table.string('uf', 2).notNullable()
        table.decimal('rating', 1) // acrescentei um campo de avaliação, que vai ter apenas um número de 0 a 5
    })
}


export async function down(knex: Knex) { // desfaz, semelhante à um ctrl+z  
    return knex.schema.dropTable('point')
}