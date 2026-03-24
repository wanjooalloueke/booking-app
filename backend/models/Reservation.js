/**
 * Model Réservation
 * Gestion des réservations
 */

import { query, queryOne, execute } from '../config/database.js';

class Reservation {
    /**
     * Normaliser un statut de réservation pour garantir une valeur valide.
     */
    static normalizeStatus(statut) {
        const value = (statut || '')
            .toString()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
            .replace(/[_-]+/g, ' ')
            .replace(/\s+/g, ' ');

        if (!value || value === 'confirmee' || value === 'confirmee') {
            return 'confirmée';
        }

        if (value === 'en attente' || value === 'attente' || value === 'enattente') {
            return 'en attente';
        }

        if (value === 'annulee' || value === 'annule') {
            return 'annulée';
        }

        return 'confirmée';
    }

    /**
     * Garantir un format cohérent pour les données renvoyées au frontend.
     */
    static formatReservation(reservation) {
        if (!reservation) {
            return null;
        }

        return {
            ...reservation,
            statut: Reservation.normalizeStatus(reservation.statut)
        };
    }

    /**
     * Créer une nouvelle réservation
     */
    static async create(userId, type, itemId, dateDebut, dateFin, nombrePersonnes, statut = 'confirmée') {
        const normalizedStatus = Reservation.normalizeStatus(statut);
        const sql = `
            INSERT INTO reservations (user_id, type, item_id, date_debut, date_fin, nombre_personnes, statut)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await execute(sql, [userId, type, itemId, dateDebut, dateFin, nombrePersonnes, normalizedStatus]);
        return { id: result.insertId };
    }

    /**
     * Récupérer une réservation par ID
     */
    static async findById(id) {
        const sql = 'SELECT * FROM reservations WHERE id = ?';
        const result = await queryOne(sql, [id]);
        return Reservation.formatReservation(result);
    }

    /**
     * Récupérer toutes les réservations d'un utilisateur
     */
    static async findByUserId(userId) {
        const sql = 'SELECT * FROM reservations WHERE user_id = ? ORDER BY date_debut DESC';
        const results = await query(sql, [userId]);
        return results.map((reservation) => Reservation.formatReservation(reservation));
    }

    /**
     * Récupérer toutes les réservations
     */
    static async getAll(limit = 50, offset = 0) {
        const sql = `
            SELECT r.*, u.nom, u.email 
            FROM reservations r 
            JOIN users u ON r.user_id = u.id 
            ORDER BY r.date_debut DESC 
            LIMIT ? OFFSET ?
        `;
        const results = await query(sql, [limit, offset]);
        return results.map((reservation) => Reservation.formatReservation(reservation));
    }

    /**
     * Récupérer les réservations pour un hôtel ou restaurant
     */
    static async findByItem(type, itemId) {
        const sql = 'SELECT * FROM reservations WHERE type = ? AND item_id = ? ORDER BY date_debut DESC';
        const results = await query(sql, [type, itemId]);
        return results.map((reservation) => Reservation.formatReservation(reservation));
    }

    /**
     * Vérifier la disponibilité
     */
    static async isAvailable(type, itemId, dateDebut, dateFin) {
        const sql = `
            SELECT COUNT(*) as count 
            FROM reservations 
            WHERE type = ? AND item_id = ? AND statut != 'annulée'
            AND NOT (date_fin < ? OR date_debut > ?)
        `;
        const result = await queryOne(sql, [type, itemId, dateDebut, dateFin]);
        return result.count === 0;
    }

    /**
     * Mettre à jour une réservation
     */
    static async update(id, data) {
        const allowedFields = ['date_debut', 'date_fin', 'nombre_personnes', 'statut'];
        const updates = [];
        const values = [];

        for (const field in data) {
            if (allowedFields.includes(field)) {
                updates.push(`${field} = ?`);
                values.push(field === 'statut' ? Reservation.normalizeStatus(data[field]) : data[field]);
            }
        }

        if (updates.length === 0) return false;

        values.push(id);
        const sql = `UPDATE reservations SET ${updates.join(', ')} WHERE id = ?`;
        const result = await execute(sql, values);
        return result.affectedRows > 0;
    }

    /**
     * Annuler une réservation
     */
    static async cancel(id) {
        const sql = 'UPDATE reservations SET statut = ? WHERE id = ?';
        const result = await execute(sql, ['annulée', id]);
        return result.affectedRows > 0;
    }

    /**
     * Supprimer une réservation
     */
    static async delete(id) {
        const sql = 'DELETE FROM reservations WHERE id = ?';
        const result = await execute(sql, [id]);
        return result.affectedRows > 0;
    }
}

export default Reservation;
