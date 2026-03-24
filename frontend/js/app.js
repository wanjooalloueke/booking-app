/**
 * Booking.CI - Frontend JavaScript
 * Gestion de l'interface utilisateur et des interactions avec l'API
 */

// Configuration de l'API (local vs production)
const IS_LOCAL_ENV = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const BACKEND_URL = IS_LOCAL_ENV ? 'http://localhost:5000' : window.location.origin;
const API_URL = `${BACKEND_URL}/api`;
let currentUser = null;
let authToken = localStorage.getItem('authToken');

try {
    currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
} catch {
    currentUser = null;
}

/**
 * Normaliser une chaîne en supprimant les accents
 */
function normalizeString(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// ===================================
// API FUNCTIONS
// ===================================

/**
 * Effectuer une requête API
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const config = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erreur API');
        }

        return data;
    } catch (error) {
        console.error('Erreur API:', error);
        throw error;
    }
}

/**
 * Récupérer tous les hôtels depuis l'API
 */
async function fetchHotels() {
    try {
        const response = await apiRequest('/hotels');
        return response.data || [];
    } catch (error) {
        console.error('Erreur lors du chargement des hôtels:', error);
        // Retourner les données d'exemple si l'API n'est pas disponible
        return sampleHotels;
    }
}

/**
 * Récupérer tous les restaurants depuis l'API
 */
async function fetchRestaurants() {
    try {
        const response = await apiRequest('/restaurants');
        return response.data || [];
    } catch (error) {
        console.error('Erreur lors du chargement des restaurants:', error);
        // Retourner les données d'exemple si l'API n'est pas disponible
        return sampleRestaurants;
    }
}

/**
 * Rechercher des hôtels par ville
 */
async function searchHotelsByCity(city) {
    try {
        const response = await apiRequest(`/hotels/search?ville=${encodeURIComponent(city)}`);
        return response.data || [];
    } catch (error) {
        console.error('Erreur lors de la recherche d\'hôtels:', error);
        // Filtrer les données d'exemple par ville
        const cityNormalized = normalizeString(city);
        const filtered = sampleHotels.filter(hotel => 
            normalizeString(hotel.ville).includes(cityNormalized)
        );
        return filtered.length > 0 ? filtered : [];
    }
}

/**
 * Rechercher des restaurants par ville
 */
async function searchRestaurantsByCity(city) {
    try {
        const response = await apiRequest(`/restaurants/search?ville=${encodeURIComponent(city)}`);
        return response.data || [];
    } catch (error) {
        console.error('Erreur lors de la recherche de restaurants:', error);
        // Filtrer les données d'exemple par ville
        const cityNormalized = normalizeString(city);
        const filtered = sampleRestaurants.filter(restaurant => 
            normalizeString(restaurant.ville).includes(cityNormalized)
        );
        return filtered.length > 0 ? filtered : [];
    }
}

// ===================================
// DONNÉES DE TEST
// ===================================

// Données d'hôtels fictives
const sampleHotels = [
    {
        id: 1,
        nom: "Hôtel Ivoire",
        ville: "Abidjan",
        prix: 85000,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
        note: 4.8,
        avis: 234,
        description: "Établissement 5 étoiles prestigieux offrant une vue panoramique sur la lagune Ébrié. Chambres spacieuses avec balcon privé, spa de luxe, piscine à débordement, restaurant gastronomique et service de conciergerie 24h/24. Idéal pour les voyageurs d'affaires et les séjours romantiques."
    },
    {
        id: 2,
        nom: "Sofitel Abidjan",
        ville: "Abidjan",
        prix: 120000,
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
        note: 4.7,
        avis: 189,
        description: "Palace emblématique de la Riviera Palmeraie avec 315 chambres et suites luxueuses. Centre de fitness high-tech, spa by Sisley, 3 restaurants (français, italien, africain), piscine olympique et salle de réception pour événements. Service de chauffeur et navette aéroport inclus."
    },
    {
        id: 3,
        nom: "Pullman Abidjan",
        ville: "Abidjan",
        prix: 95000,
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
        note: 4.6,
        avis: 167,
        description: "Hôtel 4 étoiles moderne au cœur du Plateau, quartier d'affaires d'Abidjan. 245 chambres élégantes avec vue sur la ville, centre d'affaires complet, salle de fitness, piscine extérieure et restaurant rooftop. Proche des banques, ministères et centres commerciaux. WiFi haut débit gratuit."
    },
    {
        id: 4,
        nom: "Auberge Yamoussoukro",
        ville: "Yamoussoukro",
        prix: 45000,
        image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80",
        note: 4.5,
        avis: 95,
        description: "Charmante auberge familiale au cœur de la capitale politique. 24 chambres climatisées avec décoration locale, jardin tropical, restaurant traditionnel servant la cuisine ivoirienne authentique, et piscine. Proche de la Basilique Notre-Dame de la Paix et des sites touristiques."
    },
    {
        id: 5,
        nom: "Novotel Yamoussoukro",
        ville: "Yamoussoukro",
        prix: 65000,
        image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
        note: 4.4,
        avis: 134,
        description: "Hôtel 4 étoiles contemporain avec 180 chambres confortables. Restaurant international, bar lounge, piscine extérieure, salle de sport et espace enfants. Centre d'affaires avec salles de réunion, parking sécurisé et service de blanchisserie. Idéal pour les voyages d'affaires et familiaux."
    },
    {
        id: 6,
        nom: "Hotel Plaza Bouaké",
        ville: "Bouaké",
        prix: 55000,
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80",
        note: 4.3,
        avis: 76,
        description: "Hôtel d'affaires moderne au centre-ville de Bouaké, deuxième plus grande ville de Côte d'Ivoire. 80 chambres confortables avec WiFi haut débit, salle de réunion équipée, restaurant climatisé, parking sécurisé et service de blanchisserie. À proximité des commerces et administrations."
    },
    {
        id: 7,
        nom: "Mercure Bouaké",
        ville: "Bouaké",
        prix: 48000,
        image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80",
        note: 4.2,
        avis: 89,
        description: "Hôtel 3 étoiles confortable avec 95 chambres modernes. Restaurant climatisé servant cuisine locale et internationale, bar, piscine extérieure et salle de fitness. Centre d'affaires avec ordinateurs et imprimante, parking gratuit. Personnel multilingue et service attentionné."
    },
    {
        id: 8,
        nom: "Beachfront San-Pédro",
        ville: "San-Pédro",
        prix: 65000,
        image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80",
        note: 4.6,
        avis: 112,
        description: "Complexe balnéaire exclusif sur la Côte d'Azur ivoirienne. 120 chambres avec vue mer, plage privée de 200m, 2 piscines (adulte et enfant), centre de plongée, restaurant de fruits de mer et bar lounge. Activités nautiques, spa marin et animations nocturnes. Accès direct au port commercial."
    }
];

// Données de restaurants fictives
const sampleRestaurants = [
    {
        id: 1,
        nom: "Le Palais Africain",
        ville: "Abidjan",
        prix: 12000,
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
        note: 4.9,
        avis: 456,
        description: "Institution culinaire ivoirienne depuis 1985, spécialisée dans la gastronomie traditionnelle ouest-africaine. Chef exécutif formé à Paris, carte de 50 plats signatures incluant le poulet kedjenou, l'attieké poisson et le foutou banane. Salle climatisée de 120 couverts, décor ethnique authentique, musique live les weekends. Réservation recommandée."
    },
    {
        id: 2,
        nom: "Chez Émile",
        ville: "Abidjan",
        prix: 18000,
        image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=80",
        note: 4.7,
        avis: 234,
        description: "Bistrot français contemporain avec influences ivoiriennes, dirigé par le chef Émile Dubois. Fusion créative entre cuisine hexagonale et produits locaux frais. Spécialités : magret de canard aux mangues, risotto aux crevettes locales, et carte des vins sélectionnés. Terrasse ombragée, service professionnel, cadre élégant propice aux dîners romantiques ou affaires."
    },
    {
        id: 3,
        nom: "Maquis Traditionnel",
        ville: "Abidjan",
        prix: 8000,
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
        note: 4.6,
        avis: 312,
        description: "Authentique maquis ivoirien dans le quartier populaire de Yopougon. Spécialisé dans la cuisine de rue revisitée : brochettes de bœuf, poisson braisé, attiéké complet et poulet DG. Ambiance conviviale avec musique africaine, décoration simple et chaleureuse. Ouvert tard le soir, parking gratuit. Cuisine familiale préparée avec des ingrédients frais locaux."
    },
    {
        id: 4,
        nom: "Restaurant du Parc",
        ville: "Yamoussoukro",
        prix: 9000,
        image: "https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=1200&q=80",
        note: 4.4,
        avis: 123,
        description: "Adresse conviviale au cœur du Parc de la Paix, offrant une cuisine internationale de qualité. Chef expérimenté propose grillades, pizzas au feu de bois, salades fraîches et plats végétariens. Ambiance familiale, service attentionné, espace enfants dédié. Idéal pour déjeuner d'affaires ou dîner en famille. Parking gratuit et WiFi haut débit."
    },
    {
        id: 5,
        nom: "Le Jardin Gourmand",
        ville: "Yamoussoukro",
        prix: 14000,
        image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
        note: 4.5,
        avis: 178,
        description: "Restaurant gastronomique dans un jardin tropical luxuriant. Cuisine fusion Afrique-Europe avec touche créative du chef international. Spécialités : filet de bœuf aux épices africaines, salade de mangues exotiques, et desserts maison. Cadre romantique avec éclairage tamisé, service impeccable et carte des vins sélectionnés. Réservation obligatoire pour dîner."
    },
    {
        id: 6,
        nom: "Ocean View",
        ville: "San-Pédro",
        prix: 15000,
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
        note: 4.8,
        avis: 189,
        description: "Restaurant de fruits de mer haut de gamme avec vue imprenable sur l'océan Atlantique. Spécialisé dans les produits de la pêche locale : homard grillé, thon rouge frais, crevettes géantes et poissons exotiques. Chef français avec 15 ans d'expérience, cave à vins marocaine, service en terrasse ou salle panoramique. Réservation obligatoire en haute saison."
    },
    {
        id: 7,
        nom: "La Savane",
        ville: "Bouaké",
        prix: 8000,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
        note: 4.5,
        avis: 98,
        description: "Institution locale depuis 1972, temple de la cuisine régionale savane. Spécialités : poulet bicyclette, sauce graine, alloco, et plats traditionnels baoulé. Ambiance authentique avec décoration ethnique, musique traditionnelle certains soirs. Cadre simple mais chaleureux, service familial, prix abordables. Cuisine maison préparée avec des ingrédients locaux frais."
    },
    {
        id: 8,
        nom: "Le Portail",
        ville: "Bouaké",
        prix: 11000,
        image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80",
        note: 4.3,
        avis: 145,
        description: "Restaurant moderne au design contemporain, spécialisé dans la cuisine fusion Afrique-Occident. Chef local formé en Europe propose des plats créatifs : burger ivoirien au bœuf local, salades exotiques, et pizzas aux ingrédients tropicaux. Ambiance branchée avec musique lounge, terrasse couverte, WiFi gratuit et parking. Idéal pour les jeunes et les familles."
    }
];

// ===================================
// INITIALISATION
// ===================================

// ===================================
// INDICATIFS TÉLÉPHONIQUES (tous pays)
// ===================================

const COUNTRY_CODES = [
    // Afrique de l'Ouest — priorité Booking.CI
    { dial: '+225', name: "🇨🇮 Côte d'Ivoire (+225)" },
    { dial: '+221', name: '🇸🇳 Sénégal (+221)' },
    { dial: '+224', name: '🇬🇳 Guinée (+224)' },
    { dial: '+233', name: '🇬🇭 Ghana (+233)' },
    { dial: '+223', name: '🇲🇱 Mali (+223)' },
    { dial: '+226', name: '🇧🇫 Burkina Faso (+226)' },
    { dial: '+228', name: '🇹🇬 Togo (+228)' },
    { dial: '+229', name: '🇧🇯 Bénin (+229)' },
    { dial: '+234', name: '🇳🇬 Nigeria (+234)' },
    { dial: '+237', name: '🇨🇲 Cameroun (+237)' },
    { dial: '+225', name: '─────────────────', disabled: true },
    // Afrique du Nord
    { dial: '+212', name: '🇲🇦 Maroc (+212)' },
    { dial: '+213', name: '🇩🇿 Algérie (+213)' },
    { dial: '+216', name: '🇹🇳 Tunisie (+216)' },
    { dial: '+20',  name: '🇪🇬 Égypte (+20)' },
    { dial: '+218', name: '🇱🇾 Libye (+218)' },
    // Afrique centrale & australe
    { dial: '+27',  name: '🇿🇦 Afrique du Sud (+27)' },
    { dial: '+243', name: '🇨🇩 RD Congo (+243)' },
    { dial: '+242', name: '🇨🇬 Congo-Brazzaville (+242)' },
    { dial: '+241', name: '🇬🇦 Gabon (+241)' },
    { dial: '+251', name: '🇪🇹 Éthiopie (+251)' },
    { dial: '+254', name: '🇰🇪 Kenya (+254)' },
    { dial: '+255', name: '🇹🇿 Tanzanie (+255)' },
    { dial: '+256', name: '🇺🇬 Ouganda (+256)' },
    { dial: '+260', name: '🇿🇲 Zambie (+260)' },
    { dial: '+263', name: '🇿🇼 Zimbabwe (+263)' },
    { dial: '+225', name: '─────────────────', disabled: true },
    // Europe
    { dial: '+33',  name: '🇫🇷 France (+33)' },
    { dial: '+32',  name: '🇧🇪 Belgique (+32)' },
    { dial: '+41',  name: '🇨🇭 Suisse (+41)' },
    { dial: '+352', name: '🇱🇺 Luxembourg (+352)' },
    { dial: '+44',  name: '🇬🇧 Royaume-Uni (+44)' },
    { dial: '+49',  name: '🇩🇪 Allemagne (+49)' },
    { dial: '+34',  name: '🇪🇸 Espagne (+34)' },
    { dial: '+39',  name: '🇮🇹 Italie (+39)' },
    { dial: '+351', name: '🇵🇹 Portugal (+351)' },
    { dial: '+31',  name: '🇳🇱 Pays-Bas (+31)' },
    { dial: '+46',  name: '🇸🇪 Suède (+46)' },
    { dial: '+47',  name: '🇳🇴 Norvège (+47)' },
    { dial: '+45',  name: '🇩🇰 Danemark (+45)' },
    { dial: '+358', name: '🇫🇮 Finlande (+358)' },
    { dial: '+30',  name: '🇬🇷 Grèce (+30)' },
    { dial: '+48',  name: '🇵🇱 Pologne (+48)' },
    { dial: '+7',   name: '🇷🇺 Russie (+7)' },
    { dial: '+380', name: '🇺🇦 Ukraine (+380)' },
    { dial: '+225', name: '─────────────────', disabled: true },
    // Amériques
    { dial: '+1',   name: '🇺🇸 États-Unis (+1)' },
    { dial: '+1',   name: '🇨🇦 Canada (+1)' },
    { dial: '+55',  name: '🇧🇷 Brésil (+55)' },
    { dial: '+52',  name: '🇲🇽 Mexique (+52)' },
    { dial: '+57',  name: '🇨🇴 Colombie (+57)' },
    { dial: '+54',  name: '🇦🇷 Argentine (+54)' },
    { dial: '+51',  name: '🇵🇪 Pérou (+51)' },
    { dial: '+56',  name: '🇨🇱 Chili (+56)' },
    { dial: '+58',  name: '🇻🇪 Venezuela (+58)' },
    { dial: '+225', name: '─────────────────', disabled: true },
    // Asie & Océanie
    { dial: '+86',  name: '🇨🇳 Chine (+86)' },
    { dial: '+81',  name: '🇯🇵 Japon (+81)' },
    { dial: '+82',  name: '🇰🇷 Corée du Sud (+82)' },
    { dial: '+91',  name: '🇮🇳 Inde (+91)' },
    { dial: '+62',  name: '🇮🇩 Indonésie (+62)' },
    { dial: '+66',  name: '🇹🇭 Thaïlande (+66)' },
    { dial: '+84',  name: '🇻🇳 Vietnam (+84)' },
    { dial: '+60',  name: '🇲🇾 Malaisie (+60)' },
    { dial: '+63',  name: '🇵🇭 Philippines (+63)' },
    { dial: '+65',  name: '🇸🇬 Singapour (+65)' },
    { dial: '+61',  name: '🇦🇺 Australie (+61)' },
    { dial: '+64',  name: '🇳🇿 Nouvelle-Zélande (+64)' },
    { dial: '+225', name: '─────────────────', disabled: true },
    // Moyen-Orient
    { dial: '+971', name: '🇦🇪 Émirats Arabes (+971)' },
    { dial: '+966', name: '🇸🇦 Arabie Saoudite (+966)' },
    { dial: '+974', name: '🇶🇦 Qatar (+974)' },
    { dial: '+965', name: '🇰🇼 Koweït (+965)' },
    { dial: '+973', name: '🇧🇭 Bahreïn (+973)' },
    { dial: '+968', name: '🇴🇲 Oman (+968)' },
    { dial: '+98',  name: '🇮🇷 Iran (+98)' },
    { dial: '+90',  name: '🇹🇷 Turquie (+90)' },
    { dial: '+972', name: '🇮🇱 Israël (+972)' },
    { dial: '+961', name: '🇱🇧 Liban (+961)' },
];

/**
 * Remplir le sélecteur d'indicatif téléphonique
 */
function populateCountryCodes() {
    const select = document.getElementById('registerPhoneCode');
    if (!select) return;
    select.innerHTML = '';
    COUNTRY_CODES.forEach(c => {
        const option = document.createElement('option');
        option.value = c.dial;
        option.textContent = c.name;
        if (c.disabled) {
            option.disabled = true;
            option.style.color = '#ccc';
            option.style.fontSize = '0.6rem';
        }
        // Sélectionner Côte d'Ivoire par défaut
        if (c.name.includes("Côte d'Ivoire")) option.selected = true;
        select.appendChild(option);
    });
}

// ===================================
// OAUTH — Connexion / Inscription sociale  
// ===================================

function loginWithGoogle() {
    window.location.href = `${BACKEND_URL}/api/auth/google`;
}

function loginWithFacebook() {
    window.location.href = `${BACKEND_URL}/api/auth/facebook`;
}

function loginWithApple() {
    window.location.href = `${BACKEND_URL}/api/auth/apple`;
}

/**
 * Afficher/masquer le mot de passe
 */
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.innerHTML = isPassword
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
}

/**
 * Gérer le token OAuth reçu via URL après redirection
 */
function handleOAuthCallback() {
    const params = new URLSearchParams(window.location.search);
    const oauthToken = params.get('oauth_token');
    const oauthUser  = params.get('oauth_user');
    const oauthError = params.get('oauth_error');

    if (oauthError) {
        showNotification(`Connexion sociale: ${decodeURIComponent(oauthError)}`, 'error');
        // Nettoyer l'URL
        history.replaceState({}, '', window.location.pathname);
        return;
    }

    if (oauthToken && oauthUser) {
        try {
            const user = JSON.parse(decodeURIComponent(oauthUser));
            localStorage.setItem('authToken', oauthToken);
            localStorage.setItem('currentUser', JSON.stringify(user));
            authToken = oauthToken;
            currentUser = user;
            showNotification(`Bienvenue, ${user.prenom || user.nom} !`, 'success');
            updateUserUI();
            // Nettoyer l'URL
            history.replaceState({}, '', window.location.pathname);
        } catch (e) {
            showNotification('Erreur lors de la connexion sociale', 'error');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Application Booking.CI chargée');
    
    // Charger les données initiales sur la page d'accueil uniquement
    if (document.getElementById('hotelsGrid') && document.getElementById('restaurantsGrid')) {
        loadHotels();
        loadRestaurants();
    }
    
    // Remplir les indicatifs téléphoniques
    populateCountryCodes();

    // Gérer le retour OAuth
    handleOAuthCallback();

    // Initialiser les événements
    initializeEventListeners();
    
    // Vérifier l'authentification
    checkUserAuthentication();
});

// ===================================
// ÉVÉNEMENTS
// ===================================

/**
 * Initialiser les écouteurs d'événements
 */
function initializeEventListeners() {
    // Button Login
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', openAuthModal);
    }

    // Bloquer l'acces a la page des reservations si non connecte
    const reservationNavLink = document.querySelector('.nav-menu a[href="page1.html"]');
    if (reservationNavLink) {
        reservationNavLink.addEventListener('click', (e) => {
            const isReservationPage = window.location.pathname.toLowerCase().includes('page1.html');
            const isAuthenticated = Boolean(authToken && currentUser);

            if (!isReservationPage && !isAuthenticated) {
                e.preventDefault();
                showNotification('Veuillez vous connecter avant d\'acceder a vos reservations.', 'warning');
                openAuthModal();
            }
        });
    }

    // ---- Menu hamburger ----
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.toggle('open');
            navMenu.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', isOpen);
        });

        // Fermer le menu au clic sur un lien
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navMenu.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // Fermer le menu au clic en dehors
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('open');
                navMenu.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }
    // ---- Fin hamburger ----
    
    // Fermer modal en cliquant sur l'arrière-plan
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target.id === 'authModal') closeAuthModal();
        });
    }
    
    // Tabs d'authentification
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchAuthTab(e.target.dataset.tab);
        });
    });
    
    // Formulaires
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Bouton de recherche
    const searchBtn = document.querySelector('.btn-search');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    // Bouton de réinitialisation
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', handleReset);
    }
}

// ===================================
// AUTHENTIFICATION
// ===================================

/**
 * Ouvrir le modal d'authentification
 */
function openAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.add('active');
    }
}

/**
 * Fermer le modal d'authentification
 */
function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('active');
    }
    resetAuthForms();
}

/**
 * Changer les tabs d'authentification
 */
function switchAuthTab(tabName) {
    // Mettre à jour les boutons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Mettre à jour les formulaires
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active-form');
    });
    if (tabName === 'login') {
        document.getElementById('loginForm').classList.add('active-form');
    } else {
        document.getElementById('registerForm').classList.add('active-form');
    }
}

/**
 * Gérer la connexion
 */
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.token) {
            // Sauvegarder le token
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            authToken = data.token;
            currentUser = data.user;
            
            showNotification('Connexion réussie!', 'success');
            closeAuthModal();
            updateUserUI();
        } else {
            showNotification(data.message || 'Erreur de connexion', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur de connexion. Vérifiez vos identifiants.', 'error');
    }
}

/**
 * Gérer l'inscription
 */
async function handleRegister(e) {
    e.preventDefault();
    
    const prenom    = document.getElementById('registerPrenom')?.value?.trim() || '';
    const nom       = document.getElementById('registerName').value.trim();
    const email     = document.getElementById('registerEmail').value.trim();
    const password  = document.getElementById('registerPassword').value;
    const password2 = document.getElementById('registerPassword2').value;
    const phoneCode = document.getElementById('registerPhoneCode')?.value || '';
    const phoneNum  = document.getElementById('registerPhone')?.value?.trim() || '';
    const telephone = phoneNum ? `${phoneCode}${phoneNum}` : null;
    
    // Validation
    if (password !== password2) {
        showNotification('Les mots de passe ne correspondent pas', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Le mot de passe doit contenir au moins 6 caractères', 'warning');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nom, prenom, email, password, telephone })
        });
        
        const data = await response.json();
        
        if (data.token) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            authToken = data.token;
            currentUser = data.user;
            
            showNotification(`Bienvenue ${data.user.prenom || data.user.nom} ! Inscription réussie.`, 'success');
            closeAuthModal();
            updateUserUI();
        } else {
            showNotification(data.message || 'Erreur lors de l\'inscription', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de l\'inscription', 'error');
    }
}

/**
 * Réinitialiser les formulaires d'authentification
 */
function resetAuthForms() {
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
}

/**
 * Vérifier l'authentification de l'utilisateur
 */
function checkUserAuthentication() {
    verifyToken();
}

/**
 * Vérifier le token JWT
 */
async function verifyToken() {
    try {
        const headers = {};
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const response = await fetch(`${API_URL}/auth/verify`, {
            method: 'GET',
            credentials: 'include',
            headers
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            updateUserUI();
        } else {
            // Token invalide
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            authToken = null;
            currentUser = null;
        }
    } catch (error) {
        console.error('Erreur de vérification:', error);
    }
}

/**
 * Mettre à jour l'UI selon l'état d'authentification
 */
function updateUserUI() {
    const loginBtn = document.getElementById('loginBtn');
    if (!loginBtn) return;

    if (currentUser) {
        loginBtn.innerHTML = `
            <span style="display: inline-flex; align-items: center; gap: 6px;">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style="vertical-align: middle;">
                    <circle cx="10" cy="7" r="4" fill="#2563eb"/>
                    <ellipse cx="10" cy="15.2" rx="6.5" ry="3.2" fill="#2563eb"/>
                </svg>
                <span style="font-weight: 500; color: #2563eb;">${currentUser.nom}</span>
                <span style="font-size: 0.95em; color: #888; margin-left: 8px;">(Déconnexion)</span>
            </span>
        `;
        loginBtn.onclick = logoutUser;
        loadReservations(); // Affiche les réservations après connexion
    } else {
        loginBtn.innerHTML = 'CONNEXION';
        loginBtn.onclick = openAuthModal;
        // Réinitialise la liste si déconnexion
        const reservationsList = document.getElementById('reservationsList');
        if (reservationsList) {
            reservationsList.innerHTML = '<p>Connectez-vous pour voir vos réservations</p>';
        }
    }
}

/**
 * Déconnecter l'utilisateur
 */
function logoutUser() {
    fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
    }).catch(() => {});

    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    authToken = null;
    currentUser = null;
    showNotification('Déconnecté avec succès', 'success');
    updateUserUI();
}

// ===================================
// GESTION DES HÔTELS
// ===================================

/**
 * Charger et afficher les hôtels
 */
async function loadHotels() {
    try {
        const hotels = await fetchHotels();
        displayHotels(hotels);
    } catch (error) {
        console.error('Erreur lors du chargement des hôtels:', error);
        showNotification('Erreur lors du chargement des hôtels', 'error');
    }
}

/**
 * Afficher les hôtels
 */
function displayHotels(hotels) {
    const grid = document.getElementById('hotelsGrid');
    grid.innerHTML = '';
    
    hotels.forEach(hotel => {
        const card = createCard(hotel, 'hotel');
        grid.appendChild(card);
    });
}

// ===================================
// GESTION DES RESTAURANTS
// ===================================

/**
 * Charger et afficher les restaurants
 */
async function loadRestaurants() {
    try {
        const restaurants = await fetchRestaurants();
        displayRestaurants(restaurants);
    } catch (error) {
        console.error('Erreur lors du chargement des restaurants:', error);
        showNotification('Erreur lors du chargement des restaurants', 'error');
    }
}

/**
 * Afficher les restaurants
 */
function displayRestaurants(restaurants) {
    const grid = document.getElementById('restaurantsGrid');
    grid.innerHTML = '';
    
    restaurants.forEach(restaurant => {
        const card = createCard(restaurant, 'restaurant');
        grid.appendChild(card);
    });
}

// ===================================
// CRÉATION DE CARTES
// ===================================

/**
 * Créer une carte (hôtel ou restaurant)
 */
function createCard(item, type) {
    const card = document.createElement('div');
    card.className = 'card';
    
    const badgeText = type === 'hotel' ? `★ ${item.note}` : `★ ${item.note}`;
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${item.image}" alt="${item.nom}" onerror="this.src='https://via.placeholder.com/600x400?text=Image+indisponible'" />
        </div>
        <div class="card-badge">${badgeText}</div>
        <div class="card-content">
            <h3 class="card-title">${item.nom}</h3>
            <p class="card-location">📍 ${item.ville}</p>
            <div class="card-rating">${item.avis} avis</div>
            <div class="card-price">
                ${formatPrice(item.prix)} FCFA
                <span class="card-price-label">/ ${type === 'hotel' ? 'nuit' : 'personne'}</span>
            </div>
            <p class="card-description">${item.description}</p>
            <div class="card-actions">
                <button class="btn-reserve" onclick="handleReservation(${item.id}, '${type}')">
                    Réserver
                </button>
                <button class="btn-details" onclick="showDetails(${item.id}, '${type}')">
                    Détails
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// ===================================
// RÉSERVATIONS
// ===================================

let reservationWizardState = {
    step: 1,
    item: null,
    type: null,
    checkIn: '',
    checkOut: '',
    guests: 1,
    country: 'Côte d\'Ivoire',
    region: '',
    phone: '',
    specialRequests: '',
    arrivalWindow: '',
    paymentMethod: 'online',
    acceptTerms: false,
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    billingEmail: '',
    billingAddress: ''
};

const PHONE_RULES_BY_COUNTRY = {
    "Côte d'Ivoire": { digits: 10, example: '0701020304' },
    Ghana: { digits: 9, example: '201234567' },
    Sénégal: { digits: 9, example: '701234567' },
    Mali: { digits: 8, example: '65123456' },
    France: { digits: 10, example: '0612345678' }
};

function getPhoneRuleForCountry(country) {
    return PHONE_RULES_BY_COUNTRY[country] || { min: 6, max: 15, example: '0123456789' };
}

function updateWizardPhoneRule() {
    const countryEl = document.getElementById('wizardCountry');
    const phoneEl = document.getElementById('wizardPhone');
    const hintEl = document.getElementById('wizardPhoneHint');
    if (!countryEl || !phoneEl || !hintEl) return;

    const rule = getPhoneRuleForCountry(countryEl.value);
    const isExactRule = typeof rule.digits === 'number';

    if (isExactRule) {
        phoneEl.maxLength = rule.digits;
        phoneEl.placeholder = rule.example;
        hintEl.textContent = `Format attendu: ${rule.digits} chiffres pour ${countryEl.value}.`;
    } else {
        phoneEl.maxLength = rule.max;
        phoneEl.placeholder = rule.example;
        hintEl.textContent = `Format attendu: entre ${rule.min} et ${rule.max} chiffres selon le pays.`;
    }
}

function handleWizardPhoneInput(input) {
    const countryEl = document.getElementById('wizardCountry');
    const rule = getPhoneRuleForCountry(countryEl ? countryEl.value : "Côte d'Ivoire");
    const digitsOnly = (input.value || '').replace(/\D/g, '');
    const maxDigits = typeof rule.digits === 'number' ? rule.digits : rule.max;
    input.value = digitsOnly.slice(0, maxDigits);
}

function isValidPhoneForCountry(phone, country) {
    const digits = (phone || '').replace(/\D/g, '');
    if (!digits) return true;

    const rule = getPhoneRuleForCountry(country);
    if (typeof rule.digits === 'number') {
        return digits.length === rule.digits;
    }

    return digits.length >= rule.min && digits.length <= rule.max;
}

function ensureReservationWizardModal() {
    let modal = document.getElementById('reservationWizardModal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'reservationWizardModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content reservation-wizard-content">
            <button class="modal-close-btn" onclick="closeReservationWizard()" aria-label="Fermer">&times;</button>
            <div class="reservation-wizard-header">
                <h2>Finaliser votre réservation</h2>
                <p>Suivez les étapes pour confirmer votre choix en toute sécurité.</p>
            </div>
            <div class="wizard-steps" id="wizardSteps"></div>
            <div id="reservationWizardBody"></div>
        </div>
    `;

    modal.addEventListener('click', (e) => {
        if (e.target.id === 'reservationWizardModal') {
            closeReservationWizard();
        }
    });

    document.body.appendChild(modal);
    return modal;
}

function getItemFromSources(itemId, type) {
    const source = type === 'hotel' ? sampleHotels : sampleRestaurants;
    return source.find((item) => item.id === Number(itemId)) || null;
}

function getTypeLabel(type) {
    return type === 'hotel' ? 'Hôtel' : 'Restaurant';
}

function renderWizardSteps() {
    const el = document.getElementById('wizardSteps');
    if (!el) return;

    const steps = [
        { key: 1, title: 'Sélection' },
        { key: 2, title: 'Informations' },
        { key: 3, title: 'Finalisation' }
    ];

    el.innerHTML = steps.map((step) => {
        const stateClass = reservationWizardState.step === step.key
            ? 'active'
            : reservationWizardState.step > step.key
                ? 'done'
                : '';

        return `
            <div class="wizard-step ${stateClass}">
                <span class="wizard-step-index">${step.key}</span>
                <span class="wizard-step-title">${step.title}</span>
            </div>
        `;
    }).join('');
}

function renderReservationWizard() {
    const body = document.getElementById('reservationWizardBody');
    if (!body || !reservationWizardState.item) return;

    const item = reservationWizardState.item;
    const typeLabel = getTypeLabel(reservationWizardState.type);
    const unitLabel = reservationWizardState.type === 'hotel' ? '/ nuit' : '/ personne';

    renderWizardSteps();

    if (reservationWizardState.step === 1) {
        body.innerHTML = `
            <div class="wizard-panel">
                <h3>Vérifiez votre sélection</h3>
                <div class="wizard-choice-card">
                    <img src="${item.image}" alt="${item.nom}" />
                    <div>
                        <p class="wizard-choice-type">${typeLabel}</p>
                        <h4>${item.nom}</h4>
                        <p>${item.ville}, Côte d'Ivoire</p>
                        <p class="wizard-choice-price">${formatPrice(item.prix)} FCFA <span>${unitLabel}</span></p>
                    </div>
                </div>

                <div class="wizard-grid">
                    <div class="form-group">
                        <label for="wizardCheckIn">Date d'arrivée</label>
                        <input type="date" id="wizardCheckIn" value="${reservationWizardState.checkIn}" />
                    </div>
                    <div class="form-group">
                        <label for="wizardCheckOut">Date de départ</label>
                        <input type="date" id="wizardCheckOut" value="${reservationWizardState.checkOut}" />
                    </div>
                    <div class="form-group">
                        <label for="wizardGuests">Nombre de personnes</label>
                        <input type="number" id="wizardGuests" min="1" max="20" value="${reservationWizardState.guests}" />
                    </div>
                </div>

                <div class="wizard-actions">
                    <button class="btn-close" type="button" onclick="closeReservationWizard()">Annuler</button>
                    <button class="btn-reserve-large" type="button" onclick="nextReservationStep()">Continuer</button>
                </div>
            </div>
        `;
        return;
    }

    if (reservationWizardState.step === 2) {
        body.innerHTML = `
            <div class="wizard-panel">
                <h3>Complétez vos informations</h3>
                <div class="wizard-grid">
                    <div class="form-group">
                        <label for="wizardCountry">Pays</label>
                        <select id="wizardCountry" onchange="updateWizardPhoneRule()">
                            <option value="Côte d'Ivoire" ${reservationWizardState.country === "Côte d'Ivoire" ? 'selected' : ''}>Côte d'Ivoire</option>
                            <option value="Ghana" ${reservationWizardState.country === 'Ghana' ? 'selected' : ''}>Ghana</option>
                            <option value="Sénégal" ${reservationWizardState.country === 'Sénégal' ? 'selected' : ''}>Sénégal</option>
                            <option value="Mali" ${reservationWizardState.country === 'Mali' ? 'selected' : ''}>Mali</option>
                            <option value="France" ${reservationWizardState.country === 'France' ? 'selected' : ''}>France</option>
                            <option value="Autre" ${reservationWizardState.country === 'Autre' ? 'selected' : ''}>Autre</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="wizardRegion">Région / Ville</label>
                        <input type="text" id="wizardRegion" placeholder="Ex: Abidjan, Cocody" value="${reservationWizardState.region || ''}" />
                    </div>

                    <div class="form-group">
                        <label for="wizardPhone">Téléphone (facultatif)</label>
                        <input type="tel" id="wizardPhone" placeholder="0701020304" value="${reservationWizardState.phone || ''}" inputmode="numeric" oninput="handleWizardPhoneInput(this)" />
                        <p class="phone-rule-hint" id="wizardPhoneHint"></p>
                    </div>

                    <div class="form-group">
                        <label for="wizardArrivalWindow">Heure d'arrivée estimée (facultatif)</label>
                        <select id="wizardArrivalWindow">
                            <option value="" ${reservationWizardState.arrivalWindow === '' ? 'selected' : ''}>Je ne sais pas encore</option>
                            <option value="Matin (08h-12h)" ${reservationWizardState.arrivalWindow === 'Matin (08h-12h)' ? 'selected' : ''}>Matin (08h-12h)</option>
                            <option value="Après-midi (12h-17h)" ${reservationWizardState.arrivalWindow === 'Après-midi (12h-17h)' ? 'selected' : ''}>Après-midi (12h-17h)</option>
                            <option value="Soir (17h-22h)" ${reservationWizardState.arrivalWindow === 'Soir (17h-22h)' ? 'selected' : ''}>Soir (17h-22h)</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="wizardSpecialRequests">Demandes particulières (facultatif)</label>
                    <textarea id="wizardSpecialRequests" rows="3" placeholder="Ex: chambre calme, table en terrasse, allergies...">${reservationWizardState.specialRequests || ''}</textarea>
                </div>

                <div class="wizard-actions">
                    <button class="btn-close" type="button" onclick="prevReservationStep()">Retour</button>
                    <button class="btn-reserve-large" type="button" onclick="nextReservationStep()">Continuer</button>
                </div>
            </div>
        `;
        updateWizardPhoneRule();
        return;
    }

    const onlineChecked = reservationWizardState.paymentMethod === 'online' ? 'checked' : '';
    const onsiteChecked = reservationWizardState.paymentMethod === 'onsite' ? 'checked' : '';
    const termsChecked = reservationWizardState.acceptTerms ? 'checked' : '';

    body.innerHTML = `
        <div class="wizard-panel">
            <h3>Finalisez et choisissez le paiement</h3>

            <div class="wizard-summary">
                <p><strong>Établissement:</strong> ${item.nom} (${typeLabel})</p>
                <p><strong>Dates:</strong> ${reservationWizardState.checkIn} au ${reservationWizardState.checkOut}</p>
                <p><strong>Personnes:</strong> ${reservationWizardState.guests}</p>
                <p><strong>Localisation client:</strong> ${reservationWizardState.country} - ${reservationWizardState.region}</p>
            </div>

            <div class="payment-methods">
                <label class="payment-option">
                    <input type="radio" name="wizardPayment" value="online" ${onlineChecked} onchange="setReservationPaymentMethod('online')" />
                    <div>
                        <strong>Payer en ligne</strong>
                        <p>Carte bancaire, mobile money ou wallet sécurisé.</p>
                    </div>
                </label>
                <label class="payment-option">
                    <input type="radio" name="wizardPayment" value="onsite" ${onsiteChecked} onchange="setReservationPaymentMethod('onsite')" />
                    <div>
                        <strong>Payer sur place</strong>
                        <p>Vous payerez directement à l'établissement à votre arrivée.</p>
                    </div>
                </label>
            </div>

            <div id="onlinePaymentFields" class="online-payment-form ${reservationWizardState.paymentMethod === 'online' ? '' : 'hidden'}">
                <h4>Informations de paiement sécurisé</h4>
                <div class="wizard-grid">
                    <div class="form-group">
                        <label for="wizardCardName">Nom sur la carte</label>
                        <input type="text" id="wizardCardName" placeholder="Jean Kouassi" value="${reservationWizardState.cardName || ''}" autocomplete="cc-name" />
                    </div>
                    <div class="form-group">
                        <label for="wizardBillingEmail">Email de facturation</label>
                        <input type="email" id="wizardBillingEmail" placeholder="client@email.com" value="${reservationWizardState.billingEmail || ''}" autocomplete="email" />
                    </div>
                    <div class="form-group">
                        <label for="wizardCardNumber">Numéro de carte</label>
                        <div class="card-number-field">
                            <input type="text" id="wizardCardNumber" placeholder="4242 4242 4242 4242" value="${reservationWizardState.cardNumber || ''}" inputmode="numeric" autocomplete="cc-number" maxlength="19" oninput="handleCardNumberInput(this)" />
                            <span class="card-brand-badge" id="wizardCardBrandBadge">Carte</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="wizardCardExpiry">Date d'expiration (MM/AA)</label>
                        <input type="text" id="wizardCardExpiry" placeholder="08/28" value="${reservationWizardState.cardExpiry || ''}" inputmode="numeric" autocomplete="cc-exp" />
                    </div>
                    <div class="form-group">
                        <label for="wizardCardCvv">CVV</label>
                        <input type="password" id="wizardCardCvv" placeholder="123" value="${reservationWizardState.cardCvv || ''}" inputmode="numeric" autocomplete="cc-csc" />
                    </div>
                    <div class="form-group">
                        <label for="wizardBillingAddress">Adresse de facturation</label>
                        <input type="text" id="wizardBillingAddress" placeholder="Commune, rue, lot" value="${reservationWizardState.billingAddress || ''}" autocomplete="street-address" />
                    </div>
                </div>
                <p class="payment-security-note">Paiement chiffré TLS. Vos données de carte sont traitées de manière sécurisée.</p>
            </div>

            <label class="terms-check">
                <input type="checkbox" id="wizardTerms" ${termsChecked} />
                <span>Je confirme mes informations et j'accepte les conditions de réservation.</span>
            </label>

            <div class="wizard-actions">
                <button class="btn-close" type="button" onclick="prevReservationStep()">Retour</button>
                <button class="btn-reserve-large" type="button" onclick="submitReservationWizard()">Confirmer la réservation</button>
            </div>
        </div>
    `;
}

function setReservationPaymentMethod(method) {
    reservationWizardState.paymentMethod = method;
    const paymentForm = document.getElementById('onlinePaymentFields');
    if (paymentForm) {
        paymentForm.classList.toggle('hidden', method !== 'online');
    }
}

function detectCardBrand(cardNumber) {
    const digits = (cardNumber || '').replace(/\D/g, '');
    if (!digits) return 'unknown';

    if (/^4/.test(digits)) {
        return 'visa';
    }

    if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) {
        return 'mastercard';
    }

    return 'unknown';
}

function updateCardBrandBadge(cardNumber) {
    const badge = document.getElementById('wizardCardBrandBadge');
    if (!badge) return;

    const brand = detectCardBrand(cardNumber);
    badge.classList.remove('visa', 'mastercard', 'unknown');
    badge.classList.add(brand);

    if (brand === 'visa') {
        badge.textContent = 'VISA';
        return;
    }

    if (brand === 'mastercard') {
        badge.textContent = 'MASTERCARD';
        return;
    }

    badge.textContent = 'Carte';
}

function handleCardNumberInput(input) {
    const digits = (input.value || '').replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
    input.value = formatted;
    updateCardBrandBadge(digits);
}

function openReservationWizard() {
    ensureReservationWizardModal();
    renderReservationWizard();
    updateCardBrandBadge(reservationWizardState.cardNumber || '');
    const modal = document.getElementById('reservationWizardModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeReservationWizard() {
    const modal = document.getElementById('reservationWizardModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function validateStepOne() {
    const checkInEl = document.getElementById('wizardCheckIn');
    const checkOutEl = document.getElementById('wizardCheckOut');
    const guestsEl = document.getElementById('wizardGuests');

    const checkIn = checkInEl ? checkInEl.value : '';
    const checkOut = checkOutEl ? checkOutEl.value : '';
    const guests = guestsEl ? Number(guestsEl.value) : 1;

    if (!checkIn || !checkOut) {
        showNotification('Veuillez renseigner vos dates de réservation.', 'warning');
        return false;
    }

    if (new Date(checkOut) < new Date(checkIn)) {
        showNotification('La date de départ doit être postérieure à la date d\'arrivée.', 'warning');
        return false;
    }

    if (!guests || guests < 1) {
        showNotification('Le nombre de personnes doit être supérieur à 0.', 'warning');
        return false;
    }

    reservationWizardState.checkIn = checkIn;
    reservationWizardState.checkOut = checkOut;
    reservationWizardState.guests = guests;
    return true;
}

function validateStepTwo() {
    const countryEl = document.getElementById('wizardCountry');
    const regionEl = document.getElementById('wizardRegion');
    const phoneEl = document.getElementById('wizardPhone');
    const arrivalEl = document.getElementById('wizardArrivalWindow');
    const specialEl = document.getElementById('wizardSpecialRequests');

    const country = countryEl ? countryEl.value.trim() : '';
    const region = regionEl ? regionEl.value.trim() : '';
    const phone = phoneEl ? phoneEl.value.trim() : '';

    if (!country || !region) {
        showNotification('Veuillez renseigner au minimum votre pays et votre région/ville.', 'warning');
        return false;
    }

    if (!isValidPhoneForCountry(phone, country)) {
        const rule = getPhoneRuleForCountry(country);
        if (typeof rule.digits === 'number') {
            showNotification(`Numéro invalide: ${country} exige exactement ${rule.digits} chiffres.`, 'warning');
        } else {
            showNotification(`Numéro invalide: utilisez entre ${rule.min} et ${rule.max} chiffres.`, 'warning');
        }
        return false;
    }

    reservationWizardState.country = country;
    reservationWizardState.region = region;
    reservationWizardState.phone = phone;
    reservationWizardState.arrivalWindow = arrivalEl ? arrivalEl.value : '';
    reservationWizardState.specialRequests = specialEl ? specialEl.value.trim() : '';
    return true;
}

function nextReservationStep() {
    if (reservationWizardState.step === 1 && !validateStepOne()) return;
    if (reservationWizardState.step === 2 && !validateStepTwo()) return;

    reservationWizardState.step = Math.min(3, reservationWizardState.step + 1);
    renderReservationWizard();
}

function prevReservationStep() {
    reservationWizardState.step = Math.max(1, reservationWizardState.step - 1);
    renderReservationWizard();
}

function isValidLuhn(cardNumber) {
    const digits = cardNumber.replace(/\D/g, '');
    let sum = 0;
    let shouldDouble = false;

    for (let i = digits.length - 1; i >= 0; i -= 1) {
        let digit = Number(digits.charAt(i));
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return digits.length >= 13 && digits.length <= 19 && sum % 10 === 0;
}

function isValidCardBrandAndLength(cardNumber) {
    const digits = cardNumber.replace(/\D/g, '');
    const hasValidLength = digits.length === 16;
    const brand = detectCardBrand(digits);
    const isSupportedBrand = brand === 'visa' || brand === 'mastercard';

    if (!hasValidLength || !isSupportedBrand) {
        return false;
    }

    return isValidLuhn(digits);
}

function isValidCardExpiry(expiry) {
    const match = expiry.trim().match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
    if (!match) return false;

    const month = Number(match[1]);
    const year = Number(`20${match[2]}`);
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    return true;
}

function validateOnlinePaymentForm() {
    const cardName = (document.getElementById('wizardCardName')?.value || '').trim();
    const billingEmail = (document.getElementById('wizardBillingEmail')?.value || '').trim();
    const cardNumber = (document.getElementById('wizardCardNumber')?.value || '').trim();
    const cardExpiry = (document.getElementById('wizardCardExpiry')?.value || '').trim();
    const cardCvv = (document.getElementById('wizardCardCvv')?.value || '').trim();
    const billingAddress = (document.getElementById('wizardBillingAddress')?.value || '').trim();

    if (cardName.length < 3) {
        showNotification('Veuillez saisir le nom figurant sur la carte.', 'warning');
        return false;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingEmail);
    if (!emailOk) {
        showNotification('Veuillez saisir un email de facturation valide.', 'warning');
        return false;
    }

    const cardDigits = cardNumber.replace(/\D/g, '');
    if (cardDigits.length !== 16) {
        showNotification('Le numéro de carte doit contenir exactement 16 chiffres.', 'warning');
        return false;
    }

    if (!isValidCardBrandAndLength(cardNumber)) {
        showNotification('Carte invalide. Seules les cartes Visa ou Mastercard (16 chiffres) sont acceptées.', 'warning');
        return false;
    }

    if (!isValidCardExpiry(cardExpiry)) {
        showNotification('Date d\'expiration invalide. Format attendu: MM/AA.', 'warning');
        return false;
    }

    if (!/^\d{3}$/.test(cardCvv)) {
        showNotification('CVV invalide.', 'warning');
        return false;
    }

    if (billingAddress.length < 6) {
        showNotification('Veuillez saisir une adresse de facturation valide.', 'warning');
        return false;
    }

    reservationWizardState.cardName = cardName;
    reservationWizardState.billingEmail = billingEmail;
    reservationWizardState.cardNumber = cardDigits.replace(/(.{4})/g, '$1 ').trim();
    reservationWizardState.cardExpiry = cardExpiry;
    reservationWizardState.cardCvv = cardCvv;
    reservationWizardState.billingAddress = billingAddress;
    return true;
}

async function processOnlinePayment() {
    // Placeholder de traitement en attendant l'integration d'une passerelle (Stripe, CinetPay, etc.)
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return {
        success: true,
        transactionId: `TX-${Date.now()}`
    };
}

async function submitReservationWizard() {
    const paymentEl = document.querySelector('input[name="wizardPayment"]:checked');
    const termsEl = document.getElementById('wizardTerms');

    reservationWizardState.paymentMethod = paymentEl ? paymentEl.value : 'online';
    reservationWizardState.acceptTerms = termsEl ? Boolean(termsEl.checked) : false;

    if (!reservationWizardState.acceptTerms) {
        showNotification('Veuillez accepter les conditions pour finaliser votre réservation.', 'warning');
        return;
    }

    if (reservationWizardState.paymentMethod === 'online') {
        const valid = validateOnlinePaymentForm();
        if (!valid) return;

        showNotification('Traitement du paiement en ligne en cours...', 'info');
        const paymentResult = await processOnlinePayment();
        if (!paymentResult.success) {
            showNotification('Le paiement en ligne a échoué. Veuillez réessayer.', 'error');
            return;
        }
    }

    const status = reservationWizardState.paymentMethod === 'onsite' ? 'en attente' : 'confirmée';

    try {
        const response = await fetch(`${API_URL}/reservations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                user_id: currentUser.id,
                type: reservationWizardState.type,
                item_id: reservationWizardState.item.id,
                date_debut: reservationWizardState.checkIn,
                date_fin: reservationWizardState.checkOut,
                nombre_personnes: reservationWizardState.guests,
                statut: status
            })
        });

        const data = await response.json();

        if (data.id || (data.data && data.data.id)) {
            closeReservationWizard();
            const paymentMessage = reservationWizardState.paymentMethod === 'online'
                ? 'Paiement en ligne sélectionné.'
                : 'Paiement sur place sélectionné.';
            showNotification(`Réservation enregistrée avec succès. ${paymentMessage}`, 'success');
            loadReservations();
            return;
        }

        showNotification(data.message || 'Erreur lors de la réservation', 'error');
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de la réservation', 'error');
    }
}

/**
 * Gérer la réservation
 */
async function handleReservation(itemId, type) {
    if (!currentUser) {
        showNotification('Veuillez vous connecter pour réserver', 'warning');
        openAuthModal();
        return;
    }

    // Récupérer les dates du formulaire de recherche si déjà remplies (optionnel)
    const checkInEl = document.getElementById('checkIn');
    const checkOutEl = document.getElementById('checkOut');
    const guestsEl = document.getElementById('guests');
    const checkIn = checkInEl ? checkInEl.value : '';
    const checkOut = checkOutEl ? checkOutEl.value : '';
    const guests = guestsEl ? guestsEl.value : '1';

    // Chercher d'abord dans les données locales, puis dans les données API
    let item = getItemFromSources(itemId, type);
    if (!item) {
        // Fallback : chercher dans toutes les données disponibles
        try {
            const endpoint = type === 'hotel' ? `/hotels/${itemId}` : `/restaurants/${itemId}`;
            const resp = await apiRequest(endpoint);
            item = resp.data;
        } catch (_) { /* ignoré */ }
    }
    if (!item) {
        showNotification('Établissement introuvable pour cette réservation.', 'error');
        return;
    }

    reservationWizardState = {
        step: 1,
        item,
        type,
        checkIn,
        checkOut,
        guests: Number(guests) || 1,
        country: 'Côte d\'Ivoire',
        region: '',
        phone: currentUser?.telephone || '',
        specialRequests: '',
        arrivalWindow: '',
        paymentMethod: 'online',
        acceptTerms: false,
        cardName: currentUser?.nom || '',
        cardNumber: '',
        cardExpiry: '',
        cardCvv: '',
        billingEmail: currentUser?.email || '',
        billingAddress: ''
    };

    if (typeof closeDetailsModal === 'function') {
        closeDetailsModal();
    }

    openReservationWizard();
}

/**
 * Charger et afficher les réservations de l'utilisateur
 */
async function loadReservations() {
    const container = document.getElementById('reservationsList');
    if (!currentUser || !container) return;
    
    try {
        const response = await fetch(`${API_URL}/reservations/user/${currentUser.id}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        displayReservations(data.data || []);
    } catch (error) {
        console.error('Erreur:', error);
    }
}

/**
 * Afficher les réservations
 */
function displayReservations(reservations) {
    const container = document.getElementById('reservationsList');
    if (!container) {
        return;
    }
    
    if (reservations.length === 0) {
        container.innerHTML = '<p>Aucune réservation pour le moment</p>';
        return;
    }
    
    container.innerHTML = reservations.map(res => `
        <div class="reservation-item">
            <h3>${res.type === 'hotel' ? '🏨 Hôtel' : '🍽️ Restaurant'}</h3>
            <p>Date: ${res.date_debut} à ${res.date_fin}</p>
            <p>Statut: <strong>${res.statut}</strong></p>
            <button onclick="cancelReservation(${res.id})">Annuler</button>
        </div>
    `).join('');
}

// ===================================
// AVIS CLIENTS
// ===================================

/**
 * Générer les avis clients (maximum 20)
 */
function generateReviews(totalReviews, isHotel) {
    const maxReviews = Math.min(totalReviews, 20);
    const reviewTemplates = isHotel ? [
        { author: "Marie K.", rating: 5, text: "Excellent séjour, personnel très accueillant et chambres confortables. Magnifique expérience." },
        { author: "Jean P.", rating: 4, text: "Très bon rapport qualité-prix. Emplacement idéal. Je reviendrai." },
        { author: "Sophie M.", rating: 5, text: "Service impeccable, chambres spacieuses et propres. Hôtel de grande qualité." },
        { author: "Pierre L.", rating: 4, text: "Belle piscine et restaurant excellent. Petit-déjeuner copieux et varié." },
        { author: "Anne C.", rating: 5, text: "Personnel attentionné, chambres modernes. Séjour parfait pour affaires." },
        { author: "Michel D.", rating: 4, text: "Emplacement central, WiFi rapide. Conciergerie très utile." },
        { author: "Claire B.", rating: 5, text: "Spa relaxant, fitness bien équipé. Hôtel haut de gamme." },
        { author: "Thomas R.", rating: 4, text: "Chambres confortables, parking sécurisé. Bon accueil familial." },
        { author: "Isabelle F.", rating: 5, text: "Vue magnifique depuis la chambre. Service de chambre excellent." },
        { author: "Nicolas G.", rating: 4, text: "Salle de réunion moderne, petit-déjeuner buffet. Idéal pour séminaires." },
        { author: "Valérie T.", rating: 5, text: "Jardin tropical superbe, piscine chauffée. Séjour romantique réussi." },
        { author: "François H.", rating: 4, text: "Propreté irréprochable, literie de qualité. Très bonne nuit de sommeil." },
        { author: "Marie-Pierre S.", rating: 5, text: "Restaurant gastronomique, carte des vins exceptionnelle. Dîner mémorable." },
        { author: "Antoine L.", rating: 4, text: "Centre d'affaires complet, connexion internet rapide. Parfait pour le travail." },
        { author: "Catherine M.", rating: 5, text: "Service de chambre 24h/24, personnel multilingue. Hôtel international." },
        { author: "Philippe D.", rating: 4, text: "Terrasse panoramique, bar lounge agréable. Ambiance relaxante." },
        { author: "Émilie R.", rating: 5, text: "Suites familiales spacieuses, club enfants. Idéal avec les petits." },
        { author: "Laurent K.", rating: 4, text: "Salle de sport ouverte 24h/24, équipements modernes. Bon séjour sportif." },
        { author: "Nathalie P.", rating: 5, text: "Spa ayurvédique, massages traditionnels. Détente totale garantie." },
        { author: "David W.", rating: 4, text: "Business center complet, salles de réunion. Hôtel d'affaires performant." }
    ] : [
        { author: "Marie K.", rating: 5, text: "Cuisine exceptionnelle, service impeccable. À recommander ! Magnifique expérience." },
        { author: "Jean P.", rating: 4, text: "Ambiance conviviale et plats savoureux. Service rapide. Je reviendrai." },
        { author: "Sophie M.", rating: 5, text: "Chef talentueux, ingrédients frais locaux. Restaurant de qualité supérieure." },
        { author: "Pierre L.", rating: 4, text: "Carte variée, vins bien sélectionnés. Bon rapport qualité-prix." },
        { author: "Anne C.", rating: 5, text: "Service attentionné, cadre romantique. Dîner parfait en couple." },
        { author: "Michel D.", rating: 4, text: "Terrasse agréable, musique d'ambiance. Soirée réussie." },
        { author: "Claire B.", rating: 5, text: "Spécialités locales authentiques, saveurs exceptionnelles. Découverte culinaire." },
        { author: "Thomas R.", rating: 4, text: "Personnel souriant, plats copieux. Bonne adresse familiale." },
        { author: "Isabelle F.", rating: 5, text: "Desserts maison divins, café excellent. Fin de repas parfaite." },
        { author: "Nicolas G.", rating: 4, text: "Ambiance musicale africaine, danse traditionnelle. Expérience culturelle." },
        { author: "Valérie T.", rating: 5, text: "Cocktails créatifs, barman talentueux. Apéritif réussi." },
        { author: "François H.", rating: 4, text: "Parking facile, accès handicapé. Restaurant accessible à tous." },
        { author: "Marie-Pierre S.", rating: 5, text: "Menu dégustation surprenant, accords mets-vins parfaits. Expérience gastronomique." },
        { author: "Antoine L.", rating: 4, text: "Réservation facile, horaires flexibles. Service clientèle réactif." },
        { author: "Catherine M.", rating: 5, text: "Décor ethnique authentique, ambiance chaleureuse. Voyage culinaire réussi." },
        { author: "Philippe D.", rating: 4, text: "WiFi gratuit rapide, musique douce. Cadre propice aux discussions." },
        { author: "Émilie R.", rating: 5, text: "Plats végétariens créatifs, options sans gluten. Cuisine inclusive." },
        { author: "Laurent K.", rating: 4, text: "Terrasse climatisée, vue sur jardin. Dîner estival agréable." },
        { author: "Nathalie P.", rating: 5, text: "Service en salle professionnel, sommellerie experte. Établissement de qualité." },
        { author: "David W.", rating: 4, text: "Prix raisonnables, portions généreuses. Bonne adresse du quartier." }
    ];

    let reviewsHtml = '';
    for (let i = 0; i < maxReviews; i++) {
        const review = reviewTemplates[i % reviewTemplates.length];
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

        reviewsHtml += `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-author">${review.author}</span>
                    <span class="review-rating">${stars}</span>
                </div>
                <p class="review-text">"${review.text}"</p>
            </div>
        `;
    }

    return reviewsHtml;
}

/**
 * Afficher les détails
 */
async function showDetails(itemId, type) {
    try {
        // Ouvrir la modal IMMÉDIATEMENT pour que l'utilisateur voie une réaction
        const detailsContent = document.getElementById('detailsContent');
        detailsContent.innerHTML = '<div style="text-align:center;padding:60px 20px;font-size:1.1rem;color:#555">⏳ Chargement...</div>';
        document.getElementById('detailsModal').classList.add('active');

        // Chercher d'abord dans les données locales (instantané)
        const sampleData = type === 'hotel' ? sampleHotels : sampleRestaurants;
        let item = sampleData.find(i => i.id === parseInt(itemId));

        // Essayer l'API pour des données à jour
        try {
            const endpoint = type === 'hotel' ? `/hotels/${itemId}` : `/restaurants/${itemId}`;
            const response = await apiRequest(endpoint);
            if (response.data) item = response.data;
        } catch (apiError) {
            // On garde les données locales déjà trouvées
        }

        if (!item) {
            detailsContent.innerHTML = '<div style="text-align:center;padding:60px;color:#e53e3e">Établissement non trouvé.</div>';
            return;
        }

        const isHotel = type === 'hotel';
        // Créer le contenu détaillé
        const _detailsContent = detailsContent;

        _detailsContent.innerHTML = `
        <div class="details-header">
            <div class="details-image">
                <img src="${item.image}" alt="${item.nom}" onerror="this.src='https://via.placeholder.com/600x400?text=Image+indisponible'" />
            </div>
            <div class="details-summary">
                <h2>${item.nom}</h2>
                <div class="details-rating">
                    <span class="rating-stars">${'★'.repeat(Math.floor(item.note))}</span>
                    <span class="rating-score">${item.note}</span>
                    <span class="rating-reviews">(${item.avis} avis)</span>
                </div>
                <div class="details-location">
                    ${item.ville}, Côte d'Ivoire
                </div>
                <div class="details-price">
                    <span class="price-amount">${formatPrice(item.prix)} FCFA</span>
                    <span class="price-label">par ${isHotel ? 'nuit' : 'personne'}</span>
                </div>
            </div>
        </div>

        <div class="details-body">
            <div class="details-section">
                <h3>Description</h3>
                <p>${item.description}</p>
            </div>

            <div class="details-section">
                <h3>${isHotel ? 'Équipements & Services' : 'Spécialités & Services'}</h3>
                <div class="details-features">
                    ${isHotel ? `
                        <div class="feature-item">✓ Piscine extérieure</div>
                        <div class="feature-item">✓ Salle de fitness</div>
                        <div class="feature-item">✓ Restaurant sur place</div>
                        <div class="feature-item">✓ Parking sécurisé gratuit</div>
                        <div class="feature-item">✓ Connexion WiFi haut débit</div>
                        <div class="feature-item">✓ Service de conciergerie</div>
                        <div class="feature-item">✓ Service de chambre 24h/24</div>
                        <div class="feature-item">✓ Centre d'affaires</div>
                    ` : `
                        <div class="feature-item">✓ Cuisine locale authentique</div>
                        <div class="feature-item">✓ Sélection de vins et boissons</div>
                        <div class="feature-item">✓ Animation musicale</div>
                        <div class="feature-item">✓ Chef expérimenté</div>
                        <div class="feature-item">✓ Parking gratuit</div>
                        <div class="feature-item">✓ Connexion WiFi gratuite</div>
                        <div class="feature-item">✓ Espace adapté aux familles</div>
                        <div class="feature-item">✓ Organisation d'événements</div>
                    `}
                </div>
            </div>

            <div class="details-section">
                <h3>Informations Pratiques</h3>
                <div class="details-info">
                    <div class="info-item">
                        <strong>Horaires :</strong>
                        <span>${isHotel ? '24h/24' : '11h00 - 23h00'}</span>
                    </div>
                    <div class="info-item">
                        <strong>Email :</strong>
                        <span>contact@${item.nom.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.ci</span>
                    </div>
                </div>
            </div>

            <div class="details-section">
                <h3>Politiques & Conditions</h3>
                <div class="details-policies">
                    <div class="policy-item">
                        <strong>${isHotel ? 'Check-in :' : 'Réservation :'}</strong>
                        <span>${isHotel ? 'À partir de 14h00' : 'Acceptée jusqu\'à 22h00'}</span>
                    </div>
                    <div class="policy-item">
                        <strong>${isHotel ? 'Check-out :' : 'Annulation :'}</strong>
                        <span>${isHotel ? 'Jusqu\'à 12h00' : '24h à l\'avance'}</span>
                    </div>
                    <div class="policy-item">
                        <strong>Paiement :</strong>
                        <span>Espèces, carte bancaire, Mobile Money</span>
                    </div>
                    <div class="policy-item">
                        <strong>Langues :</strong>
                        <span>Français, Anglais, langues locales</span>
                    </div>
                </div>
            </div>

            <div class="details-section">
                <h3>Avis Clients (${item.avis})</h3>
                <div class="reviews-preview">
                    ${generateReviews(item.avis, isHotel)}
                </div>
            </div>
        </div>

        <div class="details-actions">
            <button class="btn-reserve-large" onclick="handleReservation(${item.id}, '${type}')">
                Réserver maintenant
            </button>
            <button class="btn-close" onclick="closeDetailsModal()">
                Fermer
            </button>
        </div>
    `;

    } catch (error) {
        console.error('Erreur lors du chargement des détails:', error);
        showNotification('Erreur lors du chargement des détails', 'error');
    }
}

/**
 * Fermer la modal des détails
 */
function closeDetailsModal() {
    document.getElementById('detailsModal').classList.remove('active');
}

// ===================================
// RECHERCHE
// ===================================

/**
 * Gérer la recherche
 */
async function handleSearch() {
    const city = document.getElementById('city').value;

    if (!city) {
        // Si aucune ville n'est sélectionnée, afficher tous les établissements
        try {
            const [hotels, restaurants] = await Promise.all([fetchHotels(), fetchRestaurants()]);
            displayHotels(hotels);
            displayRestaurants(restaurants);
            showNotification('Affichage de tous les établissements', 'info');
        } catch (error) {
            showNotification('Erreur lors du chargement des données', 'error');
        }
        return;
    }

    try {
        // Rechercher par ville via l'API
        const [filteredHotels, filteredRestaurants] = await Promise.all([
            searchHotelsByCity(city),
            searchRestaurantsByCity(city)
        ]);

        displayHotels(filteredHotels);
        displayRestaurants(filteredRestaurants);

        // Scroller vers le résultat
        document.getElementById('hotels').scrollIntoView({ behavior: 'smooth' });

        showNotification(`Résultats pour ${city.charAt(0).toUpperCase() + city.slice(1)} : ${filteredHotels.length} hôtels, ${filteredRestaurants.length} restaurants`, 'success');
    } catch (error) {
        showNotification('Erreur lors de la recherche', 'error');
    }
}

/**
 * Gérer la réinitialisation de la recherche
 */
async function handleReset() {
    // Réinitialiser le formulaire
    document.getElementById('city').value = '';
    document.getElementById('checkIn').value = '';
    document.getElementById('checkOut').value = '';
    document.getElementById('guests').value = '1';

    try {
        // Afficher tous les établissements
        const [hotels, restaurants] = await Promise.all([fetchHotels(), fetchRestaurants()]);
        displayHotels(hotels);
        displayRestaurants(restaurants);

        // Scroller vers le haut de la page
        window.scrollTo({ top: 0, behavior: 'smooth' });

        showNotification('Recherche réinitialisée - Affichage de tous les établissements', 'info');
    } catch (error) {
        showNotification('Erreur lors du chargement des données', 'error');
    }
}

// ===================================
// NOTIFICATIONS
// ===================================

/**
 * Afficher une notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ===================================
// UTILITAIRES
// ===================================

/**
 * Formater le prix en FCFA
 */
function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR').format(price);
}

/**
 * Annuler une réservation
 */
async function cancelReservation(reservationId) {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation?')) return;
    
    try {
        const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            showNotification('Réservation annulée', 'success');
            loadReservations();
        } else {
            showNotification('Erreur lors de l\'annulation', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}
