import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Dropdown } from 'react-native-element-dropdown';
import Footer from './footer'; // Import the Footer component
import { API_URL } from '@env';

const SchoolList = () => {
  const { country, state, district, taluk, talukcode, postalcode } = useLocalSearchParams();
  const [selectedSchoolName, setSelectedSchoolName] = useState(null);
  const [selectedSchoolpk, setSelectedSchoolpk] = useState<number | null>(null);
  const [schools, setSchools] = useState<[number, string][]>([]);
  const [loading, setLoading] = useState(true); // Add loading state

  console.log(country, state, district, taluk, talukcode, postalcode);

  if (!country || !state || !district || !taluk) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>No filters selected</Text>
      </View>
    );
  }

  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true); // Set loading to true before fetching data
      try {
        const response = await fetch(`${API_URL}/get-schools`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postalcodepk: talukcode })
        });
        const res = await response.json();
        if (res.success) {
          setSchools(res.data);
        }
      } catch (err) {
        console.error("Error fetching schools:", err);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchSchools();
  }, []);

  const handleSchoolSelect = (item) => {
    setSelectedSchoolName(item.value);
    setSelectedSchoolpk(item.code);
  };

  const handleGoToSchool = () => {
    if (!selectedSchoolName) {
      Alert.alert('Please select a school first.');
      return;
    }

    console.log("selectedSchoolpk", selectedSchoolpk);
    // Navigate to the selected school or perform any other action
    router.push({
      pathname: '/(screener)/selectedSchools',
      params: {
        country,
        state,
        district,
        taluk,
        talukcode,
        selectedSchoolpk,
        selectedSchoolName
      },
    });

    console.log(`Navigating to ${selectedSchoolName}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.label}>Country: {country}</Text>
          <Text style={styles.label}>State: {state}</Text>
          <Text style={styles.label}>District: {district}</Text>
          <Text style={styles.label}>Taluk: {taluk}</Text>
        </View>

        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={schools.map(([code, name]) => ({ label: name, value: name, code }))}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select a School"
          searchPlaceholder="Search..."
          value={selectedSchoolName}
          onChange={handleSchoolSelect}
        />

        <TouchableOpacity style={styles.button} onPress={handleGoToSchool}>
          <Text style={styles.buttonText}>Go to School</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    width: 150, // Adjust the width as needed
    height: 40, // Adjust the height as needed
    backgroundColor: '#007AFF', // Customize button color
    borderRadius: 10, // Apply border radius
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center', // Center the button horizontally
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdown: {
    margin: 16,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default SchoolList;
