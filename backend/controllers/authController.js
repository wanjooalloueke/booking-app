/**
 * Contrôleur d'Authentification
 * Gestion de l'inscription, connexion et authentification
 */

import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

const setAuthCookie = (res, token) => {
    const isProduction = process.env.NODE_ENV === 'production';
    const expireHours = parseInt(process.env.JWT_EXPIRE || '24', 10) || 24;

    res.cookie('token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: expireHours * 60 * 60 * 1000,
        path: '/'
    });
};

/**
 * Enregistrer un nouvel utilisateur
 */
export const register = async (req, res) => {
    try {
        const { nom, prenom, email, password, telephone } = req.body;

        // Validation
        if (!nom || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Nom, email et mot de passe sont requis'
            });
        }

        // Valider l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email invalide'
            });
        }

        // Valider la longueur du mot de passe
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Le mot de passe doit contenir au moins 6 caractères'
            });
        }

        // Créer l'utilisateur
        const user = await User.create(nom, prenom || null, email, password, telephone || null);

        // Générer le token
        const token = generateToken(user.id, user.email, user.role);
        setAuthCookie(res, token);

        res.status(201).json({
            success: true,
            message: 'Utilisateur créé avec succès',
            token,
            user: {
                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Erreur de registration:', error);
        
        if (error.message.includes('déjà utilisé')) {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'inscription'
        });
    }
};

/**
 * Connecter un utilisateur
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email et mot de passe requis'
            });
        }

        // Récupérer l'utilisateur
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await User.verifyPassword(password, user.mot_de_passe);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Générer le token
        const token = generateToken(user.id, user.email, user.role);
        setAuthCookie(res, token);

        res.json({
            success: true,
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                nom: user.nom,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Erreur de connexion:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la connexion'
        });
    }
};

/**
 * Vérifier le token JWT
 */
export const verify = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Récupérer les infos actuelles de l'utilisateur
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                nom: user.nom,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Erreur de vérification:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la vérification'
        });
    }
};

/**
 * Déconnecter un utilisateur
 */
export const logout = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/'
    });

    res.json({
        success: true,
        message: 'Déconnexion réussie'
    });
};

export default {
    register,
    login,
    verify,
    logout
};
