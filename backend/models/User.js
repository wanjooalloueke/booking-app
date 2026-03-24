/**
 * Model Utilisateur
 * Gestion des utilisateurs et authentification
 */

import bcrypt from 'bcryptjs';
import { query, queryOne, execute } from '../config/database.js';

class User {
    /**
     * Créer un nouvel utilisateur (inscription classique)
     */
    static async create(nom, prenom, email, password, telephone = null) {
        // Vérifier si l'email existe déjà
        const existingUser = await this.findByEmail(email);
        if (existingUser) {
            throw new Error('Cet email est déjà utilisé');
        }

        // Hasher le mot de passe avec bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insérer l'utilisateur
        const sql = 'INSERT INTO users (nom, prenom, email, mot_de_passe, telephone, provider, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const result = await execute(sql, [nom, prenom || null, email, hashedPassword, telephone || null, 'local', 'client']);

        return {
            id: result.insertId,
            nom,
            prenom: prenom || null,
            email,
            telephone: telephone || null,
            role: 'client'
        };
    }

    /**
     * Trouver ou créer un utilisateur via OAuth (Google, Facebook, Apple)
     */
    static async findOrCreateOAuth(profile, provider) {
        const { id: providerId, displayName, emails, photos } = profile;
        const email = emails && emails[0] ? emails[0].value : null;
        const nameParts = displayName ? displayName.split(' ') : ['', ''];
        const prenom = nameParts[0] || '';
        const nom = nameParts.slice(1).join(' ') || prenom;

        // Chercher par provider_id
        let user = await queryOne(
            'SELECT id, nom, prenom, email, role FROM users WHERE provider = ? AND provider_id = ?',
            [provider, String(providerId)]
        );

        if (user) return user;

        // Chercher par email si différent
        if (email) {
            user = await queryOne('SELECT id, nom, prenom, email, role FROM users WHERE email = ?', [email]);
            if (user) {
                // Lier le compte OAuth au compte existant
                await execute(
                    'UPDATE users SET provider = ?, provider_id = ? WHERE id = ?',
                    [provider, String(providerId), user.id]
                );
                return user;
            }
        }

        // Créer un nouveau compte OAuth
        const sql = 'INSERT INTO users (nom, prenom, email, mot_de_passe, provider, provider_id, role) VALUES (?, ?, ?, NULL, ?, ?, ?)';
        const result = await execute(sql, [nom, prenom, email, provider, String(providerId), 'client']);

        return {
            id: result.insertId,
            nom,
            prenom,
            email,
            role: 'client'
        };
    }

    /**
     * Trouver un utilisateur par email
     */
    static async findByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        return await queryOne(sql, [email]);
    }

    /**
     * Trouver un utilisateur par ID
     */
    static async findById(id) {
        const sql = 'SELECT id, nom, email, role FROM users WHERE id = ?';
        return await queryOne(sql, [id]);
    }

    /**
     * Vérifier le mot de passe
     */
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    /**
     * Mettre à jour un utilisateur
     */
    static async update(id, data) {
        const allowedFields = ['nom', 'prenom', 'email', 'telephone', 'role'];
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
        const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
        const result = await execute(sql, values);
        return result.affectedRows > 0;
    }

    /**
     * Supprimer un utilisateur
     */
    static async delete(id) {
        const sql = 'DELETE FROM users WHERE id = ?';
        const result = await execute(sql, [id]);
        return result.affectedRows > 0;
    }

    /**
     * Lister tous les utilisateurs
     */
    static async getAllUsers(limit = 50, offset = 0) {
        const sql = 'SELECT id, nom, email, role FROM users LIMIT ? OFFSET ?';
        return await query(sql, [limit, offset]);
    }
}

export default User;
