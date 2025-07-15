# Coton Blanc - Planning des Interventions

## 🧹 Description
Application web pour gérer et visualiser le planning des interventions de la société de nettoyage Coton Blanc à Tahiti.

## 🌟 Fonctionnalités
- **Authentification sécurisée** par mot de passe
- **3 vues de calendrier** : Mensuelle, Hebdomadaire, Journalière
- **Filtrage par équipe** avec code couleur
- **Détails des interventions** en popup avec catégorie, durée et téléphone
- **Synchronisation automatique** avec Notion via n8n
- **Design responsive** pour tablettes et mobiles

## 🚀 Installation

### Prérequis
- Compte GitHub
- Accès à Notion
- Instance n8n configurée

### Étapes
1. Fork ce repository
2. Activer GitHub Pages dans Settings > Pages
3. Configurer le workflow n8n avec vos IDs Notion
4. Modifier le mot de passe dans `app.js`

## 🔧 Configuration

### Mot de passe par défaut
```javascript
const PASSWORD = 'CotonBlanc2024!'; // À modifier en production
```

### Structure des données
Les interventions sont stockées dans `data/interventions.json` avec le format :
```json
{
  "lastUpdate": "2025-07-14T12:00:00Z",
  "interventions": [
    {
      "id": "unique-id",
      "title": "Nom du client",
      "start": "2025-07-14T08:00:00Z",
      "end": "2025-07-14T10:00:00Z",
      "equipe": "Équipe 1 - Rouge",
      "adresse": "Adresse complète",
      "materiel": ["Monobrosse", "Échafaudage"],
      "instructions": "Instructions spécifiques",
      "statut": "Intervention programmée",
      "categorie": "Nettoyage bureaux",
      "duree": 2,
      "telephone": "+689 40 123456"
    }
  ]
}
```

## 🎨 Code couleur des équipes
- 🔴 **Équipe 1** - Rouge
- 🟢 **Équipe 2** - Verte
- 🔵 **Équipe 3** - Bleue
- 🟡 **Équipe 4** - Jaune
- 🟣 **Équipe 5** - Violette

## 📱 Utilisation

1. **Connexion** : Entrer le mot de passe configuré
2. **Navigation** : 
   - Utiliser les boutons Mois/Semaine/Jour pour changer de vue
   - Les flèches pour naviguer dans le temps
   - "Aujourd'hui" pour revenir à la date actuelle
3. **Filtrage** : Sélectionner une équipe spécifique ou "Toutes les équipes"
4. **Détails** : Cliquer sur une intervention pour voir tous les détails incluant :
   - Client et téléphone
   - Catégorie de prestation
   - Durée prévue
   - Équipe assignée
   - Adresse et instructions

## 🔄 Synchronisation avec Notion

Le workflow n8n synchronise automatiquement les données toutes les heures :
1. Lecture des interventions depuis Notion
2. Extraction des champs incluant catégorie, durée et téléphone
3. Transformation au format JSON
4. Push vers GitHub
5. Mise à jour automatique du site

### Champs Notion utilisés
- `Nom Société/Admin Prospect` → Nom du client
- `Intervention - Date et heure de début` → Début
- `Intervention - Date et heure de fin théorique` → Fin
- `Couleur équipe` → Équipe assignée
- `Adresse géographique de l'intervention` → Adresse
- `Intervention - Matériel nécessaire` → Matériel
- `Intervention - Instruction` → Instructions
- `MAKE - BL - Catégories de Prestations` → Catégorie
- `Intervention - Durée prévue` → Durée
- `Téléphone Prospect` → Téléphone

## 🛠️ Technologies utilisées
- HTML/CSS/JavaScript vanilla
- GitHub Pages pour l'hébergement
- n8n pour l'automatisation
- Notion API pour les données

## 📄 Licence
Propriété de Coton Blanc Tahiti

## 🤝 Support
Pour toute question, contacter l'équipe technique Coton Blanc.