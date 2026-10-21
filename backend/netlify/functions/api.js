import serverless from 'serverless-http';
import app from '../../server.js'; // tumhara express app

export const handler = serverless(app);