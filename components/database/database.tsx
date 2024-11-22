import SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

// Créer une connexion à la base de données uniquement sur mobile
const db = Platform.OS === 'web' ? null : SQLite.openDatabaseSync('my.db');

// Ouvrir la base de données 
export const getDBConnection = async (): Promise<any> => {
  try {
    const db = await SQLite.openDatabaseAsync('myDatabase.db'); // Utilisation de openDatabaseAsync
    return db;
  } catch (error) {
    console.error('Error opening database', error);
    throw error; // Lance l'erreur pour la gérer dans les appels de cette fonction
  }
};

// Fonction pour créer les tables nécessaires
export const createTables = async (db: any): Promise<void> => {
  try {
    await db.transaction(async (tx: any) => {
      // Création de la table PATIENTS
      await tx.executeSql(
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
        );`
      );
      console.log('Table PATIENTS created successfully');
      
      // Création de la table ANTECEDENTS
      await tx.executeSql(
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
        );`
      );
      console.log('Table ANTECEDENTS created successfully');

      // Création de la table MESSAGES
      await tx.executeSql(
        `CREATE TABLE IF NOT EXISTS MESSAGES (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          id_patient INTEGER,
          envoyer TEXT,
          message TEXT,
          date_envoie TEXT,
          FOREIGN KEY (id_patient) REFERENCES PATIENTS(id)
        );`
      );
      console.log('Table MESSAGES created successfully');

      // Création de la table ADMIN
      await tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ADMIN (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT,
          password TEXT
        );`
      );
      console.log('Table ADMIN created successfully');
      
      // Appel de insertAdmin avec la promesse et gestion des erreurs
      await insertAdmin(db, 'admin', 'password123');
      console.log('Admin inserted successfully');
    });
  } catch (error) {
    console.error('Error creating tables or inserting admin:', error);
  }
};

// Fonction pour insérer un administrateur par défaut
export const insertAdmin = async (db: any, username: string, password: string): Promise<void> => {
  try {
    await db.transaction(async (tx: any) => {
      await tx.executeSql(
        `INSERT OR IGNORE INTO ADMIN (username, password) VALUES (?, ?)`,
        [username, password]
      );
      console.log('Default admin added successfully');
    });
  } catch (error) {
    console.error('Error adding default admin', error);
    throw error;
  }
};

// Fonction pour vérifier les informations d'identification de l'administrateur
export const checkAdminCredentials = async (username: string, password: string, p0: (isValid: any) => void): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getDBConnection();
      db.transaction((tx: any) => {
        tx.executeSql(
          'SELECT * FROM ADMIN WHERE username = ? AND password = ?',
          [username, password],
          (_tx: any, results: { rows: any[] }) => {
            resolve(results.rows.length > 0);
          },
          (_tx: any, error: any) => {
            console.error('Error checking admin credentials', error);
            resolve(false);
          }
        );
      });
    } catch (error) {
      console.error('Error checking admin credentials:', error);
      reject(error);
    }
  });
};

// Exemples pour ajouter
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




//supprimer des patients
export const deletePatient = async (patientId: number): Promise<void> => {
  const db = await getDBConnection();
  try {
    await db.transactionAsync(async (tx: { executeSqlAsync: (arg0: string, arg1: number[]) => any; }) => {
      const result = await tx.executeSqlAsync(
        'DELETE FROM PATIENTS WHERE id = ?',
        [patientId]
      );
      console.log('Patient deleted successfully');
    });
  } catch (error) {
    console.error('Error deleting patient', error);
    throw error;
  }
};


//getPatients
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
export const updatePatient = async (patient: {
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
}): Promise<void> => {
  const db = await getDBConnection();
  
  try {
    await db.transactionAsync(async (tx: { executeSqlAsync: (arg0: string, arg1: (string | number)[]) => any; }) => {
      await tx.executeSqlAsync(
        'UPDATE PATIENTS SET nom = ?, prenom = ?, age = ?, marie = ?, region = ?, district_sanitaire = ?, formation_sanitaire = ?, niveau_instruction = ?, profession_femme = ?, profession_mari = ?, adresse = ?, commune = ?, date_dernier_accouchement = ?, nombre_enfants_vivants = ?, gestite = ?, parite = ?, ddr = ?, dpa = ?, cpn1 = ?, rappel = ? WHERE id = ?',
        [
          patient.nom, patient.prenom, patient.age, patient.marie, patient.region, patient.district_sanitaire,
          patient.formation_sanitaire, patient.niveau_instruction, patient.profession_femme, patient.profession_mari,
          patient.adresse, patient.commune, patient.date_dernier_accouchement, patient.nombre_enfants_vivants,
          patient.gestite, patient.parite, patient.ddr, patient.dpa, patient.cpn1 ? 1 : 0, patient.rappel, patient.id
        ]
      );
      console.log('Patient updated successfully');
    });
  } catch (error) {
    console.error('Error updating patient', error);
    throw error;
  }
};
