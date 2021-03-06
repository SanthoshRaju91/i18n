/**
* Main server file for starting the node server.
* Server listens on PORT 3000 (for development) & 9000 (for production)
*/
import express from 'express';
import { PORT, SECRET } from './config';
import logger from './utils/logger';
import * as middlewares from './config/middleware';
import { ConfigRoutes, LanguageRoutes, AuthRoutes } from './routes';

// creating an express application instance
const app = new express();

// applying middlewares for server instance
middlewares.appMiddleware(app);

app.use('/', [ConfigRoutes, AuthRoutes]);

app.use('/api', middlewares.authMiddleware(), [LanguageRoutes]);

// listening on server configured PORT
app.listen(PORT, err => {
  if (err) {
    logger.error(`Could not start the server: ${err}`);
  } else {
    logger.log(`Server running on PORT: ${PORT}`);
  }
});

// Global error handling mechanism
app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
    logger.error(`Global error: ${err}`);
    res.status(500).json({
      success: false,
      message: err || 'Something went wrong'
    });
  }
});

/*
* Making the application instance exportable only on test environment
* This is required for testing framework
*/
if (process.env.NODE_ENV === 'test') {
  module.exports = app;
}
