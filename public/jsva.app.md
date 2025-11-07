# **Documentation Complète du Projet JSVA**  
*(Je Suis Vendeur Ambulant – Système d'Identification Officielle pour Vendeurs Ambulants)*  

---

## **I. Résumé du Projet**  
**Problème** :  
Les vendeurs ambulants (marchés, rues) en Afrique souffrent d’un manque de **reconnaissance légale**, ce qui entraîne :  
- Insécurité (confiscations arbitraires, harcèlement).  
- Difficulté d’accès aux services (crédits, emplacements réservés).  
- Absence de traçabilité pour les autorités.  

**Solution** :  
**JSVA** est un système d’identification **simple, abordable et digital** comprenant :  
- Un **badge physique** (PVC durable avec QR Code unique).  
- Une **base de données sécurisée** (profil vendeur + historique).  
- Un **réseau de partenaires** (mairies, associations, grossistes).  

**Prix** : **1-2€/an** (accessible même aux micro-vendeurs).  

---

## **II. Objectifs**  
| **Court Terme** | **Moyen Terme** | **Long Terme** |  
|----------------|----------------|---------------|  
| - 500 badges vendus en 3 mois. | - 10 000 badges en 1 an. | - Norme nationale d’identification. |  
| - Partenariat avec 1 mairie pilote. | - Intégration avec mobile money. | - Extension à d’autres pays. |  

---

## **III. Fonctionnalités Techniques**  
### **A. Badge Physique**  
- **Matériau** : PVC résistant (format carte bancaire).  
- **Éléments** :  
  - QR Code lié au profil en ligne.  
  - Numéro d’identification unique (ex: *JSVA-ABJ-5874*).  
  - Photo + nom (optionnel).  

### **B. Plateforme Digitale**  
- **Pour les vendeurs** :  
  - Profil vérifiable (activité, localisation).  
  - Accès à des offres partenaires (ex: -5% chez un grossiste).  
- **Pour les autorités** :  
  - Outil de recensement et de gestion des marchés.  

### **C. Options d’Enregistrement**  
1. **SMS/USSD** (pour les non-smartphones).  
2. **Appli mobile** (Android/iOS).  
3. **Points physiques** (kiosques dans les marchés).  

---

## **IV. Modèle Économique**  
### **Recettes**  
- **Abonnements** : 1-2€/an par vendeur.  
- **Partenariats B2B** :  
  - Grossistes (accès à un réseau certifié).  
  - Opérateurs télécoms (intégration mobile money).  
- **Subventions publiques** (si adoption par les mairies).  

### **Coûts**  
| **Poste** | **Détail** | **Coût (10 000 badges)** |  
|-----------|------------|-------------------------|  
| Badges | Production + livraison | 3 000€ |  
| Plateforme | Développement + hébergement | 5 000€ |  
| Distribution | Équipe terrain | 2 000€ |  

**Seuil de rentabilité** : **~3 000 badges vendus**.  

---

## **V. Stratégie de Déploiement**  
### **Phase 1 (Mois 1-3) – Pilote**  
- **Cible** : 1 marché urbain (ex: Marché Sandaga à Dakar).  
- **Actions** :  
  - Recrutement de 2 ambassadeurs (vendeurs influents).  
  - Badges offerts aux 50 premiers inscrits.  

### **Phase 2 (Mois 4-6) – Scale Local**  
- **Objectif** : 1 000 badges.  
- **Partenariats clés** :  
  - 1 grossiste (réductions pour les porteurs JSVA).  
  - 1 mairie (reconnaissance officielle).  

### **Phase 3 (Mois 7-12) – Expansion**  
- **Cible** : 3 nouvelles villes.  
- **Automatisation** : Kiosques d’enregistrement self-service.  

---

## **VI. Impact Social**  
- **Pour les vendeurs** :  
  ✅ **Protection** contre les abus.  
  ✅ **Accès** à des avantages économiques.  
- **Pour les villes** :  
  ✅ **Recensement** des acteurs informels.  
  ✅ **Optimisation** de la fiscalité locale.  

---

## **VII. Risques & Solutions**  
| **Risque** | **Solution** |  
|------------|------------|  
| Faible adoption | Campagne "Badge JSVA = + de clients" |  
| Contrefaçon | QR Code dynamique + vérification en temps réel |  
| Résistance des mairies | Démontrer l’impact via des données (ex: 500 vendeurs recensés) |  

---

## **VIII. Logo & Identité Visuelle**  
- **Style** : Sobre et professionnel.  
- **Couleurs** : Noir + Orange (énergie + sérieux).  
- **Élément clé** : Silhouette de vendeur intégrée au "J" de JSVA.  

---

## **IX. Prochaines Étapes**  
1. **Finaliser le prototype** (badge + backoffice).  
2. **Tester avec 50 vendeurs**.  
3. **Approcher les premiers partenaires** (mairie, grossiste).  



//  ENDPOINTS LINKS 



// https://ciucbc.pythonanywhere.com/api/v01/account/roles/
// https://ciucbc.pythonanywhere.com/api/v01/account/permission/
// https://ciucbc.pythonanywhere.com/api/v01/account/group/

// 'https://ciucbc.pythonanywhere.com/api/v01/faculty/available-course/'
// 'https://ciucbc.pythonanywhere.com/api/v01/faculty/course-student-assignation/'
// 'https://ciucbc.pythonanywhere.com/api/v01/faculty/taught-course/'
// 'https://ciucbc.pythonanywhere.com/api/v01/faculty/hour-record/'
// 'https://ciucbc.pythonanywhere.com/api/v01/faculty/physical-attendance-check/'
// 'https://ciucbc.pythonanywhere.com/api/v01/faculty/student-attendance-status/'
// 'https://ciucbc.pythonanywhere.com/api/v01/faculty/teaching-unit/'


// http://localhost:8000/api/v01/apparitorat/application/
// http://localhost:8000/api/v01/apparitorat/application-pending/
// http://localhost:8000/api/v01/apparitorat/application-validated/
// http://localhost:8000/api/v01/apparitorat/application-rejected/
// http://localhost:8000/api/v01/apparitorat/previous-university-studies/
// http://localhost:8000/api/v01/apparitorat/enrollment-question-response/
// http://localhost:8000/api/v01/apparitorat/admission-test-course/
// http://localhost:8000/api/v01/apparitorat/admission-test-result/
// http://localhost:8000/api/v01/apparitorat/enrollment/
// http://localhost:8000/api/v01/apparitorat/common-enrollment-infos/
// http://localhost:8000/api/v01/apparitorat/premature-end/

// get token after login: https://ciucbc.pythonanywhere.com/https://ciucbc.pythonanywhere.com/auth/jwt/create/
// create user or register user: https://ciucbc.pythonanywhere.com/auth/users/
// get the current connected user info: https://ciucbc.pythonanywhere.com/auth/users/me/

//  https://ciucbc.pythonanywhere.com/api/v01/main_config/academic-year/
//  https://ciucbc.pythonanywhere.com/api/v01/main_config/class-year/
//  https://ciucbc.pythonanywhere.com/api/v01/main_config/cycle/
//  https://ciucbc.pythonanywhere.com/api/v01/main_config/currency/
//  https://ciucbc.pythonanywhere.com/api/v01/main_config/departement/
//  https://ciucbc.pythonanywhere.com/api/v01/main_config/faculty/
//  https://ciucbc.pythonanywhere.com/api/v01/main_config/field/
//  https://ciucbc.pythonanywhere.com/api/v01/main_config/house/
//  https://ciucbc.pythonanywhere.com/api/v01/main_config/institution/
//  https://ciucbc.pythonanywhere.com/api/v01/main_config/payement-method/
//  https://ciucbc.pythonanywhere.com/api/v01/main_config/period/
//  https://ciucbc.pythonanywhere.com/api/v01/main_config/service/
//  https://ciucbc.pythonanywhere.com/api/v01/main_config/timetable/

//  https://ciucbc.pythonanywhere.com/api/v01/apparitorat/application/,
//  https://ciucbc.pythonanywhere.com/api/v01/apparitorat/application-pending/,
//  https://ciucbc.pythonanywhere.com/api/v01/apparitorat/application-validated/
//  https://ciucbc.pythonanywhere.com/api/v01/apparitorat/application-rejected/

//  https://ciucbc.pythonanywhere.com/api/v01/apparitorat/previous-university-studies/
//  https://ciucbc.pythonanywhere.com/api/v01/apparitorat/enrollment-question-response/
//  https://ciucbc.pythonanywhere.com/api/v01/apparitorat/admission-test-course/
//  https://ciucbc.pythonanywhere.com/api/v01/apparitorat/admission-test-result/
//  https://ciucbc.pythonanywhere.com/api/v01/apparitorat/enrollment/,
//  https://ciucbc.pythonanywhere.com/api/v01/apparitorat/common-enrollment-infos/
//  https://ciucbc.pythonanywhere.com/api/v01/apparitorat/premature-end/

// https://ciucbc.pythonanywhere.com/api/v01/faculty/available-course "OK"
// https://ciucbc.pythonanywhere.com/api/v01/faculty/teaching-unit "OK"
// https://ciucbc.pythonanywhere.com/api/v01/faculty/taught-course "OK"
// https://ciucbc.pythonanywhere.com/api/v01/faculty/departement-program/ "OK"
// https://ciucbc.pythonanywhere.com/api/v01/faculty/course-program/ "OK"

// https://ciucbc.pythonanywhere.com/api/v01/faculty/teachers "OK"
// https://ciucbc.pythonanywhere.com/api/v01/faculty/hour-record "OK"
// https://ciucbc.pythonanywhere.com/api/v01/faculty/course-student-assignation "OK"
// https://ciucbc.pythonanywhere.com/api/v01/faculty/physical-attendance-check "OK"
// https://ciucbc.pythonanywhere.com/api/v01/faculty/student-attendance-status "OK"


// ################# Period enrollment #####################

// POST:
// {
//   year_enrollments:[1,3,5],
//   period:1,
//   status:"Pending"

// {

// PUT - SIGLE:
 
// {
//   pk:1,
//   year_enrollments:1,
//   period:2,    
//   status:"Validated"
// }  

// PUT - MULTIPLE:
 
// {
//   pk_list:[1,2],      
//   status:"Validated"
// }
     
 


// ################# Course enrollment from fac #####################



// POST :
// {
//   payload:[
//     { student:1,courses:[1],status:"Pending"},
//     { student:1,courses:[1,9] ,status:"Pending"},
//   ]
// }

// PUT - SIGLE:
 
// {
//   pk:1,
//   student:1,
//   course:2,    
//   status:"Validated",
//   mode:"SINGLE-UPDATE"
// }  

// PUT - MULTIPLE:
 
// {
//   pk_list:[1,2],      
//   status:"Validated",
//   mode:"MULTIPLE-UPDATE"
// }

//   https://ciucbc.pythonanywhere.com/api/v01/account/users/
// https://ciucbc.pythonanywhere.com/api/v01/account/roles/
// https://ciucbc.pythonanywhere.com/api/v01/account/permission/
// https://ciucbc.pythonanywhere.com/api/v01/account/group

// https://ciucbc.pythonanywhere.com/api/v01/faculty/faculty-dashbord/ (OK)
// https://ciucbc.pythonanywhere.com/api/v01/faculty/departement-dashboard/ (OK)
// https://ciucbc.pythonanywhere.com/api/v01/faculty/class-year-dashbord/

// https://ciucbc.pythonanywhere.com/api/v01/teacher/teacher-dashbord/ (OK)
// https://ciucbc.pythonanywhere.com/api/v01/student/student-dashbord/ ...



//  https://ciucbc.pythonanywhere.com/api/v01/jury/letter-grading (OK)
//  https://ciucbc.pythonanywhere.com/api/v01/jury/jury (OK)
//  https://ciucbc.pythonanywhere.com/api/v01/jury/sheet-field-grades
//  https://ciucbc.pythonanywhere.com/api/v01/jury/sheet-grades
//  https://ciucbc.pythonanywhere.com/api/v01/jury/grades-class
//  https://ciucbc.pythonanywhere.com/api/v01/jury/teaching-unit-grades
//  https://ciucbc.pythonanywhere.com/api/v01/jury/period-grades
//  https://ciucbc.pythonanywhere.com/api/v01/jury/year-grades
//  https://ciucbc.pythonanywhere.com/api/v01/jury/announcement
//  https://ciucbc.pythonanywhere.com/api/v01/jury/retake-course

// https://ciucbc.pythonanywhere.com/api/v01/jury/deliberation-minutes/
// https://ciucbc.pythonanywhere.com/api/v01/jury/grade-report/
// https://ciucbc.pythonanywhere.com/api/v01/jury/result-presentation/

// https://ciucbc.pythonanywhere.com/api/v01/faculty/attendance-list/?course__id=&attendance_reached

// https://ciucbc.pythonanywhere.com/api/v01/apparitorat/year-enrollment/registration/
// {
//     academic_year: number;
//     field: number;
//     faculty: Faculty;
//     departement: number;
//     class_year: number;
//     cycle: number;
//     year_enrollment: number;
//     enrollement_fees:"paid"| "unpa" |"PARTIALY_PAID";
//     status: "pending" | "validated" | "rejected" | ;
//     type_of_enrollment: "new_application" | "reapplication" | "former_application";
// }


---