/**
 * Routes des Restaurants
 */

import express from 'express';
import {
    getAllRestaurants,
    getRestaurantById,
    searchRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
} from '../controllers/restaurantController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/restaurants
 * Récupérer tous les restaurants avec pagination
 */
router.get('/', getAllRestaurants);

/**
 * GET /api/restaurants/search
 * Rechercher des restaurants par critères
 */
router.get('/search', searchRestaurants);

/**
 * GET /api/restaurants/:id
 * Récupérer les détails d'un restaurant
 */
router.get('/:id', getRestaurantById);

/**
 * POST /api/restaurants
 * Créer un nouveau restaurant (Admin)
 */
router.post('/', authenticateToken, isAdmin, createRestaurant);

/**
 * PUT /api/restaurants/:id
 * Mettre à jour un restaurant (Admin)
 */
router.put('/:id', authenticateToken, isAdmin, updateRestaurant);

/**
 * DELETE /api/restaurants/:id
 * Supprimer un restaurant (Admin)
 */
router.delete('/:id', authenticateToken, isAdmin, deleteRestaurant);

export default router;
