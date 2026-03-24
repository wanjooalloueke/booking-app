/**
 * Contrôleur des Restaurants
 * Gestion des restaurants
 */

import Restaurant from '../models/Restaurant.js';

/**
 * Récupérer tous les restaurants
 */
export const getAllRestaurants = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 20;
        const offset = (page - 1) * limit;

        const restaurants = await Restaurant.getAll(limit, offset);

        res.json({
            success: true,
            data: restaurants,
            pagination: {
                page,
                limit,
                count: restaurants.length
            }
        });

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des restaurants'
        });
    }
};

/**
 * Récupérer un restaurant par ID
 */
export const getRestaurantById = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant non trouvé'
            });
        }

        res.json({
            success: true,
            data: restaurant
        });

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du restaurant'
        });
    }
};

/**
 * Rechercher des restaurants
 */
export const searchRestaurants = async (req, res) => {
    try {
        const { ville, prixMin, prixMax, disponibilite } = req.query;

        const criteres = {};
        if (ville) criteres.ville = ville;
        if (prixMin && prixMax) {
            criteres.prixMin = parseInt(prixMin);
            criteres.prixMax = parseInt(prixMax);
        }
        if (disponibilite !== undefined) criteres.disponibilite = disponibilite;

        const restaurants = await Restaurant.search(criteres);

        res.json({
            success: true,
            data: restaurants,
            count: restaurants.length
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
 * Créer un nouveau restaurant (Admin)
 */
export const createRestaurant = async (req, res) => {
    try {
        const { nom, ville, description, prix, disponibilite, image } = req.body;

        // Validation
        if (!nom || !ville || !prix) {
            return res.status(400).json({
                success: false,
                message: 'Nom, ville et prix sont requis'
            });
        }

        const restaurant = await Restaurant.create(nom, ville, description || '', prix, disponibilite || 1, image || '');

        res.status(201).json({
            success: true,
            message: 'Restaurant créé avec succès',
            data: restaurant
        });

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du restaurant'
        });
    }
};

/**
 * Mettre à jour un restaurant (Admin)
 */
export const updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Vérifier que le restaurant existe
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant non trouvé'
            });
        }

        const success = await Restaurant.update(id, data);

        if (!success) {
            return res.status(400).json({
                success: false,
                message: 'Aucune mise à jour effectuée'
            });
        }

        res.json({
            success: true,
            message: 'Restaurant mis à jour avec succès'
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
 * Supprimer un restaurant (Admin)
 */
export const deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;

        const success = await Restaurant.delete(id);

        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Restaurant supprimé avec succès'
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
    getAllRestaurants,
    getRestaurantById,
    searchRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
};
