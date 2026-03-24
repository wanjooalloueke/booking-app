/**
 * Model Hôtel
 * Gestion des hôtels
 */

import { query, queryOne, execute } from '../config/database.js';

class Hotel {
    /**
     * Créer un nouvel hôtel
     */
    static async create(nom, ville, description, prix, disponibilite, image) {
        const sql = `
            INSERT INTO hotels (nom, ville, description, prix, disponibilite, image)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const result = await execute(sql, [nom, ville, description, prix, disponibilite, image]);
        return { id: result.insertId, nom, ville, prix };
    }

    /**
     * Récupérer un hôtel par ID
     */
    static async findById(id) {
        const sql = 'SELECT id, nom, ville, description, prix, disponibilite, image, note, nombre_avis as avis, date_creation, date_modification FROM hotels WHERE id = ?';
        return await queryOne(sql, [id]);
    }

    /**
     * Récupérer tous les hôtels
     */
    static async getAll(limit = 50, offset = 0) {
        const sql = 'SELECT id, nom, ville, description, prix, disponibilite, image, note, nombre_avis as avis, date_creation, date_modification FROM hotels LIMIT ? OFFSET ?';
        return await query(sql, [limit, offset]);
    }

    /**
     * Rechercher des hôtels par ville
     */
    static async findByCity(ville) {
        const sql = 'SELECT id, nom, ville, description, prix, disponibilite, image, note, nombre_avis as avis, date_creation, date_modification FROM hotels WHERE ville = ?';
        return await query(sql, [ville]);
    }

    /**
     * Rechercher par critères
     */
    static async search(criteres = {}) {
        let sql = 'SELECT id, nom, ville, description, prix, disponibilite, image, note, nombre_avis as avis, date_creation, date_modification FROM hotels WHERE 1=1';
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
     * Mettre à jour un hôtel
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
        const sql = `UPDATE hotels SET ${updates.join(', ')} WHERE id = ?`;
        const result = await execute(sql, values);
        return result.affectedRows > 0;
    }

    /**
     * Supprimer un hôtel
     */
    static async delete(id) {
        const sql = 'DELETE FROM hotels WHERE id = ?';
        const result = await execute(sql, [id]);
        return result.affectedRows > 0;
    }
}

export default Hotel;
