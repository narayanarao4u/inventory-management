## localhost Settings to VM BA 
``` javascript
  const app = express();
  const db = knex({
    client: 'mssql',
    connection: {
      host: '10.34.130.254',
      user: 'sa',
      password: 'bsnl@123',
      database: 'inventory'
    }
  });
  const SECRET_KEY = 'your_secret_key';
```