import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const VisionScreen = () => {
  const { studentId, studentName, studentParent, studentREVision, studentLEVision } = useLocalSearchParams();
  const router = useRouter();

  const [reVisionLeft, setReVisionLeft] = useState('6');
  const [reVisionRight, setReVisionRight] = useState('6');
  const [leVisionLeft, setLeVisionLeft] = useState('6');
  const [leVisionRight, setLeVisionRight] = useState('6');

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
    router.back(); // Navigate back to the previous screen

    // Handle the submit action here
    // const visionData = {
    //   reVision: `${reVisionLeft}/${reVisionRight}`,
    //   leVision: `${leVisionLeft}/${leVisionRight}`,
    // };

    // try {
    //   const response = await fetch(`YOUR_API_ENDPOINT/update-vision`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ studentId, visionData }),
    //   });

    //   if (response.ok) {
    //     console.log('Vision data updated successfully');
    //     router.back(); // Navigate back to the previous screen
    //   } else {
    //     console.error('Failed to update vision data');
    //   }
    // } catch (error) {
    //   console.error('Error updating vision data:', error);
    // }
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
          onChangeText={setReVisionLeft}
          keyboardType="numeric"
        />
        <Text style={styles.visionSeparator}>/</Text>
        <TextInput
          style={styles.visionInput}
          value={reVisionRight}
          onChangeText={setReVisionRight}
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.sectionTitle}>LE Vision</Text>
      <View style={styles.visionInputContainer}>
        <TextInput
          style={styles.visionInput}
          value={leVisionLeft}
          onChangeText={setLeVisionLeft}
          keyboardType="numeric"
        />
        <Text style={styles.visionSeparator}>/</Text>
        <TextInput
          style={styles.visionInput}
          value={leVisionRight}
          onChangeText={setLeVisionRight}
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
