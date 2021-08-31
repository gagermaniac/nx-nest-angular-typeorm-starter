module.exports = {
  "type": "mysql",
  "host": process.env.HOST_DB,
  "port": process.env.PORT_DB,
  "username": process.env.USER_DB,
  "password": process.env.PASS_DB,
  "database": process.env.NAME_DB,
  "synchronize": process.env.SYNC_DB,
  "logging": true,
  "seeds": ['./seeds/**/*.ts'],
  "entities": [
    "./apps/api/**/*.entity.ts"
  ],
  "migrations": [
    "./migrations/**/*.ts"
  ],
  "cli": {
    "migrationsDir": "./migrations"
  }
}
