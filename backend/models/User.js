/**
 * Model Utilisateur
 * Gestion des utilisateurs et authentification
 * Fallback en mémoire si MySQL indisponible (données perdues au redémarrage)
 */

import bcrypt from 'bcryptjs';
import { query, queryOne, execute } from '../config/database.js';

// Store en mémoire (fallback sans DB)
const memUsers = new Map(); // id -> userObject
let memIdCounter = 1000;
let userColumnsCache = null;
const allowMemoryFallback = process.env.ALLOW_MEMORY_FALLBACK === 'true' || process.env.NODE_ENV !== 'production';

function memFindByEmail(email) {
    for (const u of memUsers.values()) {
        if (u.email && u.email.toLowerCase() === email.toLowerCase()) return u;
    }
    return null;
}

function memFindByOAuth(provider, providerId) {
    for (const u of memUsers.values()) {
        if (u.provider === provider && u.provider_id === String(providerId)) return u;
    }
    return null;
}

async function getUserColumns() {
    if (userColumnsCache) {
        return userColumnsCache;
    }

    try {
        const rows = await query('SHOW COLUMNS FROM users');
        userColumnsCache = new Set(rows.map((row) => row.Field));
        return userColumnsCache;
    } catch (error) {
        // Valeurs par défaut du schéma courant si l'introspection échoue.
        userColumnsCache = new Set(['id', 'nom', 'prenom', 'email', 'telephone', 'mot_de_passe', 'provider', 'provider_id', 'role']);
        return userColumnsCache;
    }
}

function resolvePasswordColumn(columns) {
    if (columns.has('mot_de_passe')) return 'mot_de_passe';
    if (columns.has('password')) return 'password';
    return 'mot_de_passe';
}

class User {
    /**
     * Créer un nouvel utilisateur (inscription classique)
     */
    static async create(nom, prenom, email, password, telephone = null) {
        try {
            const existingUser = await this.findByEmail(email);
            if (existingUser) {
                throw new Error('Cet email est déjà utilisé');
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const columns = await getUserColumns();
            const passwordColumn = resolvePasswordColumn(columns);

            const insertColumns = ['nom', 'email', passwordColumn];
            const insertValues = [nom, email, hashedPassword];

            if (columns.has('prenom')) {
                insertColumns.push('prenom');
                insertValues.push(prenom || null);
            }

            if (columns.has('telephone')) {
                insertColumns.push('telephone');
                insertValues.push(telephone || null);
            }

            if (columns.has('provider')) {
                insertColumns.push('provider');
                insertValues.push('local');
            }

            if (columns.has('role')) {
                insertColumns.push('role');
                insertValues.push('client');
            }

            const placeholders = insertColumns.map(() => '?').join(', ');
            const sql = `INSERT INTO users (${insertColumns.join(', ')}) VALUES (${placeholders})`;
            const result = await execute(sql, insertValues);

            return {
                id: result.insertId,
                nom,
                prenom: prenom || null,
                email,
                telephone: telephone || null,
                role: 'client'
            };
        } catch (error) {
            if (error.message === 'Cet email est déjà utilisé') throw error;
            if (!allowMemoryFallback) {
                throw error;
            }
            // Fallback en mémoire
            console.warn('[Fallback] DB indisponible pour User.create, stockage en mémoire');
            if (memFindByEmail(email)) throw new Error('Cet email est déjà utilisé');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const id = ++memIdCounter;
            const user = { id, nom, prenom: prenom || null, email, mot_de_passe: hashedPassword, telephone: telephone || null, provider: 'local', role: 'client' };
            memUsers.set(id, user);
            return { id, nom, prenom: prenom || null, email, telephone: telephone || null, role: 'client' };
        }
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

        try {
            let user = await queryOne(
                'SELECT id, nom, prenom, email, role FROM users WHERE provider = ? AND provider_id = ?',
                [provider, String(providerId)]
            );
            if (user) return user;

            if (email) {
                user = await queryOne('SELECT id, nom, prenom, email, role FROM users WHERE email = ?', [email]);
                if (user) {
                    await execute('UPDATE users SET provider = ?, provider_id = ? WHERE id = ?', [provider, String(providerId), user.id]);
                    return user;
                }
            }

            const sql = 'INSERT INTO users (nom, prenom, email, mot_de_passe, provider, provider_id, role) VALUES (?, ?, ?, NULL, ?, ?, ?)';
            const result = await execute(sql, [nom, prenom, email, provider, String(providerId), 'client']);
            return { id: result.insertId, nom, prenom, email, role: 'client' };
        } catch (error) {
            if (!allowMemoryFallback) {
                throw error;
            }
            console.warn('[Fallback] DB indisponible pour OAuth, stockage en mémoire');
            let user = memFindByOAuth(provider, providerId);
            if (user) return { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role };
            if (email) {
                user = memFindByEmail(email);
                if (user) return { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role };
            }
            const id = ++memIdCounter;
            const newUser = { id, nom, prenom, email, mot_de_passe: null, provider, provider_id: String(providerId), role: 'client' };
            memUsers.set(id, newUser);
            return { id, nom, prenom, email, role: 'client' };
        }
    }

    /**
     * Trouver un utilisateur par email
     */
    static async findByEmail(email) {
        try {
            const columns = await getUserColumns();
            const passwordColumn = resolvePasswordColumn(columns);
            const sql = `
                SELECT
                    id,
                    ${columns.has('nom') ? 'nom' : 'NULL AS nom'},
                    ${columns.has('prenom') ? 'prenom' : 'NULL AS prenom'},
                    email,
                    ${columns.has('telephone') ? 'telephone' : 'NULL AS telephone'},
                    ${columns.has(passwordColumn) ? `${passwordColumn} AS mot_de_passe` : 'NULL AS mot_de_passe'},
                    ${columns.has('provider') ? 'provider' : "'local' AS provider"},
                    ${columns.has('provider_id') ? 'provider_id' : 'NULL AS provider_id'},
                    ${columns.has('role') ? 'role' : "'client' AS role"}
                FROM users
                WHERE email = ?
                LIMIT 1
            `;
            const dbUser = await queryOne(sql, [email]);
            if (dbUser) {
                return dbUser;
            }
            return allowMemoryFallback ? (memFindByEmail(email) || null) : null;
        } catch (error) {
            if (!allowMemoryFallback) {
                throw error;
            }
            return memFindByEmail(email) || null;
        }
    }

    /**
     * Trouver un utilisateur par ID
     */
    static async findById(id) {
        try {
            const columns = await getUserColumns();
            const sql = `
                SELECT
                    id,
                    ${columns.has('nom') ? 'nom' : 'NULL AS nom'},
                    email,
                    ${columns.has('role') ? 'role' : "'client' AS role"}
                FROM users
                WHERE id = ?
                LIMIT 1
            `;
            const dbUser = await queryOne(sql, [id]);
            if (dbUser) {
                return dbUser;
            }
            if (!allowMemoryFallback) {
                return null;
            }
            const memUser = memUsers.get(Number(id));
            return memUser ? { id: memUser.id, nom: memUser.nom, email: memUser.email, role: memUser.role } : null;
        } catch (error) {
            if (!allowMemoryFallback) {
                throw error;
            }
            const u = memUsers.get(Number(id));
            return u ? { id: u.id, nom: u.nom, email: u.email, role: u.role } : null;
        }
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
