import express from 'express';
import { getWidgetData, getLeaderboard } from '../controllers/widgetController.js';

const router = express.Router();

router.get('/widgets', getWidgetData);
router.get('/leaderboard', getLeaderboard);

export default router;
