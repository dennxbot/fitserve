const app = require('./app');
const { PORT, NODE_ENV } = require('./config/env');
const { 
  handleUncaughtException,
  handleUnhandledRejection,
  handleSigterm
} = require('./middlewares/errorHandler');

// Handle uncaught exceptions
handleUncaughtException();

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════════════════╗
║                              ✨ FitServe API ✨                           ║
║                     Food Measurement & Portion Tracker                   ║
╠══════════════════════════════════════════════════════════════════════════╣
║  🚀 Server       : http://localhost:${PORT.toString().padEnd(36)}║
║  🌍 Environment  : ${NODE_ENV.padEnd(47)}║
║  📊 Health Check : http://localhost:${PORT}/health${' '.repeat(23)}║
║  📖 Docs         : http://localhost:${PORT}/api/docs${' '.repeat(23)}║
║  🔗 API Base URL : http://localhost:${PORT}/api/v1${' '.repeat(23)}║
╠══════════════════════════════════════════════════════════════════════════╣
║  ✅ Available Endpoints:                                                 ║
║     • 🔐 Authentication : /api/v1/auth                                  ║
║     • 👤 Users          : /api/v1/users                                 ║
║     • 🍎 Foods          : /api/v1/foods                                 ║
╚══════════════════════════════════════════════════════════════════════════╝
  `);

  if (NODE_ENV === 'development') {
    console.log(`
🔧 Development Mode Active
   • Hot reload: Enabled
   • Detailed logs: Enabled
   • CORS: Allow all origins
   • Debug info: Available

📋 Quick Start:
   1. Register: POST /api/v1/auth/register
   2. Login: POST /api/v1/auth/login
   3. Create food: POST /api/v1/foods
   4. Log consumption: POST /api/v1/foods/log

⚡ Need help? Visit /api/docs for full documentation
    `);
  }
});

// Handle unhandled promise rejections
handleUnhandledRejection(server);

// Handle SIGTERM for graceful shutdown
handleSigterm(server);

// Export server for testing
module.exports = server;