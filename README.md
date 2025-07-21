# CRM Vue.js - Projet ESGI

**Développé par : Acil et Kadem**

Un CRM développé dans le cadre de notre formation à l'ESGI, utilisant Vue.js 3, TypeScript et SQLite.

## Notre projet

Nous avons choisi Vue.js 3 avec TypeScript pour apprendre ces technologies qui sont très demandées dans les postes.

### Nos objectifs d'apprentissage
- Maîtriser Vue.js 3
- Apprendre TypeScript pour la sécurité des types
- Gérer l'authentification et les autorisations
- Travailler avec une base de données relationnelle

## Répartition du travail

### Acil a travaillé sur :
- **Frontend Vue.js** : Interface utilisateur, composants réutilisables
- **Authentification** : Système de login/logout avec JWT
- **Gestion d'état** : Stores Pinia pour les données
- **Routing** : Navigation entre les pages
- **Services API** : Communication avec le backend

### Kadem a travaillé sur :
- **Backend Express** : API REST avec Node.js
- **Base de données** : Schéma Prisma et SQLite
- **Authentification backend** : Middleware JWT, hashage des mots de passe
- **CRUD clients** : Opérations de base de données
- **Sécurité** : Validation des données, contrôle d'accès

## Technologies choisies et pourquoi

### Frontend
- **Vue.js 3** : Imposé pour la matière
- **TypeScript** : Pour éviter les bugs, meilleure expérience de développement
- **Vite** : Build ultra-rapide
- **Vue Router 4** : Navigation simple et efficace
- **DaisyUI + Tailwind** : CSS utility-first, design moderne sans effort
- **Pinia** : Gestion d'état simple et performante

### Backend
- **Node.js + Express** : JavaScript partout, facile à apprendre
- **SQLite** : Base de données simple, pas besoin d'installer PostgreSQL/MySQL
- **Prisma ORM** : Type-safe, auto-complétion, migrations automatiques
- **JWT** : Authentification stateless, moderne
- **bcryptjs** : Sécurité des mots de passe

## Installation et démarrage

### Prérequis
- Node.js 18+ (on a testé avec la version LTS)
- npm (vient avec Node.js)

### 1. Cloner le projet

### 2. Installer toutes les dépendances
```bash
npm run install:all
```
*Cette commande installe les dépendances du frontend ET du backend en une fois*

### 3. Configurer la base de données
```bash
npm run db:setup
```
*Cette commande crée la base SQLite, applique le schéma et ajoute des données de test*

### 4. Démarrer l'application
```bash
npm run dev
```

L'application sera accessible sur :
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3001

## 👤 Comptes de test

On a créé deux comptes pour tester les différents niveaux d'accès :

### Administrateur (toutes les permissions)
- **Email** : `admin@crm.com`
- **Mot de passe** : `password`

### Utilisateur (lecture seule)
- **Email** : `user@crm.com`
- **Mot de passe** : `password`

## Structure du projet (notre organisation)

```
vuejs-esgi/
├── backend/                 # API Express (travail d'Acil)
│   ├── prisma/             # Schéma de base de données
│   │   ├── schema.prisma   # Définition des tables
│   │   └── dev.db          # Base SQLite (créée automatiquement)
│   ├── server.js           # Serveur Express principal
│   ├── seed.js             # Données de test
│   └── package.json        # Dépendances backend
├── crm-vue/                # Frontend Vue.js (mon travail)
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   │   ├── ui/         # Composants UI (boutons, tableaux...)
│   │   │   └── ...         # Autres composants
│   │   ├── views/          # Pages de l'application
│   │   │   ├── LoginView.vue
│   │   │   ├── DashboardView.vue
│   │   │   ├── CustomersView.vue
│   │   │   └── ...
│   │   ├── composables/    # Logique métier réutilisable
│   │   │   ├── useAuth.ts  # Gestion de l'auth
│   │   │   ├── useCustomers.ts
│   │   │   └── useInteractions.ts
│   │   ├── services/       # Communication avec l'API
│   │   │   ├── apiService.ts
│   │   │   ├── authService.ts
│   │   │   └── customerService.ts
│   │   ├── stores/         # Gestion d'état global (Pinia)
│   │   ├── types/          # Types TypeScript
│   │   └── router/         # Configuration des routes
│   └── package.json        # Dépendances frontend
└── package.json            # Scripts de développement
```

## Scripts utiles

```bash
# Développement
npm run dev                 # Démarre frontend + backend en même temps
npm run dev:frontend        # Frontend uniquement (port 5173)
npm run dev:backend         # Backend uniquement (port 3001)

# Base de données
npm run db:setup           # Génère, pousse le schéma et ajoute des données de test
cd backend && npm run db:studio  # Interface graphique pour voir la base de données

# Installation
npm run install:all        # Installe toutes les dépendances
```

## Notre base de données

### Modèles qu'on a créés

#### User (utilisateurs)
- `id` : Identifiant unique
- `email` : Email unique (pour se connecter)
- `name` : Nom complet de l'utilisateur
- `password` : Mot de passe hashé (sécurisé avec bcrypt)
- `role` : Rôle (admin/user) pour les permissions
- `avatar` : URL de l'avatar (optionnel)
- `createdAt` / `updatedAt` : Dates de création/modification

#### Customer (clients)
- `id` : Identifiant unique
- `name` : Nom du client
- `email` : Email unique du client
- `phone` : Téléphone (optionnel)
- `company` : Entreprise du client (optionnel)
- `status` : Statut (active/prospect/inactive)
- `notes` : Notes sur le client (optionnel)
- `createdAt` / `updatedAt` : Dates de création/modification

## Notre API (endpoints qu'on a créés)

### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `GET /api/auth/me` - Récupérer les infos de l'utilisateur connecté

### Clients
- `GET /api/customers` - Liste des clients (avec pagination et filtres)
- `GET /api/customers/:id` - Détails d'un client spécifique
- `POST /api/customers` - Créer un nouveau client (admin seulement)
- `PUT /api/customers/:id` - Modifier un client (admin seulement)
- `DELETE /api/customers/:id` - Supprimer un client (admin seulement)

### Statistiques
- `GET /api/stats` - Statistiques pour le dashboard

## Interface utilisateur (ce qu'on a créé)

### Pages principales
- **Login** : Page de connexion avec validation
- **Dashboard** : Vue d'ensemble avec statistiques et graphiques
- **Clients** : Liste des clients avec recherche, filtres et pagination
- **Détail client** : Page détaillée d'un client
- **Formulaire client** : Création et modification de clients
- **Admin** : Interface d'administration (réservée aux admins)

### Fonctionnalités qu'on a implémentées
- **Responsive design** : Ça marche sur mobile, tablette et desktop
- **Thème moderne** : Interface belle avec DaisyUI
- **Loading states** : Indicateurs de chargement pour une meilleure UX
- **Error handling** : Gestion d'erreurs avec messages clairs
- **Notifications** : Feedback utilisateur pour les actions

## Sécurité (ce qu'on a mis en place)

- **JWT** : Tokens d'authentification sécurisés
- **bcryptjs** : Hashage des mots de passe (impossible de les lire)
- **Middleware d'authentification** : Protection des routes sensibles
- **Contrôle d'accès** : Différents niveaux selon le rôle
- **Validation** : Vérification des données côté serveur

## Ce qu'on a appris

- Vue.js 3 et Composition API
- TypeScript pour la sécurité des types
- Gestion d'état avec Pinia
- Communication avec une API REST
- Interface utilisateur moderne
- Node.js et Express
- Gestion de base de données avec Prisma
- Authentification JWT
- Sécurité des applications web
- Architecture backend

## Difficultés rencontrées

- **CORS** : Configuration des requêtes cross-origin
- **TypeScript** : Apprentissage des types et interfaces
- **JWT** : Gestion des tokens et refresh
- **Prisma** : Première utilisation d'un ORM
- **État global** : Gestion des données partagées

## Conclusion

Ce projet nous a permis de mettre en pratique beaucoup de concepts vus en cours. On a appris à travailler en équipe, à organiser un projet, et à utiliser des technologies modernes du développement web.
