/**
 * Contrôleur des Hôtels
 * Gestion des hôtels
 */

import Hotel from '../models/Hotel.js';

const normalizeCity = (value = '') => value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Données fallback si la base de données est indisponible
const FALLBACK_HOTELS = [
    { id: 1, nom: "Hôtel Ivoire", ville: "Abidjan", prix: 85000, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80", note: 4.8, avis: 234, disponibilite: 1, description: "Établissement 5 étoiles prestigieux offrant une vue panoramique sur la lagune Ébrié. Chambres spacieuses avec balcon privé, spa de luxe, piscine à débordement, restaurant gastronomique et service de conciergerie 24h/24." },
    { id: 2, nom: "Sofitel Abidjan", ville: "Abidjan", prix: 120000, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80", note: 4.7, avis: 189, disponibilite: 1, description: "Palace emblématique de la Riviera Palmeraie avec 315 chambres et suites luxueuses. Centre de fitness high-tech, spa by Sisley, 3 restaurants, piscine olympique." },
    { id: 3, nom: "Pullman Abidjan", ville: "Abidjan", prix: 95000, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80", note: 4.6, avis: 167, disponibilite: 1, description: "Hôtel 4 étoiles moderne au cœur du Plateau. 245 chambres élégantes avec vue sur la ville, centre d'affaires complet, salle de fitness, piscine extérieure." },
    { id: 4, nom: "Auberge Yamoussoukro", ville: "Yamoussoukro", prix: 45000, image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80", note: 4.5, avis: 95, disponibilite: 1, description: "Charmante auberge familiale au cœur de la capitale politique. 24 chambres climatisées avec décoration locale, jardin tropical, restaurant traditionnel." },
    { id: 5, nom: "Novotel Yamoussoukro", ville: "Yamoussoukro", prix: 65000, image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80", note: 4.4, avis: 134, disponibilite: 1, description: "Hôtel 4 étoiles contemporain avec 180 chambres confortables. Restaurant international, bar lounge, piscine extérieure, salle de sport." },
    { id: 6, nom: "Hotel Plaza Bouaké", ville: "Bouaké", prix: 55000, image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80", note: 4.3, avis: 76, disponibilite: 1, description: "Hôtel d'affaires moderne au centre-ville de Bouaké. 80 chambres confortables avec WiFi haut débit, salle de réunion équipée, restaurant climatisé." },
    { id: 7, nom: "Mercure Bouaké", ville: "Bouaké", prix: 48000, image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80", note: 4.2, avis: 89, disponibilite: 1, description: "Hôtel 3 étoiles confortable avec 95 chambres modernes. Restaurant climatisé, bar, piscine extérieure et salle de fitness." },
    { id: 8, nom: "Beachfront San-Pédro", ville: "San-Pédro", prix: 65000, image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80", note: 4.6, avis: 112, disponibilite: 1, description: "Complexe balnéaire exclusif sur la Côte d'Azur ivoirienne. 120 chambres avec vue mer, plage privée, 2 piscines, restaurant de fruits de mer." }
];

/**
 * Récupérer tous les hôtels
 */
export const getAllHotels = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 20;
        const offset = (page - 1) * limit;

        const hotels = await Hotel.getAll(limit, offset);
        const resolvedHotels = hotels.length > 0 ? hotels : FALLBACK_HOTELS;

        res.json({
            success: true,
            data: resolvedHotels,
            fallback: hotels.length === 0,
            pagination: { page, limit, count: resolvedHotels.length }
        });

    } catch (error) {
        console.warn('[Fallback] DB indisponible pour hôtels, utilisation données d\'exemple:', error.message);
        res.json({
            success: true,
            data: FALLBACK_HOTELS,
            fallback: true,
            pagination: { page: 1, limit: FALLBACK_HOTELS.length, count: FALLBACK_HOTELS.length }
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
            const fallback = FALLBACK_HOTELS.find(h => h.id === parseInt(id));
            if (fallback) return res.json({ success: true, data: fallback, fallback: true });
            return res.status(404).json({ success: false, message: 'Hôtel non trouvé' });
        }

        res.json({ success: true, data: hotel });

    } catch (error) {
        console.warn('[Fallback] DB indisponible pour hôtel id:', req.params.id);
        const fallback = FALLBACK_HOTELS.find(h => h.id === parseInt(req.params.id));
        if (fallback) return res.json({ success: true, data: fallback, fallback: true });
        res.status(404).json({ success: false, message: 'Hôtel non trouvé' });
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
        if (hotels.length > 0) {
            return res.json({ success: true, data: hotels, count: hotels.length });
        }

        const villeNorm = normalizeCity(ville || '');
        const fallbackResults = villeNorm
            ? FALLBACK_HOTELS.filter((h) => normalizeCity(h.ville).includes(villeNorm))
            : FALLBACK_HOTELS;

        return res.json({ success: true, data: fallbackResults, count: fallbackResults.length, fallback: true });

    } catch (error) {
        console.warn('[Fallback] DB indisponible pour recherche hôtels');
        const { ville } = req.query;
        const villeNorm = normalizeCity(ville || '');
        const results = villeNorm
            ? FALLBACK_HOTELS.filter((h) => normalizeCity(h.ville).includes(villeNorm))
            : FALLBACK_HOTELS;
        res.json({ success: true, data: results, count: results.length, fallback: true });
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
