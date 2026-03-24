/**
 * Script de test de connexion MySQL
 * Exécutez avec: node test-db.js
 */

import mysql from 'mysql2/promise.js';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
    console.log('\n🔍 Test de connexion à MySQL...\n');

    const config = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'booking_app',
        port: process.env.DB_PORT || 3306
    };

    console.log('📋 Configuration :');
    console.log(`   Host: ${config.host}`);
    console.log(`   Port: ${config.port}`);
    console.log(`   User: ${config.user}`);
    console.log(`   Database: ${config.database}`);
    console.log('');

    try {
        // Test de connexion
        const connection = await mysql.createConnection(config);
        console.log('✅ Connexion réussie!\n');

        // Compter les données
        console.log('📊 Données dans la base de données :\n');

        const [hotels] = await connection.execute('SELECT COUNT(*) as count FROM hotels');
        console.log(`   🏨 Hôtels : ${hotels[0].count}`);

        const [restaurants] = await connection.execute('SELECT COUNT(*) as count FROM restaurants');
        console.log(`   🍽️  Restaurants : ${restaurants[0].count}`);

        const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
        console.log(`   👥 Utilisateurs : ${users[0].count}`);

        const [reservations] = await connection.execute('SELECT COUNT(*) as count FROM reservations');
        console.log(`   📅 Réservations : ${reservations[0].count}`);

        console.log('\n');

        // Récupérer quelques hôtels
        const [hotelsList] = await connection.execute('SELECT nom, ville FROM hotels LIMIT 3');
        console.log('🏨 Premiers hôtels :');
        hotelsList.forEach(h => {
            console.log(`   - ${h.nom} (${h.ville})`);
        });

        console.log('\n');

        // Récupérer quelques restaurants
        const [restaurantsList] = await connection.execute('SELECT nom, ville FROM restaurants LIMIT 3');
        console.log('🍽️  Premiers restaurants :');
        restaurantsList.forEach(r => {
            console.log(`   - ${r.nom} (${r.ville})`);
        });

        console.log('\n✅ Tous les tests sont passés!\n');
        await connection.end();

    } catch (error) {
        console.error('❌ Erreur de connexion :\n');
        console.error(`   ${error.message}\n`);

        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('⚠️  MySQL n\'est pas démarré.');
            console.log('   Solution: Démarrez MySQL dans XAMPP Control Panel\n');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('⚠️  Mot de passe incorrect.');
            console.log('   Vérifiez la configuration dans le fichier .env\n');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.log('⚠️  Base de données non trouvée.');
            console.log('   Exécutez: mysql -u root < database\\schema.sql\n');
        }

        process.exit(1);
    }
}

testConnection();