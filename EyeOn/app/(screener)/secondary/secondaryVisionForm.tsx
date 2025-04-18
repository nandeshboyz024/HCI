import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select';
import { API_URL } from '@env';

const VisionForm = () => {
  const {
    selectedSchoolpk,
    selectedClass,
    selectedSection,
    selectedSchoolName,
    satsId,
    studentName,
    studentParent,
      studentRightEyeSPH,
        studentRightEyeCyl,
        studentRightEyeAxis,
        studentRightEyeVision,
        studentLeftEyeSPH,
        studentLeftEyeCyl,
        studentLeftEyeAxis,
        studentLeftEyeVision,
    selectedRefractiveError,
    selectedSpectaclesFrameCode,
    selectedMobileNumber,
  } = useLocalSearchParams();

  const router = useRouter();

  // console.log("ye data:"  , studentRightEye);

  const [rightEyeSph, setRightEyeSph] = useState(studentRightEyeSPH || '');
  const [rightEyeCyl, setRightEyeCyl] = useState(studentRightEyeCyl || '');
  const [rightEyeAxis, setRightEyeAxis] = useState(studentRightEyeAxis || '');
  const [rightEyeVision, setRightEyeVision] = useState(studentRightEyeVision || '');

  const [leftEyeSph, setLeftEyeSph] = useState(studentLeftEyeSPH || '');
  const [leftEyeCyl, setLeftEyeCyl] = useState(studentLeftEyeCyl || '');
  const [leftEyeAxis, setLeftEyeAxis] = useState(studentLeftEyeAxis || '');
  const [leftEyeVision, setLeftEyeVision] = useState(studentLeftEyeVision || '');

  const [mobileNumber, setMobileNumber] = useState(selectedMobileNumber || '');
  const [refractiveError, setRefractiveError] = useState(selectedRefractiveError || '');
  const [spectaclesFrameCode, setSpectaclesFrameCode] = useState(selectedSpectaclesFrameCode || '');

  const handleSubmit = async () => {
    if (!rightEyeSph || !rightEyeCyl || !rightEyeAxis || !rightEyeVision ||
        !leftEyeSph || !leftEyeCyl || !leftEyeAxis || !leftEyeVision ||
        !mobileNumber || !refractiveError || !spectaclesFrameCode) {
      Alert.alert('Error', 'All fields are mandatory.');
      return;
    }

    const visionData = {
      satsId,
      rightEyeSPH: parseFloat(rightEyeSph),
      rightEyeCYL: parseFloat(rightEyeCyl),
      rightEyeAXIS: parseInt(rightEyeAxis, 10),
      rightEyeVision,
      leftEyeSPH: parseFloat(leftEyeSph),
      leftEyeCYL: parseFloat(leftEyeCyl),
      leftEyeAXIS: parseInt(leftEyeAxis, 10),
      leftEyeVision,
      mobileNumber,
      refractiveError,
      spectaclesFrameCode,
    };

    try {
      const response = await fetch(`${API_URL}/secondaryScreeningSubmitForm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visionData),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          Alert.alert('Success', 'Vision form submitted successfully.');
          router.push({
                          pathname: '/(screener)/secondary/secondaryScreener',
                          params: {
                            selectedSchoolpk,
                            selectedClass,
                            selectedSection,
                            selectedSchoolName
                          },
                        }); // Navigate back to the previous screen
        } else {
          Alert.alert('Error', 'Failed to submit vision form.');
        }
      } else {
        Alert.alert('Error', 'Failed to submit vision form.');
      }
    } catch (error) {
      console.error('Error submitting vision form:', error);
      Alert.alert('Error', 'Failed to submit vision form.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* <Text style={styles.title}>Secondary Evaluation</Text> */}
      <Text style={styles.name}>Name: {studentName}</Text>
      <Text style={styles.name}>Parent Name: {studentParent}</Text>

      <Text style={styles.sectionTitle}>Right Eye</Text>
      <Text style={styles.label}>SPH</Text>
      <TextInput
        style={styles.input}
        placeholder="SPH"
        value={rightEyeSph}
        onChangeText={setRightEyeSph}
        keyboardType="numeric"
      />
      <Text style={styles.label}>CYL</Text>
      <TextInput
        style={styles.input}
        placeholder="CYL"
        value={rightEyeCyl}
        onChangeText={setRightEyeCyl}
        keyboardType="numeric"
      />
      <Text style={styles.label}>AXIS</Text>
      <TextInput
        style={styles.input}
        placeholder="AXIS"
        value={rightEyeAxis}
        onChangeText={setRightEyeAxis}
        keyboardType="numeric"
      />
      <Text style={styles.label}>VISION</Text>
      <TextInput
        style={styles.input}
        placeholder="VISION"
        value={rightEyeVision}
        onChangeText={setRightEyeVision}
        keyboardType="default"
      />

      <Text style={styles.sectionTitle}>Left Eye</Text>
      <Text style={styles.label}>SPH</Text>
      <TextInput
        style={styles.input}
        placeholder="SPH"
        value={leftEyeSph}
        onChangeText={setLeftEyeSph}
        keyboardType="numeric"
      />
      <Text style={styles.label}>CYL</Text>
      <TextInput
        style={styles.input}
        placeholder="CYL"
        value={leftEyeCyl}
        onChangeText={setLeftEyeCyl}
        keyboardType="numeric"
      />
      <Text style={styles.label}>AXIS</Text>
      <TextInput
        style={styles.input}
        placeholder="AXIS"
        value={leftEyeAxis}
        onChangeText={setLeftEyeAxis}
        keyboardType="numeric"
      />
      <Text style={styles.label}>VISION</Text>
      <TextInput
        style={styles.input}
        placeholder="VISION"
        value={leftEyeVision}
        onChangeText={setLeftEyeVision}
        keyboardType="default"
      />

      <Text style={styles.sectionTitle}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
      />

      <Text style={styles.sectionTitle}>Spectacles Frame Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Spectacles Frame Code"
        value={spectaclesFrameCode}
        onChangeText={setSpectaclesFrameCode}
        keyboardType="default"
      />

      <Text style={styles.sectionTitle}>Refractive Error</Text>
      <View style={styles.box}>
        <RNPickerSelect
          style={styles.picker}
          placeholder={{ label: 'Select Error', value: null }}
          items={[
            { label: 'Myopia', value: 'Myopia' },
            { label: 'Astigmatism', value: 'Astigmatism' },
            { label: 'Myopic Astigmatism', value: 'Myopic Astigmatism' },
            { label: 'Hypermetropia', value: 'Hypermetropia' },
          ]}
          onValueChange={(value) => setRefractiveError(value)}
          value={refractiveError}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
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
    // textAlign: 'center',
  },
  name: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  box: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 2,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  picker: {
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 20,
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

export default VisionForm;
