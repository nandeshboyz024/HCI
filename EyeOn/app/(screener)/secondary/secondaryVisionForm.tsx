import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select';

const VisionForm = () => {
  const { studentId, studentName, studentParent } = useLocalSearchParams();
  const router = useRouter();

  const [rightEyeSph, setRightEyeSph] = useState('');
  const [rightEyeCyl, setRightEyeCyl] = useState('');
  const [rightEyeAxis, setRightEyeAxis] = useState('');
  const [rightEyeVision, setRightEyeVision] = useState('');

  const [leftEyeSph, setLeftEyeSph] = useState('');
  const [leftEyeCyl, setLeftEyeCyl] = useState('');
  const [leftEyeAxis, setLeftEyeAxis] = useState('');
  const [leftEyeVision, setLeftEyeVision] = useState('');

  const [mobileNumber, setMobileNumber] = useState('');
  const [refractiveError, setRefractiveError] = useState('');
const [spectaclesFrameCode, setSpectaclesFrameCode] = useState('');
  const handleSubmit = () => {
    if (!rightEyeSph || !rightEyeCyl || !rightEyeAxis || !rightEyeVision ||
        !leftEyeSph || !leftEyeCyl || !leftEyeAxis || !leftEyeVision ||
        !mobileNumber || !refractiveError || !spectaclesFrameCode) {
      Alert.alert('Error', 'All fields are mandatory.');
      return;
    }

    const visionData = {
      rightEye: {
        sph: rightEyeSph,
        cyl: rightEyeCyl,
        axis: rightEyeAxis,
        vision: rightEyeVision,
      },
      leftEye: {
        sph: leftEyeSph,
        cyl: leftEyeCyl,
        axis: leftEyeAxis,
        vision: leftEyeVision,
      },
      mobileNumber,
    spectaclesFrameCode,
      refractiveError,
    };

    // router.push({
    //   pathname: '/nextPage', // Replace with the actual path to the next page
    //   params: {
    //     studentId,
    //     studentName,
    //     studentParent,
    //     visionData,
    //   },
    // });
    router.back(); // Navigate back to the previous screen
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Secondary Evaluation</Text>
      <Text style={styles.label}>Name: {studentName}</Text>
      <Text style={styles.label}>Parent: {studentParent}</Text>

      <Text style={styles.sectionTitle}>Right Eye</Text>
      <TextInput
        style={styles.input}
        placeholder="SPH"
        value={rightEyeSph}
        onChangeText={setRightEyeSph}
        keyboardType="default"
      />
      <TextInput
        style={styles.input}
        placeholder="CYL"
        value={rightEyeCyl}
        onChangeText={setRightEyeCyl}
        keyboardType="default"
      />
      <TextInput
        style={styles.input}
        placeholder="AXIS"
        value={rightEyeAxis}
        onChangeText={setRightEyeAxis}
        keyboardType="default"
      />
      <TextInput
        style={styles.input}
        placeholder="VISION"
        value={rightEyeVision}
        onChangeText={setRightEyeVision}
        keyboardType="default"
      />

      <Text style={styles.sectionTitle}>Left Eye</Text>
      <TextInput
        style={styles.input}
        placeholder="SPH"
        value={leftEyeSph}
        onChangeText={setLeftEyeSph}
        keyboardType="default"
      />
      <TextInput
        style={styles.input}
        placeholder="CYL"
        value={leftEyeCyl}
        onChangeText={setLeftEyeCyl}
        keyboardType="default"
      />
      <TextInput
        style={styles.input}
        placeholder="AXIS"
        value={leftEyeAxis}
        onChangeText={setLeftEyeAxis}
        keyboardType="default"
      />
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

      <Text style={styles.sectionTitle}>Spectacles frame code </Text>
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
        <Text style={styles.submitButtonText}>Next</Text>
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
