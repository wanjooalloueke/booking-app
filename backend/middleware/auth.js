/**
 * Middleware d'Authentification JWT
 * Vérifie et valide les tokens JWT
 */

import jwt from 'jsonwebtoken';

/**
 * Extraire le token depuis Authorization Bearer ou cookie token
 */
const extractToken = (req) => {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }

    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
        return null;
    }

    const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
    const tokenCookie = cookies.find((cookie) => cookie.startsWith('token='));
    return tokenCookie ? decodeURIComponent(tokenCookie.slice('token='.length)) : null;
};

/**
 * Middleware pour protéger les routes
 * Extrait et valide le token JWT du header Authorization
 */
export const authenticateToken = (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token not found. Please provide an authorization token.'
        });
    }

    // Vérifier le token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Token error:', err.message);
            
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expiré. Veuillez vous reconnecter.'
                });
            }
            
            return res.status(403).json({
                success: false,
                message: 'Token invalide. Accès refusé.'
            });
        }

        // Ajouter les informations de l'utilisateur à la requête
        req.user = user;
        next();
    });
};

/**
 * Protéger une page HTML et rediriger vers l'accueil si non authentifié
 */
export const requirePageAuth = (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        return res.redirect('/');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.redirect('/');
        }

        req.user = user;
        next();
    });
};

/**
 * Middleware optionnel d'authentification
 * Ne bloque pas si le token n'est pas présent
 */
export const optionalAuthToken = (req, res, next) => {
    const token = extractToken(req);

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (!err) {
                req.user = user;
            }
            next();
        });
    } else {
        next();
    }
};

/**
 * Middleware pour vérifier l'admin uniquement
 */
export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Accès réservé aux administrateurs.'
        });
    }
    next();
};

/**
 * Créer un JWT token
 */
export const generateToken = (userId, email, role = 'client') => {
    return jwt.sign(
        {
            id: userId,
            email: email,
            role: role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: `${process.env.JWT_EXPIRE || 24}h`
        }
    );
};

export default {
    authenticateToken,
    requirePageAuth,
    optionalAuthToken,
    isAdmin,
    generateToken
};
