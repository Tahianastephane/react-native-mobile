import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { getDBConnection, addPatient, getPatients } from '../database/database';

const HomeScreen: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const db = await getDBConnection();
        const patientsList = await getPatients(db); 
        setPatients(patientsList);
      } catch (error) {
        console.error('Error fetching patients', error);
      }
    };

    fetchPatients();
  }, []);

  const handleAddPatient = async () => {
    try {
      const db = await getDBConnection();
      await addPatient(db, {
        nom: 'Doe',
        prenom: 'Jane',
        age: 30,
        marie: 'Non',
        region: 'Region1',
        district_sanitaire: 'District1',
        formation_sanitaire: 'Formation1',
        niveau_instruction: 'Niveau1',
        profession_femme: 'Profession1',
        profession_mari: 'Profession2',
        adresse: 'Adresse1',
        commune: 'Commune1',
        date_dernier_accouchement: '2023-01-01',
        nombre_enfants_vivants: 1,
        gestite: 2,
        parite: 1,
        ddr: '2023-02-01',
        dpa: '2023-10-01',
        cpn1: true,
        rappel: '2023-09-01'
      });
      const updatedPatients = await getPatients(db); 
      setPatients(updatedPatients);
    } catch (error) {
      console.error('Error adding patient', error);
    }
  };

  return (
    <View>
      <Text>Liste des Patients</Text>
      <Button title="Ajouter Patient" onPress={handleAddPatient} />
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.nom} {item.prenom}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default HomeScreen;
