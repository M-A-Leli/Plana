import dotenv from 'dotenv';

dotenv.config();

import testConnection from './database/DB.init';
import app from './App';

// Set the port
const port = process.env.PORT || 3000;

// Start server
const startServer = async () => {
    await testConnection();

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
};

startServer();
