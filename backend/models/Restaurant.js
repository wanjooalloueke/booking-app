/**
 * Model Restaurant
 * Gestion des restaurants
 */

import { query, queryOne, execute } from '../config/database.js';

class Restaurant {
    /**
     * Créer un nouveau restaurant
     */
    static async create(nom, ville, description, prix, disponibilite, image) {
        const sql = `
            INSERT INTO restaurants (nom, ville, description, prix, disponibilite, image)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const result = await execute(sql, [nom, ville, description, prix, disponibilite, image]);
        return { id: result.insertId, nom, ville, prix };
    }

    /**
     * Récupérer un restaurant par ID
     */
    static async findById(id) {
        const sql = 'SELECT id, nom, ville, description, prix, disponibilite, image, note, nombre_avis as avis, date_creation, date_modification FROM restaurants WHERE id = ?';
        return await queryOne(sql, [id]);
    }

    /**
     * Récupérer tous les restaurants
     */
    static async getAll(limit = 50, offset = 0) {
        const sql = 'SELECT id, nom, ville, description, prix, disponibilite, image, note, nombre_avis as avis, date_creation, date_modification FROM restaurants LIMIT ? OFFSET ?';
        return await query(sql, [limit, offset]);
    }

    /**
     * Rechercher des restaurants par ville
     */
    static async findByCity(ville) {
        const sql = 'SELECT id, nom, ville, description, prix, disponibilite, image, note, nombre_avis as avis, date_creation, date_modification FROM restaurants WHERE ville = ?';
        return await query(sql, [ville]);
    }

    /**
     * Rechercher par critères
     */
    static async search(criteres = {}) {
        let sql = 'SELECT id, nom, ville, description, prix, disponibilite, image, note, nombre_avis as avis, date_creation, date_modification FROM restaurants WHERE 1=1';
        const params = [];

        if (criteres.ville) {
            sql += ' AND ville = ?';
            params.push(criteres.ville);
        }

        if (criteres.prixMin && criteres.prixMax) {
            sql += ' AND prix BETWEEN ? AND ?';
            params.push(criteres.prixMin, criteres.prixMax);
        }

        if (criteres.disponibilite !== undefined) {
            sql += ' AND disponibilite = ?';
            params.push(criteres.disponibilite);
        }

        sql += ' LIMIT 50';
        return await query(sql, params);
    }

    /**
     * Mettre à jour un restaurant
     */
    static async update(id, data) {
        const allowedFields = ['nom', 'description', 'prix', 'disponibilite', 'image'];
        const updates = [];
        const values = [];

        for (const field in data) {
            if (allowedFields.includes(field)) {
                updates.push(`${field} = ?`);
                values.push(data[field]);
            }
        }

        if (updates.length === 0) return false;

        values.push(id);
        const sql = `UPDATE restaurants SET ${updates.join(', ')} WHERE id = ?`;
        const result = await execute(sql, values);
        return result.affectedRows > 0;
    }

    /**
     * Supprimer un restaurant
     */
    static async delete(id) {
        const sql = 'DELETE FROM restaurants WHERE id = ?';
        const result = await execute(sql, [id]);
        return result.affectedRows > 0;
    }
}

export default Restaurant;
