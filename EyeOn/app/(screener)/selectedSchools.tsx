import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';

const Screener = () => {
  const { country, state, district, taluk, selectedSchool } = useLocalSearchParams();
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTesterType, setSelectedTesterType] = useState(null);

  const [totalStudent, setTotalStudent] = useState(885);
  const [primaryScreenedStudents, setPrimaryScreenedStudents] = useState(234);
  const [secondaryScreenedStudents, setSecondaryScreenedStudents] = useState(197);

  const classes = [
    { label: 'Class 1', value: '1' },
    { label: 'Class 2', value: '2' },
    { label: 'Class 3', value: '3' },
    // Add more classes as needed
  ];

  const sections = [
    { label: 'Section A', value: 'A' },
    { label: 'Section B', value: 'B' },
    { label: 'Section C', value: 'C' },
    // Add more sections as needed
  ];

  const testerTypes = [
    { label: 'Primary', value: 'Primary' },
    { label: 'Secondary', value: 'Secondary' },
    { label: 'Tertiary', value: 'Tertiary' },
  ];
  const handlenext = () => {
    if (selectedClass && selectedSection && selectedTesterType) {
        if(selectedTesterType === 'Primary') {
            router.push({
                pathname: '/(screener)/primary/primaryScreener',
                params: {
                  country,
                  state,
                  district,
                  taluk,
                  selectedSchool,
                  selectedClass,
                  selectedSection,
                  selectedTesterType,
                },
              });
        }
        else if(selectedTesterType === 'Secondary') {
            router.push({
                pathname: '/(screener)/secondary/secondaryScreener',
                params: {
                  country,
                  state,
                  district,
                  taluk,
                  selectedSchool,
                  selectedClass,
                  selectedSection,
                  selectedTesterType,
                },
              });
        }
        else{
            router.push({
                pathname: '/(screener)/tertiary/tertiaryScreener',
                params: {
                  country,
                  state,
                  district,
                  taluk,
                  selectedSchool,
                  selectedClass,
                  selectedSection,
                  selectedTesterType,
                },
              });
        }
      
    } else {
      alert('Please select all fields');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedSchool}</Text>
      <Text style={styles.info}>Total Students: {totalStudent}</Text>
      <Text style={styles.info}>Primary Screened Students: {primaryScreenedStudents}</Text>
      <Text style={styles.info}>Secondary Screened Students: {secondaryScreenedStudents}</Text>

      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={classes}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select Class"
        searchPlaceholder="Search..."
        value={selectedClass}
        onChange={item => {
          setSelectedClass(item.value);
        }}
      />

      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={sections}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select Section"
        searchPlaceholder="Search..."
        value={selectedSection}
        onChange={item => {
          setSelectedSection(item.value);
        }}
      />

      <Text style={styles.label}>Select tester type</Text>
    <View style={[styles.radioButtonContainer, styles.box]}>
      {testerTypes.map((type, index) => (
        <TouchableOpacity
        key={index}
        style={styles.radioButton}
        onPress={() => setSelectedTesterType(type.value)}
        >
        <View
          style={[
            styles.radioButtonIcon,
            {
            borderColor: selectedTesterType === type.value ? '#007AFF' : '#ccc',
            },
          ]}
        >
          {selectedTesterType === type.value && <View style={styles.radioButtonInnerIcon} />}
        </View>
        <Text style={styles.radioButtonText}>{type.label}</Text>
        </TouchableOpacity>
      ))}
    </View>

      <TouchableOpacity style={styles.nextButton} onPress={handlenext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  dropdown: {
    marginVertical: 10,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
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
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  radioButtonContainer: {
    marginVertical: 20,
    // padding: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  radioButtonIcon: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInnerIcon: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  radioButtonText: {
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#8F73E2',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    width: 150,
  },
  nextButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
box: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
},
});

export default Screener;
