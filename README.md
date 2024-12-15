# Nest.js TypeORM Boilerplate

## Migrations

- To create an empty migration:  
  `npm run migration:create --name=<migration-name>`

- To generate a migration:  
  `npm run migration:generate --name=<migration-name>`

- To revert the last migration:  
  `npm run migration:revert`

- To run a migration:  
  `npm run migration:run`

  > **NOTE:** Migrations run automatically in both staging and production environments.
  