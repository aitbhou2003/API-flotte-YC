# API de Gestion de Flotte de Transport

API REST développée avec **Node.js**, **Express** et **MongoDB / Mongoose** pour la gestion de véhicules (camions, remorques), des pneus, des règles de maintenance préventive et du suivi des trajets des chauffeurs.

---

## 🚀 Démarrage rapide

### 1. Installation des dépendances
```bash
npm install
```

### 2. Configuration des variables d'environnement
Créez un fichier `.env` à la racine :
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/flotte
JWT_SECRET=votre_cle_secrete_jwt
```

### 3. Démarrer le serveur
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

---

## 📖 Documentation Interactive Swagger

Une documentation Swagger UI complète et interactive est intégrée au projet :

- **Interface interactive Swagger UI** : [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
- **Spécification OpenAPI (JSON brut)** : [http://localhost:5000/api/docs.json](http://localhost:5000/api/docs.json) *(idéal pour importer dans Postman ou Insomnia)*

### Fonctionnalités documentées :
1. **Authentification & Utilisateurs** :
   - `POST /api/login` : Authentification et obtention du JWT
   - `POST /api/users` : Création de compte (Admin)
2. **Camions (Trucks)** :
   - CRUD complet (`/api/trucks`)
3. **Remorques** :
   - CRUD complet (`/api/remorques`)
4. **Pneus (Tires)** :
   - CRUD et suivi d'usure kilométrique (`/api/tires`)
5. **Règles de Maintenance** :
   - CRUD des règles préventives (`/api/regles-maintenance`)
6. **Maintenances** :
   - CRUD des interventions (`/api/maintenances`)
   - Déclencheur et vérification automatique (`/api/maintenances/check-truck/:truckId`)
7. **Trajets** :
   - Assignation avec contrôle de disponibilité (`/api/trajets`)
   - Espace chauffeur : Consultation (`/api/mes-trajets`), Démarrage (`/api/trajets/:id/demarrer`), Clôture et calcul de consommation (`/api/trajets/:id/terminer`)

---

## 🧪 Tests

```bash
npm test
```
