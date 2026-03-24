/**
 * Contrôleur des Restaurants
 * Gestion des restaurants
 */

import Restaurant from '../models/Restaurant.js';

// Données fallback si la base de données est indisponible
const FALLBACK_RESTAURANTS = [
    { id: 1, nom: "Le Palais Africain", ville: "Abidjan", prix: 12000, image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80", note: 4.9, avis: 456, disponibilite: 1, description: "Institution culinaire ivoirienne depuis 1985, spécialisée dans la gastronomie traditionnelle ouest-africaine. Chef exécutif formé à Paris, carte de 50 plats signatures." },
    { id: 2, nom: "Chez Émile", ville: "Abidjan", prix: 18000, image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=80", note: 4.7, avis: 234, disponibilite: 1, description: "Bistrot français contemporain avec influences ivoiriennes. Fusion créative entre cuisine hexagonale et produits locaux frais. Terrasse ombragée, service professionnel." },
    { id: 3, nom: "Maquis Traditionnel", ville: "Abidjan", prix: 8000, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80", note: 4.6, avis: 312, disponibilite: 1, description: "Authentique maquis ivoirien dans le quartier populaire de Yopougon. Spécialisé dans la cuisine de rue revisitée : brochettes, poisson braisé, attiéké." },
    { id: 4, nom: "Restaurant du Parc", ville: "Yamoussoukro", prix: 9000, image: "https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=1200&q=80", note: 4.4, avis: 123, disponibilite: 1, description: "Adresse conviviale au cœur du Parc de la Paix, offrant une cuisine internationale de qualité. Ambiance familiale, service attentionné, espace enfants." },
    { id: 5, nom: "Le Jardin Gourmand", ville: "Yamoussoukro", prix: 14000, image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80", note: 4.5, avis: 178, disponibilite: 1, description: "Restaurant gastronomique dans un jardin tropical luxuriant. Cuisine fusion Afrique-Europe. Cadre romantique avec éclairage tamisé, service impeccable." },
    { id: 6, nom: "Ocean View", ville: "San-Pédro", prix: 15000, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80", note: 4.8, avis: 189, disponibilite: 1, description: "Restaurant de fruits de mer haut de gamme avec vue imprenable sur l'océan Atlantique. Homard grillé, thon rouge frais, crevettes géantes." },
    { id: 7, nom: "La Savane", ville: "Bouaké", prix: 8000, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80", note: 4.5, avis: 98, disponibilite: 1, description: "Institution locale depuis 1972, temple de la cuisine régionale savane. Spécialités : poulet bicyclette, sauce graine, alloco et plats traditionnels baoulé." },
    { id: 8, nom: "Le Portail", ville: "Bouaké", prix: 11000, image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80", note: 4.3, avis: 145, disponibilite: 1, description: "Restaurant moderne au design contemporain, spécialisé dans la cuisine fusion Afrique-Occident. Burger ivoirien, salades exotiques, pizzas tropicales." }
];

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
            pagination: { page, limit, count: restaurants.length }
        });

    } catch (error) {
        console.warn('[Fallback] DB indisponible pour restaurants:', error.message);
        res.json({
            success: true,
            data: FALLBACK_RESTAURANTS,
            fallback: true,
            pagination: { page: 1, limit: FALLBACK_RESTAURANTS.length, count: FALLBACK_RESTAURANTS.length }
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
            const fallback = FALLBACK_RESTAURANTS.find(r => r.id === parseInt(id));
            if (fallback) return res.json({ success: true, data: fallback, fallback: true });
            return res.status(404).json({ success: false, message: 'Restaurant non trouvé' });
        }

        res.json({ success: true, data: restaurant });

    } catch (error) {
        console.warn('[Fallback] DB indisponible pour restaurant id:', req.params.id);
        const fallback = FALLBACK_RESTAURANTS.find(r => r.id === parseInt(req.params.id));
        if (fallback) return res.json({ success: true, data: fallback, fallback: true });
        res.status(404).json({ success: false, message: 'Restaurant non trouvé' });
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

        res.json({ success: true, data: restaurants, count: restaurants.length });

    } catch (error) {
        console.warn('[Fallback] DB indisponible pour recherche restaurants');
        const { ville } = req.query;
        const results = ville
            ? FALLBACK_RESTAURANTS.filter(r => r.ville.toLowerCase().includes(ville.toLowerCase()))
            : FALLBACK_RESTAURANTS;
        res.json({ success: true, data: results, count: results.length, fallback: true });
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
