import * as SQLite from 'expo-sqlite';


// Ouvrir la base de données
const db: any = SQLite.openDatabaseSync('myDatabase.db');

// Fonction pour obtenir la connexion à la base de données
export const getDBConnection = async (): Promise<any> => {
    return db;
  };

// Fonction pour créer les tables nécessaires
export const createTables = (db: any): void => {
  db.transaction((tx: { executeSql: (arg0: string, arg1: never[], arg2: { (): void; (): void; (): void; (): void; }, arg3: { (_tx: any, error: any): boolean; (_tx: any, error: any): boolean; (_tx: any, error: any): boolean; (_tx: any, error: any): boolean; }) => void; }) => {
    // Création de la table PATIENTS
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS PATIENTS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT,
        prenom TEXT,
        age INTEGER,
        marie TEXT,
        region TEXT,
        district_sanitaire TEXT,
        formation_sanitaire TEXT,
        niveau_instruction TEXT,
        profession_femme TEXT,
        profession_mari TEXT,
        adresse TEXT,
        commune TEXT,
        date_dernier_accouchement TEXT,
        nombre_enfants_vivants INTEGER,
        gestite INTEGER,
        parite INTEGER,
        ddr TEXT,
        dpa TEXT,
        cpn1 INTEGER,  
        rappel TEXT
      );`,
      [],
      () => { console.log('Table PATIENTS created successfully'); },
      (_tx: any, error: any) => { 
        console.error('Error creating table PATIENTS', error); 
        return false;
      }
    );

    // Création de la table ANTECEDENTS
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS ANTECEDENTS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_patient INTEGER,
        age_inferieur_18_ans INTEGER,
        age_superieur_38_ans INTEGER,
        primipare_agee_plus_35_ans INTEGER,
        parite_superieure_5 INTEGER,
        dernier_accouchement_moins_2_ans INTEGER,
        bassin_retreci_asymetrique INTEGER,
        ta_sup_14_8 INTEGER,
        diabete INTEGER,
        dyspnee INTEGER,
        intervention INTEGER,
        grossesse_gemellaire INTEGER,
        antecedent INTEGER,
        mort_ne INTEGER,
        fausses_couches INTEGER,
        habitude INTEGER,
        FOREIGN KEY (id_patient) REFERENCES PATIENTS(id)
      );`,
      [],
      () => { console.log('Table ANTECEDENTS created successfully'); },
      (_tx: any, error: any) => { 
        console.error('Error creating table ANTECEDENTS', error); 
        return false;
      }
    );

    // Création de la table MESSAGES
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS MESSAGES (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_patient INTEGER,
        envoyer TEXT,
        message TEXT,
        date_envoie TEXT,
        FOREIGN KEY (id_patient) REFERENCES PATIENTS(id)
      );`,
      [],
      () => { console.log('Table MESSAGES created successfully'); },
      (_tx: any, error: any) => { 
        console.error('Error creating table MESSAGES', error); 
        return false;
      }
    );

    // Création de la table ADMIN
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS ADMIN (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT
      );`,
      [],
      () => {
        console.log('Table ADMIN created successfully');
        
        // Appel de insertAdmin avec la promesse et gestion des erreurs
        insertAdmin(db, 'admin', 'password123')
          .then(() => {
            console.log('Admin inserted successfully');
          })
          .catch(error => {
            console.error('Error inserting admin:', error);
          });
      },
      (_tx: any, error: any) => {
        console.error('Error creating table ADMIN', error);
        return false;
      }
    );
  });
};

// Fonction pour insérer un administrateur par défaut
export const insertAdmin = (db: any, username: string, password: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject('Database connection is not available');
      return;
    }

    db.transaction((tx: { executeSql: (arg0: string, arg1: string[], arg2: () => void, arg3: (_tx: any, error: any) => boolean) => void; }) => {
      tx.executeSql(
        `INSERT OR IGNORE INTO ADMIN (username, password) VALUES (?, ?)`,
        [username, password],
        () => { console.log('Default admin added successfully'); resolve(); },
        (_tx: any, error: any) => { console.error('Error adding default admin', error); reject(error); 
          return false;
        }
      );
    });
  });
};

// Fonction pour vérifier les informations d'identification de l'administrateur
// Fonction pour vérifier les informations d'identification de l'administrateur
export const checkAdminCredentials = (username: string, password: string, callback: (isValid: boolean) => void): void => {
    db.transaction((tx: { executeSql: (arg0: string, arg1: string[], arg2: (_tx: any, results: any) => void, arg3: (_tx: any, error: any) => boolean) => void; }) => {
      tx.executeSql(
        'SELECT * FROM ADMIN WHERE username = ? AND password = ?',
        [username, password],
        (_tx: any, results: { rows: string | any[]; }) => {
          if (results.rows.length > 0) {
            callback(true);
          } else {
            callback(false);
          }
        },
        (_tx: any, error: any) => { 
          console.error('Error checking admin credentials', error); 
          return false;  
        }
      );
    });
  };



// Les autres fonctions restent inchangées (ajouter, modifier, supprimer des patients)
// Fonction pour ajouter un patient
export const addPatient = (db: any, patient: {
  nom: string;
  prenom: string;
  age: number;
  marie: string;
  region: string;
  district_sanitaire: string;
  formation_sanitaire: string;
  niveau_instruction: string;
  profession_femme: string;
  profession_mari: string;
  adresse: string;
  commune: string;
  date_dernier_accouchement: string;
  nombre_enfants_vivants: number;
  gestite: number;
  parite: number;
  ddr: string;
  dpa: string;
  cpn1: boolean;
  rappel: string;
}): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: { executeSql: (arg0: string, arg1: (string | number)[], arg2: () => void, arg3: (_tx: any, error: any) => boolean) => void; }) => {
      tx.executeSql(
        'INSERT INTO PATIENTS (nom, prenom, age, marie, region, district_sanitaire, formation_sanitaire, niveau_instruction, profession_femme, profession_mari, adresse, commune, date_dernier_accouchement, nombre_enfants_vivants, gestite, parite, ddr, dpa, cpn1, rappel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          patient.nom, patient.prenom, patient.age, patient.marie, patient.region, patient.district_sanitaire,
          patient.formation_sanitaire, patient.niveau_instruction, patient.profession_femme, patient.profession_mari,
          patient.adresse, patient.commune, patient.date_dernier_accouchement, patient.nombre_enfants_vivants,
          patient.gestite, patient.parite, patient.ddr, patient.dpa, patient.cpn1 ? 1 : 0, patient.rappel
        ],
        () => {
          console.log('Patient added successfully');
          resolve();
        },
        (_tx: any, error: any) => {
          console.error('Error adding patient', error);
          reject(error);
          return true;
        }
      );
    });
  });
};

// Fonction pour obtenir les patients
export const getPatients = (db: any): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: { executeSql: (arg0: string, arg1: never[], arg2: (_tx: any, results: any) => void, arg3: (_tx: any, error: any) => boolean) => void; }) => {
      tx.executeSql(
        'SELECT * FROM PATIENTS',
        [],
        (_tx: any, results: { rows: { _array: any[] | PromiseLike<any[]>; }; }) => {
          resolve(results.rows._array); // Résultat des patients
        },
        (_tx: any, error: any) => {
          console.error('Error getting patients', error);
          reject(error);
          return true;
        }
      );
    });
  });
};

// Fonction pour mettre à jour un patient
export const updatePatient = (patient: {
  id: number,
  nom: string,
  prenom: string,
  age: number,
  marie: string,
  region: string,
  district_sanitaire: string,
  formation_sanitaire: string,
  niveau_instruction: string,
  profession_femme: string,
  profession_mari: string,
  adresse: string,
  commune: string,
  date_dernier_accouchement: string,
  nombre_enfants_vivants: number,
  gestite: number,
  parite: number,
  ddr: string,
  dpa: string,
  cpn1: boolean,
  rappel: string
}): void => {
  db.transaction((tx: { executeSql: (arg0: string, arg1: (string | number)[], arg2: (_tx: any, _result: any) => void, arg3: (_tx: any, error: any) => boolean) => void; }) => {
    tx.executeSql(
      'UPDATE PATIENTS SET nom = ?, prenom = ?, age = ?, marie = ?, region = ?, district_sanitaire = ?, formation_sanitaire = ?, niveau_instruction = ?, profession_femme = ?, profession_mari = ?, adresse = ?, commune = ?, date_dernier_accouchement = ?, nombre_enfants_vivants = ?, gestite = ?, parite = ?, ddr = ?, dpa = ?, cpn1 = ?, rappel = ? WHERE id = ?',
      [
        patient.nom, patient.prenom, patient.age, patient.marie, patient.region, patient.district_sanitaire,
        patient.formation_sanitaire, patient.niveau_instruction, patient.profession_femme, patient.profession_mari,
        patient.adresse, patient.commune, patient.date_dernier_accouchement, patient.nombre_enfants_vivants,
        patient.gestite, patient.parite, patient.ddr, patient.dpa, patient.cpn1 ? 1 : 0, patient.rappel, patient.id
      ],
      (_tx: any, _result: any) => { console.log('Patient updated successfully'); },
      (_tx: any, error: any) => { 
        console.error('Error updating patient', error); 
        return false;  // Return false to indicate the error is not fully handled
      }
    );
  });
};

// Fonction pour supprimer un patient
export const deletePatient = (patientId: number): void => {
  db.transaction((tx: { executeSql: (arg0: string, arg1: number[], arg2: (_tx: any, _result: any) => void, arg3: (_tx: any, error: any) => boolean) => void; }) => {
    tx.executeSql(
      'DELETE FROM PATIENTS WHERE id = ?',
      [patientId],
      (_tx: any, _result: any) => { console.log('Patient deleted successfully'); },
      (_tx: any, error: any) => { 
        console.error('Error deleting patient', error); 
        return false;  // Return false to indicate the error is not fully handled
      }
    );
  });
};



