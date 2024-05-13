import dotenv from 'dotenv';
import express from 'express';
dotenv.config();
import { searchMe } from '../controllers/search.controller.js';

const router = express.Router();
// Define your routes here
router.get('/:userInput',searchMe);

// Export the router
export default router;