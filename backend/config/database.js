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
 * Créer les tables de base si elles n'existent pas (sans suppression de données)
 */
export async function ensureCoreTables() {
    try {
        const connection = await pool.getConnection();

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nom VARCHAR(100) NOT NULL,
                prenom VARCHAR(100) NULL,
                email VARCHAR(100) NULL UNIQUE,
                telephone VARCHAR(30) NULL,
                mot_de_passe VARCHAR(255) NULL,
                provider VARCHAR(20) DEFAULT 'local',
                provider_id VARCHAR(255) NULL,
                role ENUM('client', 'admin') DEFAULT 'client',
                date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS hotels (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nom VARCHAR(150) NOT NULL,
                ville VARCHAR(100) NOT NULL,
                description TEXT,
                prix DECIMAL(10, 2) NOT NULL,
                disponibilite TINYINT(1) DEFAULT 1,
                image VARCHAR(255),
                note DECIMAL(3, 1) DEFAULT 0,
                nombre_avis INT DEFAULT 0,
                date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS restaurants (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nom VARCHAR(150) NOT NULL,
                ville VARCHAR(100) NOT NULL,
                description TEXT,
                prix DECIMAL(10, 2) NOT NULL,
                disponibilite TINYINT(1) DEFAULT 1,
                image VARCHAR(255),
                note DECIMAL(3, 1) DEFAULT 0,
                nombre_avis INT DEFAULT 0,
                date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS reservations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                type ENUM('hotel', 'restaurant') NOT NULL,
                item_id INT NOT NULL,
                date_debut DATE NOT NULL,
                date_fin DATE NOT NULL,
                nombre_personnes INT DEFAULT 1,
                statut ENUM('confirmée', 'en attente', 'annulée') DEFAULT 'confirmée',
                date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        connection.release();
        console.log('✅ Tables MySQL vérifiées/créées (users, hotels, restaurants, reservations)');
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation des tables:', error.message);
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
