import { Router } from "express";
import { createRecord, getRecords, getRecordById, updateRecord, deleteRecord } from "../controllers/recordController.ts";
import { authenticate } from "../middleware/authMiddleware.ts";
import { authorize } from "../middleware/rbacMiddleware.ts";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create a new financial record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Record created
 */
router.post("/", authorize("admin", "analyst"), createRecord);

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Get all financial records with pagination and filters
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of records
 */
router.get("/", authorize("admin", "analyst", "viewer"), getRecords);

/**
 * @swagger
 * /api/records/{id}:
 *   get:
 *     summary: Get a specific record by ID
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record details
 */
router.get("/:id", authorize("admin", "analyst", "viewer"), getRecordById);

/**
 * @swagger
 * /api/records/{id}:
 *   put:
 *     summary: Update a specific record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated successfully
 */
router.put("/:id", authorize("admin", "analyst"), updateRecord);

/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     summary: Soft delete a specific record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record deleted successfully
 */
router.delete("/:id", authorize("admin"), deleteRecord);

export default router;
