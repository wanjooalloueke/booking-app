/**
 * Routes d'Authentification
 */

import express from 'express';
import { register, login, verify, logout } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Inscrire un nouvel utilisateur
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Connexion d'un utilisateur
 */
router.post('/login', login);

/**
 * GET /api/auth/verify
 * Vérifier le token JWT (route protégée)
 */
router.get('/verify', authenticateToken, verify);

/**
 * POST /api/auth/logout
 * Déconnexion utilisateur
 */
router.post('/logout', logout);

export default router;
