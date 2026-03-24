/**
 * Configuration de la Base de Données
 * Connexion à MySQL pour Booking.CI
 */

import mysql from 'mysql2/promise.js';
import dotenv from 'dotenv';

dotenv.config();

// Pool de connexions pour de meilleures performances
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'booking_app',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
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
