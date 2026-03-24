/**
 * Routes des Réservations
 */

import express from 'express';
import {
    createReservation,
    getUserReservations,
    getReservationById,
    getAllReservations,
    updateReservation,
    cancelReservation,
    deleteReservation
} from '../controllers/reservationController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/reservations
 * Récupérer toutes les réservations (Admin)
 */
router.get('/', authenticateToken, isAdmin, getAllReservations);

/**
 * POST /api/reservations
 * Créer une nouvelle réservation
 */
router.post('/', authenticateToken, createReservation);

/**
 * GET /api/reservations/me
 * Récupérer les réservations de l'utilisateur connecté
 */
router.get('/me', authenticateToken, (req, res, next) => {
    req.params.userId = req.user.id;
    getUserReservations(req, res, next);
});

/**
 * GET /api/reservations/user/:userId
 * Récupérer les réservations d'un utilisateur
 */
router.get('/user/:userId', authenticateToken, getUserReservations);

/**
 * GET /api/reservations/:id
 * Récupérer une réservation
 */
router.get('/:id', authenticateToken, getReservationById);

/**
 * PUT /api/reservations/:id
 * Mettre à jour une réservation
 */
router.put('/:id', authenticateToken, updateReservation);

/**
 * DELETE /api/reservations/:id
 * Annuler une réservation
 */
router.delete('/:id', authenticateToken, cancelReservation);

export default router;
