module.exports = {
  "type": "mysql",
  "host": process.env.HOST_DB,
  "port": process.env.PORT_DB,
  "username": process.env.USER_DB,
  "password": process.env.PASS_DB,
  "database": process.env.NAME_DB,
  "synchronize": process.env.SYNC_DB,
  "logging": true,
  "cache": true,
  "seeds": ['seeds/**/*{.js,.ts}'],
  "migrationsRun": true,
  "migrationsTableName": "migrations_typeorm",
  "entities": [
    "./dist/apps/api/**/*.entity.js"
  ],
  "migrations": [
    "migrations/*.js"
  ],
  "cli": {
    "migrationsDir": "migrations",
  }
}
