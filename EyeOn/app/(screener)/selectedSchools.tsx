import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import Footer from './footer'; // Import the Footer component
import { API_URL } from '@env';

const Screener = () => {
  const { country, state, district, taluk, talukcode, selectedSchoolName, selectedSchoolpk } = useLocalSearchParams();

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTesterType, setSelectedTesterType] = useState(null);

  const [totalStudent, setTotalStudent] = useState(0);
  const [primaryScreenedStudents, setPrimaryScreenedStudents] = useState(0);
  const [secondaryScreenedStudents, setSecondaryScreenedStudents] = useState(0);

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${API_URL}/getClasses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ schoolpk: selectedSchoolpk })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            const transformedClasses = result.data.map(item => ({
              label: `Class ${item.Class}`,
              value: item.Class
            }));
            setClasses(transformedClasses);
          } else {
            console.error('No data found or API response indicates failure.');
          }
        } else {
          console.error('Failed to fetch classes:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    const fetchTotalStudents = async () => {
      try {
        const response = await fetch(`${API_URL}/getTotalStudentsBySchool`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ schoolpk: selectedSchoolpk })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setTotalStudent(result.data);
          } else {
            console.error('No data found or API response indicates failure.');
          }
        } else {
          console.error('Failed to fetch total students:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching total students:', error);
      }
    };

    const fetchPrimaryScreenedStudents = async () => {
      try {
        const response = await fetch(`${API_URL}/getPrimaryTestedCountStudentsBySchool`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ schoolpk: selectedSchoolpk })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setPrimaryScreenedStudents(result.data);
          } else {
            console.error('No data found or API response indicates failure.');
          }
        } else {
          console.error('Failed to fetch primary screened students:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching primary screened students:', error);
      }
    };

    const fetchSecondaryScreenedStudents = async () => {
      try {
        const response = await fetch(`${API_URL}/getSecondaryTestedCountStudentsBySchool`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ schoolpk: selectedSchoolpk })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setSecondaryScreenedStudents(result.data);
          } else {
            console.error('No data found or API response indicates failure.');
          }
        } else {
          console.error('Failed to fetch secondary screened students:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching secondary screened students:', error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchClasses(),
        fetchTotalStudents(),
        fetchPrimaryScreenedStudents(),
        fetchSecondaryScreenedStudents()
      ]);
      setLoading(false);
    };

    if (selectedSchoolpk) {
      fetchData();
    }
  }, [selectedSchoolpk]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch(`${API_URL}/getSections`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ schoolpk: selectedSchoolpk, className: selectedClass })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            const transformedSections = result.data[0].Sections.map(section => ({
              label: `Section ${section}`,
              value: section
            }));
            setSections(transformedSections);
          } else {
            console.error('No data found or API response indicates failure.');
          }
        } else {
          console.error('Failed to fetch sections:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    };

    if (selectedSchoolpk && selectedClass) {
      fetchSections();
    }
  }, [selectedSchoolpk, selectedClass]);

  const testerTypes = [
    { label: 'Primary', value: 'Primary' },
    { label: 'Secondary', value: 'Secondary' }
  ];

  const handlenext = () => {
    if (selectedClass && selectedSection && selectedTesterType) {
      if (selectedTesterType === 'Primary') {
        router.push({
          pathname: '/(screener)/primary/primaryScreener',
          params: {
            selectedSchoolpk,
            selectedClass,
            selectedSection,
            selectedSchoolName
          },
        });
      } else if (selectedTesterType === 'Secondary') {
        router.push({
          pathname: '/(screener)/secondary/secondaryScreener',
          params: {
            selectedSchoolpk,
            selectedClass,
            selectedSection,
            selectedSchoolName
          },
        });
      }
    } else {
      Alert.alert('Please select all fields');
    }
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
        <Text style={styles.title}>{selectedSchoolName}</Text>
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

        <Text style={styles.label}>Select Screener type</Text>
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
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#000',
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
    backgroundColor: '#007AFF',
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
