import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent } from './components/DrawerContent'; // Custom DrawerContent
import HomeScreen from './screens/HomeScreen';
import DeletedPhotosScreen from './screens/DeletedPhotosScreen';
import CameraScreen from './screens/CameraScreen';

const Drawer = createDrawerNavigator();

const App = () => {
  
 const getAllImages = async (db) => {
    try {
      const images = await db.getAllAsync(
        `SELECT * FROM images;`  // Query to get all images
      );
      // console.log('Retrieved images:', images); // Debug log
      return images;
    } catch (error) {
      console.error('Error retrieving images:', error);
      return [];
    }
  };
  
  
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
