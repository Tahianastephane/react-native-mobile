import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import { RootStackParamList } from './types/navigation';
import { getDBConnection, createTables, insertAdmin } from './database/database';

const Stack = createStackNavigator<RootStackParamList>();

export function App() {
  useEffect(() => {
    const initDB = async () => {
      const db = await getDBConnection();
      await createTables(db);
      await insertAdmin(db, 'admin', 'password123');
    };

    initDB();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


