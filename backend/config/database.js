/**
 * Configuration de la Base de Données
 * Connexion à MySQL pour Booking.CI
 */

import mysql from 'mysql2/promise.js';
import dotenv from 'dotenv';

dotenv.config();

const rawDbHost = process.env.DB_HOST || process.env.MYSQLHOST || '';
const rawDatabaseUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || '';

let dbHost = rawDbHost || 'localhost';
let dbUser = process.env.DB_USER || process.env.MYSQLUSER || 'root';
let dbPassword = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '';
let dbName = process.env.DB_NAME || process.env.MYSQLDATABASE || 'booking_app';
let dbPort = Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306);

const candidateUrl = rawDatabaseUrl || (rawDbHost.startsWith('mysql://') ? rawDbHost : '');
if (candidateUrl) {
    try {
        const parsed = new URL(candidateUrl);
        dbHost = parsed.hostname || dbHost;
        dbPort = Number(parsed.port || dbPort);
        dbUser = decodeURIComponent(parsed.username || dbUser);
        dbPassword = decodeURIComponent(parsed.password || dbPassword);
        const dbPath = (parsed.pathname || '').replace(/^\//, '');
        if (dbPath) {
            dbName = dbPath;
        }
    } catch (error) {
        console.warn('⚠️ URL MySQL invalide, utilisation des variables DB_* classiques');
    }
}

const sslEnabled = ['1', 'true', 'yes'].includes((process.env.DB_SSL || process.env.MYSQL_SSL || '').toLowerCase());

// Pool de connexions pour de meilleures performances
const pool = mysql.createPool({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    port: dbPort,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,
    ...(sslEnabled ? { ssl: { rejectUnauthorized: false } } : {})
});

/**
 * Tester la connexion à la base de données
 */
export async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connecté à la base de données MySQL');
        connection.release();
    } catch (error) {
        console.error('❌ Erreur de connexion à la base de données:', error.message);
    }
}

/**
 * Exécuter une requête SELECT
 */
export async function query(sql, params = []) {
    try {
        const connection = await pool.getConnection();
        const [results] = await connection.execute(sql, params);
        connection.release();
        return results;
    } catch (error) {
        console.error('Erreur SQL:', error.message);
        throw error;
    }
}

/**
 * Exécuter une requête INSERT/UPDATE/DELETE
 */
export async function execute(sql, params = []) {
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(sql, params);
        connection.release();
        return result;
    } catch (error) {
        console.error('Erreur SQL:', error.message);
        throw error;
    }
}

/**
 * Récupérer une seule ligne
 */
export async function queryOne(sql, params = []) {
    try {
        const results = await query(sql, params);
        return results[0] || null;
    } catch (error) {
        throw error;
    }
}

export { pool };
export default pool;
