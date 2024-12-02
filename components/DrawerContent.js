// components/DrawerContent.js

import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Drawer } from 'react-native-paper'; // for the drawer layout
import { MaterialCommunityIcons } from 'react-native-vector-icons'; // for the social icons

export const DrawerContent = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Drawer.Section title="">
        <Drawer.Item label="Camera" onPress={() => navigation.navigate('CameraScreen')} />
        <Drawer.Item label="Photos" onPress={() => navigation.navigate('HomeScreen')} />
        <Drawer.Item label="Deleted Photos" onPress={() => navigation.navigate('Deleted Photos')} />
      </Drawer.Section>

      {/* Follow Us Section */}
      <Drawer.Section title="" style={styles.followUsSection}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="github"
            size={30}
            onPress={() => Linking.openURL('https://github.com/your-profile')} // Replace with your GitHub URL
            style={styles.icon}
          />
          <MaterialCommunityIcons
            name="facebook"
            size={30}
            onPress={() => Linking.openURL('https://www.facebook.com/in/your-profile')} // Replace with your Facebook URL
            style={styles.icon}
          />
          <MaterialCommunityIcons
            name="twitter"
            size={30}
            onPress={() => Linking.openURL('https://www.twitter.com/in/your-profile')} // Replace with your Twitter URL
            style={styles.icon}
          />
          <MaterialCommunityIcons
            name="whatsapp"
            size={30}
            onPress={() => Linking.openURL('https://www.whatsapp.com/in/your-profile')} // Replace with your WhatsApp URL
            style={styles.icon}
          />
        </View>

        {/* Version Text */}
        <Text style={styles.versionText}>Version 1.2.4.0</Text>
      </Drawer.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  followUsSection: {
    marginTop: 20,
    alignItems: 'center',  // Center the icons and text
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  icon: {
    marginHorizontal: 15,
    color: '#000', // You can customize the color as needed
  },
  versionText: {
    fontSize: 14,
    color: '#333', // Color of version text
    marginTop: 15, // Space between icons and text
    textAlign: 'center',
    fontWeight: 'bold', // Make the version text bold
  },
});
