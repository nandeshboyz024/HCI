// components/Footer.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

const Footer = () => {
  const router = useRouter();

  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => router.push('/FilterSchools')}>
        <Icon name="home" size={30} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/')}>
        <Icon name="sign-out" size={30} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  icon: {
    color: '#000',
  },
});

export default Footer;
