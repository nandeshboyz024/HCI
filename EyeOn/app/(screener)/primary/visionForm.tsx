import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { API_URL } from '@env';

const VisionScreen = () => {
  const { satsId, studentName, studentParent, studentREVision, studentLEVision , selectedSchoolpk, selectedClass, selectedSection, selectedSchoolName } = useLocalSearchParams();
  const router = useRouter();

  const [reVisionLeft, setReVisionLeft] = useState('6');
  const [reVisionRight, setReVisionRight] = useState('6');
  const [leVisionLeft, setLeVisionLeft] = useState('6');
  const [leVisionRight, setLeVisionRight] = useState('6');
  const [reVision, setReVision] = useState('6/6');
  const [leVision, setLeVision] = useState('6/6');

  const showNotification = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };


  useEffect(() => {
    if (studentREVision) {
      const [left, right] = studentREVision.split('/');
      setReVisionLeft(left);
      setReVisionRight(right);
    }
    if (studentLEVision) {
      const [left, right] = studentLEVision.split('/');
      setLeVisionLeft(left);
      setLeVisionRight(right);
    }
  }, [studentREVision, studentLEVision]);


  const handleSubmit = async () => {
     // Navigate back to the previous screen
  
    // Handle the submit action here
    // setReVision(`${reVisionLeft}/${reVisionRight}`);
    // setLeVision(`${leVisionLeft}/${leVisionRight}`);
  
    try {
      const response = await fetch(`${API_URL}/primaryScreeningSubmitForm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ satsId, reVision : `${reVisionLeft}/${reVisionRight}`, leVision : `${leVisionLeft}/${leVisionRight}`  })
      });
  
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Extract the student's name from the response data
          const studentName = result.data[0]?.StudentName || 'Unknown';
          // Show notification with the person's name
          showNotification(`Primary Screening done successfully for ${studentName}`);
        } else {
          console.error('Form submission failed:', result.message);
        }
      } else {
        console.error('Failed to submit form:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    Alert.alert('Success', 'Primary Vision form submitted successfully.');

    router.push({
                    pathname: '/(screener)/primary/primaryScreener',
                    params: {
                      selectedSchoolpk,
                      selectedClass,
                      selectedSection,
                      selectedSchoolName
                    },
                  });

  };  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Primary Screening</Text>
      <Text style={styles.label}>Name: {studentName}</Text>
      <Text style={styles.label}>Parent: {studentParent}</Text>

      <Text style={styles.sectionTitle}>RE Vision</Text>
      <View style={styles.visionInputContainer}>
        <TextInput
          style={styles.visionInput}
          value={reVisionLeft}
          onChangeText={(text) => setReVisionLeft(text)}
          keyboardType="numeric"
        />
        <Text style={styles.visionSeparator}>/</Text>
        <TextInput
          style={styles.visionInput}
          value={reVisionRight}
          onChangeText={(text) => setReVisionRight(text)}
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.sectionTitle}>LE Vision</Text>
      <View style={styles.visionInputContainer}>
        <TextInput
          style={styles.visionInput}
          value={leVisionLeft}
          onChangeText={(text) => setLeVisionLeft(text)}
          keyboardType="numeric"
        />
        <Text style={styles.visionSeparator}>/</Text>
        <TextInput
          style={styles.visionInput}
          value={leVisionRight}
          onChangeText={(text) => setLeVisionRight(text)}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
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
  label: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  visionInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  visionInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 16,
    marginHorizontal: 5,
  },
  visionSeparator: {
    fontSize: 16,
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: '#8F73E2',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    width: 150,
  },
  submitButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default VisionScreen;
