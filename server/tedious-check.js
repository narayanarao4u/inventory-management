import { Connection } from 'tedious';
const connection = new Connection({
  server: '10.34.130.254',
  authentication: {
    type: 'default',
    options: {
      userName: 'sa',
      password: 'bsnl@123',
    },
  },
  options: {
    database: 'inventory',
    encrypt: true, // Use SSL/TLS encryption
    trustServerCertificate: true, // Bypass certificate validation
    port: 1433, // Default SQL Server port
  },
});

connection.on('connect', (err) => {
  if (err) {
    console.error('Connection failed:', err);
  } else {
    console.log('Connected successfully!');
  }
});

connection.connect();