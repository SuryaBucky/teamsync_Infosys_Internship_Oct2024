// index.js
const app = require('./app');
const {connectDB} = require("../backend/db/index.js")

// Port configuration
const PORT = process.env.PORT || 3001;

const startBackend = async () => {
    try {
        // Ensure the database is connected before starting the server
        await connectDB();

        // Start listening on the specified port
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start backend:', error);
        process.exit(1);
    }
};

// Start the backend
startBackend();
