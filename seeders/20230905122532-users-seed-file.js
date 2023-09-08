'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Admins', [{
      name: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      created_at: new Date(),
      updated_at: new Date()
    }], {})
    await queryInterface.bulkInsert('Users', [{
      name: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      // image: `https://loremflickr.com/150/150/human/?random=${Math.random() * 100}`,
      image: 'https://i.imgur.com/lUVseMM.png',
      introduction: faker.lorem.text(),
      nation: faker.address.country(),
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
