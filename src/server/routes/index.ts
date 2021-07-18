import express from 'express'
import { scrapeData, subscribeToAlerts, unsubscribeFromAlerts, updateStats } from '../controllers'

const router = express.Router()

router.post('/update', updateStats)
router.post('/subscribe', subscribeToAlerts)
router.post('/unsubscribe', unsubscribeFromAlerts)
router.post('/scrape', scrapeData)

export default router
