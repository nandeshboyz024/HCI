import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Dropdown } from 'react-native-element-dropdown';

const SchoolList = () => {
  const { country, state, district, taluk } = useLocalSearchParams();
  const [selectedSchool, setSelectedSchool] = useState(null);

  console.log(country, state, district, taluk);
  console.log("ha ha");

  if (!country || !state || !district || !taluk) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>No filters selected</Text>
      </View>
    );
  }

  console.log("me yanah hu ");

  // Example data: List of schools based on the selected filters
  const schools = [
    { name: 'School 1', location: `${taluk}, ${district}, ${state}, ${country}` },
    { name: 'School 2', location: `${taluk}, ${district}, ${state}, ${country}` },
    // Add more schools as needed
  ];

  const handleSchoolSelect = (value) => {
    setSelectedSchool(value);
  };

  const handleGoToSchool = () => {
    if (selectedSchool) {
      // Navigate to the selected school or perform any other action
      console.log(`Navigating to ${selectedSchool}`);
    } else {
      console.log('Please select a school first');
    }
  };

  return (
    <>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.label}>Country: {country}</Text>
        <Text style={styles.label}>State: {state}</Text>
        <Text style={styles.label}>District: {district}</Text>
        <Text style={styles.label}>Taluk: {taluk}</Text>
      </View>

      <View style={styles.container}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={schools.map((school) => ({ label: school.name, value: school.name }))}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select a School"
          searchPlaceholder="Search..."
          value={selectedSchool}
          onChange={item => {
            handleSchoolSelect(item.value);
          }}
        />
        <TouchableOpacity style={styles.button} onPress={handleGoToSchool}>
          <Text style={styles.buttonText}>Go to School</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    // justifyContent: 'top',
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
