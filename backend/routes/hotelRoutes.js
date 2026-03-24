/**
 * Routes des Hôtels
 */

import express from 'express';
import {
    getAllHotels,
    getHotelById,
    searchHotels,
    createHotel,
    updateHotel,
    deleteHotel
} from '../controllers/hotelController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/hotels
 * Récupérer tous les hôtels avec pagination
 */
router.get('/', getAllHotels);

/**
 * GET /api/hotels/search
 * Rechercher des hôtels par critères
 */
router.get('/search', searchHotels);

/**
 * GET /api/hotels/:id
 * Récupérer les détails d'un hôtel
 */
router.get('/:id', getHotelById);

/**
 * POST /api/hotels
 * Créer un nouvel hôtel (Admin)
 */
router.post('/', authenticateToken, isAdmin, createHotel);

/**
 * PUT /api/hotels/:id
 * Mettre à jour un hôtel (Admin)
 */
router.put('/:id', authenticateToken, isAdmin, updateHotel);

/**
 * DELETE /api/hotels/:id
 * Supprimer un hôtel (Admin)
 */
router.delete('/:id', authenticateToken, isAdmin, deleteHotel);

export default router;
