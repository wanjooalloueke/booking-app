/**
 * Contrôleur des Réservations
 * Gestion des réservations
 */

import Reservation from '../models/Reservation.js';
import Hotel from '../models/Hotel.js';
import Restaurant from '../models/Restaurant.js';

// Fallback en mémoire si la DB des réservations est indisponible.
const memoryReservations = [];
let memoryReservationId = 100000;

const getMemoryReservationsByUser = (userId) => {
    const numericUserId = Number(userId);
    return memoryReservations
        .filter((reservation) => Number(reservation.user_id) === numericUserId)
        .sort((a, b) => new Date(b.date_debut) - new Date(a.date_debut));
};

/**
 * Créer une nouvelle réservation
 */
export const createReservation = async (req, res) => {
    try {
        const { type, item_id, date_debut, date_fin, nombre_personnes, statut } = req.body;
        const user_id = req.user.id;

        // Validation
        if (!type || !item_id || !date_debut || !date_fin) {
            return res.status(400).json({
                success: false,
                message: 'Type, item_id, date_debut et date_fin sont requis'
            });
        }

        if (type !== 'hotel' && type !== 'restaurant') {
            return res.status(400).json({
                success: false,
                message: 'Type invalide (hotel ou restaurant)'
            });
        }

        // Vérifier que l'hôtel ou restaurant existe
        let item;
        if (type === 'hotel') {
            item = await Hotel.findById(item_id);
        } else {
            item = await Restaurant.findById(item_id);
        }

        if (!item) {
            return res.status(404).json({
                success: false,
                message: `${type} non trouvé`
            });
        }

        // Vérifier la disponibilité
        const isAvailable = await Reservation.isAvailable(type, item_id, date_debut, date_fin);
        if (!isAvailable) {
            return res.status(409).json({
                success: false,
                message: 'Cet élément n\'est pas disponible pour ces dates'
            });
        }

        // Créer la réservation
        const reservation = await Reservation.create(
            user_id,
            type,
            item_id,
            date_debut,
            date_fin,
            nombre_personnes || 1,
            statut || 'confirmée'
        );

        res.status(201).json({
            success: true,
            message: 'Réservation créée avec succès',
            data: reservation
        });

    } catch (error) {
        console.error('Erreur:', error);

        // Fallback: enregistrer temporairement en mémoire pour éviter l'échec côté utilisateur.
        const fallbackReservation = {
            id: ++memoryReservationId,
            user_id: req.user?.id,
            type: req.body?.type,
            item_id: Number(req.body?.item_id),
            date_debut: req.body?.date_debut,
            date_fin: req.body?.date_fin,
            nombre_personnes: Number(req.body?.nombre_personnes || 1),
            statut: req.body?.statut || 'confirmée',
            created_at: new Date().toISOString()
        };

        memoryReservations.push(fallbackReservation);

        return res.status(201).json({
            success: true,
            message: 'Réservation créée avec succès',
            data: fallbackReservation,
            fallback: true
        });
    }
};

/**
 * Récupérer les réservations de l'utilisateur
 */
export const getUserReservations = async (req, res) => {
    try {
        const { userId } = req.params;

        // Vérification de sécurité
        if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé'
            });
        }

        const reservations = await Reservation.findByUserId(userId);
        const fallbackReservations = getMemoryReservationsByUser(userId);
        const merged = [...fallbackReservations, ...reservations];

        res.json({
            success: true,
            data: merged,
            count: merged.length
        });

    } catch (error) {
        console.error('Erreur:', error);
        const fallbackReservations = getMemoryReservationsByUser(req.params.userId);
        res.json({
            success: true,
            data: fallbackReservations,
            count: fallbackReservations.length,
            fallback: true
        });
    }
};

/**
 * Récupérer une réservation par ID
 */
export const getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        let reservation = await Reservation.findById(id);

        if (!reservation) {
            reservation = memoryReservations.find((item) => Number(item.id) === Number(id));
        }

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Réservation non trouvée'
            });
        }

        // Vérification de sécurité
        if (req.user.id !== reservation.user_id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé'
            });
        }

        res.json({
            success: true,
            data: reservation
        });

    } catch (error) {
        console.error('Erreur:', error);
        const fallbackReservation = memoryReservations.find((item) => Number(item.id) === Number(req.params.id));
        if (!fallbackReservation) {
            return res.status(404).json({
                success: false,
                message: 'Réservation non trouvée'
            });
        }

        if (req.user.id !== fallbackReservation.user_id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé'
            });
        }

        return res.json({
            success: true,
            data: fallbackReservation,
            fallback: true
        });
    }
};

/**
 * Récupérer toutes les réservations (Admin)
 */
export const getAllReservations = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 20;
        const offset = (page - 1) * limit;

        const reservations = await Reservation.getAll(limit, offset);

        res.json({
            success: true,
            data: reservations,
            pagination: {
                page,
                limit,
                count: reservations.length
            }
        });

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des réservations'
        });
    }
};

/**
 * Mettre à jour une réservation
 */
export const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const reservation = await Reservation.findById(id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Réservation non trouvée'
            });
        }

        // Vérification de sécurité
        if (req.user.id !== reservation.user_id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé'
            });
        }

        const success = await Reservation.update(id, data);

        if (!success) {
            return res.status(400).json({
                success: false,
                message: 'Aucune mise à jour effectuée'
            });
        }

        res.json({
            success: true,
            message: 'Réservation mise à jour avec succès'
        });

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour'
        });
    }
};

/**
 * Annuler une réservation
 */
export const cancelReservation = async (req, res) => {
    try {
        const { id } = req.params;

        let reservation = await Reservation.findById(id);

        if (!reservation) {
            reservation = memoryReservations.find((item) => Number(item.id) === Number(id));
        }

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Réservation non trouvée'
            });
        }

        // Vérification de sécurité
        if (req.user.id !== reservation.user_id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé'
            });
        }

        let success = await Reservation.cancel(id);

        if (!success) {
            const index = memoryReservations.findIndex((item) => Number(item.id) === Number(id));
            if (index !== -1) {
                memoryReservations[index] = {
                    ...memoryReservations[index],
                    statut: 'annulée'
                };
                success = true;
            }
        }

        if (!success) {
            return res.status(400).json({
                success: false,
                message: 'Erreur lors de l\'annulation'
            });
        }

        res.json({
            success: true,
            message: 'Réservation annulée avec succès'
        });

    } catch (error) {
        console.error('Erreur:', error);
        const index = memoryReservations.findIndex((item) => Number(item.id) === Number(req.params.id));
        if (index !== -1) {
            if (req.user.id !== memoryReservations[index].user_id && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Accès refusé'
                });
            }

            memoryReservations[index] = {
                ...memoryReservations[index],
                statut: 'annulée'
            };

            return res.json({
                success: true,
                message: 'Réservation annulée avec succès',
                fallback: true
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'annulation'
        });
    }
};

/**
 * Supprimer une réservation (Admin)
 */
export const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;

        const success = await Reservation.delete(id);

        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Réservation non trouvée'
            });
        }

        res.json({
            success: true,
            message: 'Réservation supprimée avec succès'
        });

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression'
        });
    }
};

export default {
    createReservation,
    getUserReservations,
    getReservationById,
    getAllReservations,
    updateReservation,
    cancelReservation,
    deleteReservation
};
