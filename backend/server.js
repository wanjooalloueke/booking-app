/**
 * Booking.CI - Backend Server
 * API REST pour application de réservation d'hôtels et restaurants
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

// Importer les routes
import authRoutes from './routes/authRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import { requirePageAuth, generateToken } from './middleware/auth.js';
import User from './models/User.js';

// Charger les variables d'environnement
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_DIR = path.join(__dirname, '../frontend');

const app = express();
const PORT = process.env.PORT || 5000;

// ===================================
// MIDDLEWARE
// ===================================

// Sécurité (helmet avec CSP permissive pour les images externes)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https:", "http:", "http://localhost:*", "https://localhost:*"]
        }
    }
}));

// CORS
const envOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

const allowedOrigins = [
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:5507',
    'http://127.0.0.1:5507',
    process.env.FRONTEND_URL,
    process.env.BACKEND_URL,
    ...envOrigins
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Autoriser les outils serveur/CLI sans origin
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Origine non autorisee par CORS'));
    },
    credentials: true
}));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// ===================================
// ROUTES
// ===================================

// Routes d'authentification
app.use('/api/auth', authRoutes);

// ===================================
// ROUTES OAUTH (Google, Facebook, Apple)
// ===================================

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5507';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// --- GOOGLE OAUTH ---
app.get('/api/auth/google', (req, res) => {
    if (!process.env.GOOGLE_CLIENT_ID) {
        return res.redirect(`${FRONTEND_URL}/?oauth_error=Google+non+config%C3%A9`);
    }
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: `${BACKEND_URL}/api/auth/google/callback`,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'select_account'
    });
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

app.get('/api/auth/google/callback', async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) throw new Error('Code manquant');

        // Échanger le code contre un token
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: `${BACKEND_URL}/api/auth/google/callback`,
                grant_type: 'authorization_code'
            })
        });
        const tokenData = await tokenRes.json();
        if (!tokenData.access_token) throw new Error('Token Google invalide');

        // Récupérer le profil utilisateur
        const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        const profile = await profileRes.json();

        // Trouver ou créer l'utilisateur
        const user = await User.findOrCreateOAuth({
            id: profile.sub,
            displayName: `${profile.given_name || ''} ${profile.family_name || ''}`.trim(),
            emails: [{ value: profile.email }]
        }, 'google');

        const token = generateToken(user.id, user.email, user.role);
        const expireHours = parseInt(process.env.JWT_EXPIRE || '24', 10);
        res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: expireHours * 3600000 });

        const userEncoded = encodeURIComponent(JSON.stringify({ id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role }));
        res.redirect(`${FRONTEND_URL}/?oauth_token=${token}&oauth_user=${userEncoded}`);
    } catch (err) {
        console.error('Google OAuth error:', err);
        res.redirect(`${FRONTEND_URL}/?oauth_error=${encodeURIComponent(err.message)}`);
    }
});

// --- FACEBOOK OAUTH ---
app.get('/api/auth/facebook', (req, res) => {
    if (!process.env.FACEBOOK_APP_ID) {
        return res.redirect(`${FRONTEND_URL}/?oauth_error=Facebook+non+config%C3%A9`);
    }
    const params = new URLSearchParams({
        client_id: process.env.FACEBOOK_APP_ID,
        redirect_uri: `${BACKEND_URL}/api/auth/facebook/callback`,
        scope: 'email,public_profile',
        response_type: 'code'
    });
    res.redirect(`https://www.facebook.com/v19.0/dialog/oauth?${params}`);
});

app.get('/api/auth/facebook/callback', async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) throw new Error('Code manquant');

        // Échanger le code contre un token
        const tokenRes = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?${new URLSearchParams({
            client_id: process.env.FACEBOOK_APP_ID,
            client_secret: process.env.FACEBOOK_APP_SECRET,
            redirect_uri: `${BACKEND_URL}/api/auth/facebook/callback`,
            code
        })}`);
        const tokenData = await tokenRes.json();
        if (!tokenData.access_token) throw new Error('Token Facebook invalide');

        // Récupérer le profil
        const profileRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email,first_name,last_name&access_token=${tokenData.access_token}`);
        const profile = await profileRes.json();

        const user = await User.findOrCreateOAuth({
            id: profile.id,
            displayName: profile.name,
            emails: profile.email ? [{ value: profile.email }] : []
        }, 'facebook');

        const token = generateToken(user.id, user.email, user.role);
        const expireHours = parseInt(process.env.JWT_EXPIRE || '24', 10);
        res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: expireHours * 3600000 });

        const userEncoded = encodeURIComponent(JSON.stringify({ id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role }));
        res.redirect(`${FRONTEND_URL}/?oauth_token=${token}&oauth_user=${userEncoded}`);
    } catch (err) {
        console.error('Facebook OAuth error:', err);
        res.redirect(`${FRONTEND_URL}/?oauth_error=${encodeURIComponent(err.message)}`);
    }
});

// --- APPLE SIGN IN ---
app.get('/api/auth/apple', (req, res) => {
    if (!process.env.APPLE_CLIENT_ID || !process.env.APPLE_TEAM_ID || !process.env.APPLE_KEY_ID) {
        return res.redirect(`${FRONTEND_URL}/?oauth_error=Apple+Sign+In+non+configur%C3%A9`);
    }
    const params = new URLSearchParams({
        client_id: process.env.APPLE_CLIENT_ID,
        redirect_uri: `${BACKEND_URL}/api/auth/apple/callback`,
        response_type: 'code id_token',
        scope: 'name email',
        response_mode: 'form_post'
    });
    res.redirect(`https://appleid.apple.com/auth/authorize?${params}`);
});

app.post('/api/auth/apple/callback', async (req, res) => {
    try {
        const { code, id_token, user: appleUser } = req.body;
        if (!id_token) throw new Error('Token Apple manquant');

        // Décoder le JWT Apple (sans vérification de signature pour simplifier)
        const payload = JSON.parse(Buffer.from(id_token.split('.')[1], 'base64').toString());
        const email = payload.email;
        const appleId = payload.sub;

        let displayName = '';
        if (appleUser) {
            try {
                const parsedUser = typeof appleUser === 'string' ? JSON.parse(appleUser) : appleUser;
                if (parsedUser.name) {
                    displayName = `${parsedUser.name.firstName || ''} ${parsedUser.name.lastName || ''}`.trim();
                }
            } catch (_) {}
        }

        const user = await User.findOrCreateOAuth({
            id: appleId,
            displayName: displayName || email || 'Utilisateur Apple',
            emails: email ? [{ value: email }] : []
        }, 'apple');

        const token = generateToken(user.id, user.email, user.role);
        const expireHours = parseInt(process.env.JWT_EXPIRE || '24', 10);
        res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: expireHours * 3600000 });

        const userEncoded = encodeURIComponent(JSON.stringify({ id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role }));
        res.redirect(`${FRONTEND_URL}/?oauth_token=${token}&oauth_user=${userEncoded}`);
    } catch (err) {
        console.error('Apple OAuth error:', err);
        res.redirect(`${FRONTEND_URL}/?oauth_error=${encodeURIComponent(err.message)}`);
    }
});

// Routes des hôtels
app.use('/api/hotels', hotelRoutes);

// Routes des restaurants
app.use('/api/restaurants', restaurantRoutes);

// Routes des réservations
app.use('/api/reservations', reservationRoutes);

// Navigation frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

// Page de réservation protégée côté serveur
app.get('/page1.html', requirePageAuth, (req, res) => {
    res.sendFile(path.join(FRONTEND_DIR, 'page1.html'));
});

// Fichiers statiques frontend (CSS, JS, images)
app.use(express.static(FRONTEND_DIR, { index: false }));

// Route de base
app.get('/api', (req, res) => {
    res.json({
        message: 'Bienvenue sur l\'API Booking.CI',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            hotels: '/api/hotels',
            restaurants: '/api/restaurants',
            reservations: '/api/reservations'
        }
    });
});

// ===================================
// GESTION DES ERREURS
// ===================================

// 404 - Route non trouvée
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée',
        path: req.path
    });
});

// Erreur globale
app.use((err, req, res, next) => {
    console.error('Erreur:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erreur serveur interne',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// ===================================
// DÉMARRAGE DU SERVEUR
// ===================================

app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════╗
    ║   Booking.CI API Server             ║
    ║   Port: ${PORT}                       ║
    ║   Environnement: ${process.env.NODE_ENV || 'development'}      ║
    ╚════════════════════════════════════╝
    `);
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📚 Documentation API disponible sur http://localhost:${PORT}/api`);
});

export default app;
