import { Router } from "express";
import { getSummary, getCategoryTotals, getTrends, getRecentActivity } from "../controllers/dashboardController.ts";
import { authenticate } from "../middleware/authMiddleware.ts";
import { authorize } from "../middleware/rbacMiddleware.ts";

const router = Router();

router.use(authenticate, authorize("admin", "analyst", "viewer"));

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get overall financial summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary retrieved
 */
router.get("/summary", getSummary);

/**
 * @swagger
 * /api/dashboard/category-totals:
 *   get:
 *     summary: Get totals clustered by category
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category totals retrieved
 */
router.get("/category-totals", getCategoryTotals);

/**
 * @swagger
 * /api/dashboard/trends:
 *   get:
 *     summary: Get financial trends over time
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trends retrieved
 */
router.get("/trends", getTrends);

/**
 * @swagger
 * /api/dashboard/recent:
 *   get:
 *     summary: Get recent account activity
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent activity retrieved
 */
router.get("/recent", getRecentActivity);

export default router;
