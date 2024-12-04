import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent } from './components/DrawerContent'; // Custom DrawerContent
import HomeScreen from './screens/HomeScreen';
import DeletedPhotosScreen from './screens/DeletedPhotosScreen';
import CameraScreen from './screens/CameraScreen';
import LocationScreen from './screens/LocationScreen'; // Import LocationScreen
import * as SQLite from 'expo-sqlite';

const Drawer = createDrawerNavigator();

const App = () => {

 

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} />}
      >
        <Drawer.Screen name="Gallery" component={HomeScreen} />
        <Drawer.Screen name="Deleted Photos" component={DeletedPhotosScreen} />
        <Drawer.Screen name="Camera" component={CameraScreen} />
        {/* Add the Location screen to the Drawer */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
