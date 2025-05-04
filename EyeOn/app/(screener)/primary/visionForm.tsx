import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '@env';

const VisionScreen = () => {
  const { satsId, studentName, studentParent, studentREVision, studentLEVision, selectedSchoolpk, selectedClass, selectedSection, selectedSchoolName } = useLocalSearchParams();
  const router = useRouter();

  const [reVisionLeft, setReVisionLeft] = useState('6');
  const [reVisionRight, setReVisionRight] = useState('6');
  const [leVisionLeft, setLeVisionLeft] = useState('6');
  const [leVisionRight, setLeVisionRight] = useState('6');
  const [reVision, setReVision] = useState('6/6');
  const [leVision, setLeVision] = useState('6/6');
  const [loading, setLoading] = useState(false); // Add loading state

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
    setLoading(true); // Set loading to true before form submission

    try {
      const response = await fetch(`${API_URL}/primaryScreeningSubmitForm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ satsId, reVision: `${reVisionLeft}/${reVisionRight}`, leVision: `${leVisionLeft}/${leVisionRight}` })
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
    } finally {
      setLoading(false); // Set loading to false after form submission
    }

    Alert.alert('Primary Vision form submitted successfully.');

    router.replace({
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
      <Text style={styles.label}>Student Name: {studentName}</Text>
      <Text style={styles.parentlabel}>Parent Name: {studentParent}</Text>

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

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      )}
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
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  parentlabel: {
    fontSize: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    // marginLeft: 50,
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
    loadingIndicator: {
      marginTop: 20,
    },
});

export default VisionScreen;
