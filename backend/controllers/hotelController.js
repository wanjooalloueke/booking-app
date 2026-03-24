/**
 * Contrôleur des Hôtels
 * Gestion des hôtels
 */

import Hotel from '../models/Hotel.js';

/**
 * Récupérer tous les hôtels
 */
export const getAllHotels = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 20;
        const offset = (page - 1) * limit;

        const hotels = await Hotel.getAll(limit, offset);

        res.json({
            success: true,
            data: hotels,
            pagination: {
                page,
                limit,
                count: hotels.length
            }
        });

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des hôtels'
        });
    }
};

/**
 * Récupérer un hôtel par ID
 */
export const getHotelById = async (req, res) => {
    try {
        const { id } = req.params;
        const hotel = await Hotel.findById(id);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: 'Hôtel non trouvé'
            });
        }

        res.json({
            success: true,
            data: hotel
        });

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de l\'hôtel'
        });
    }
};

/**
 * Rechercher des hôtels
 */
export const searchHotels = async (req, res) => {
    try {
        const { ville, prixMin, prixMax, disponibilite } = req.query;

        const criteres = {};
        if (ville) criteres.ville = ville;
        if (prixMin && prixMax) {
            criteres.prixMin = parseInt(prixMin);
            criteres.prixMax = parseInt(prixMax);
        }
        if (disponibilite !== undefined) criteres.disponibilite = disponibilite;

        const hotels = await Hotel.search(criteres);

        res.json({
            success: true,
            data: hotels,
            count: hotels.length
        });

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la recherche'
        });
    }
};

/**
 * Créer un nouvel hôtel (Admin)
 */
export const createHotel = async (req, res) => {
    try {
        const { nom, ville, description, prix, disponibilite, image } = req.body;

        // Validation
        if (!nom || !ville || !prix) {
            return res.status(400).json({
                success: false,
                message: 'Nom, ville et prix sont requis'
            });
        }

        const hotel = await Hotel.create(nom, ville, description || '', prix, disponibilite || 1, image || '');

        res.status(201).json({
            success: true,
            message: 'Hôtel créé avec succès',
            data: hotel
        });

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de l\'hôtel'
        });
    }
};

/**
 * Mettre à jour un hôtel (Admin)
 */
export const updateHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Vérifier que l'hôtel existe
        const hotel = await Hotel.findById(id);
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: 'Hôtel non trouvé'
            });
        }

        const success = await Hotel.update(id, data);

        if (!success) {
            return res.status(400).json({
                success: false,
                message: 'Aucune mise à jour effectuée'
            });
        }

        res.json({
            success: true,
            message: 'Hôtel mis à jour avec succès'
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
 * Supprimer un hôtel (Admin)
 */
export const deleteHotel = async (req, res) => {
    try {
        const { id } = req.params;

        const success = await Hotel.delete(id);

        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Hôtel non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Hôtel supprimé avec succès'
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
    getAllHotels,
    getHotelById,
    searchHotels,
    createHotel,
    updateHotel,
    deleteHotel
};
