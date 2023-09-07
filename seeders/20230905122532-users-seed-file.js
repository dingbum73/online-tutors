'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      name: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      image: null,
      introduction: null,
      nation: null,
      is_admin: 1,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      // image: `https://loremflickr.com/150/150/human/?random=${Math.random() * 100}`,
      image: 'https://i.imgur.com/lUVseMM.png',
      introduction: faker.lorem.text(),
      nation: faker.address.country(),
      is_admin: 0,
      created_at: new Date(),
      updated_at: new Date()
    }], {})

    let users = Array.from({ length: 30 }).map(async () => {
      const hashedPassword = await bcrypt.hash('12345678', 10)
      return {
        name: faker.name.findName(),
        email: faker.internet.exampleEmail(),
        password: hashedPassword,
        // image: `https://loremflickr.com/150/150/human/?random=${Math.random() * 100}`,
        image: 'https://i.imgur.com/lUVseMM.png',
        introduction: faker.lorem.text(),
        nation: faker.address.country(),
        is_admin: 0,
        created_at: new Date(),
        updated_at: new Date()
      }
    })
    users = await Promise.all(users)
    await queryInterface.bulkInsert('Users', users)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Admins', {})
    await queryInterface.bulkDelete('Users', {})
  }
}
