import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_URL } from '@env';

interface LabelInputProps {
  label: string;
  required?: boolean;
  error?: string;
  [key: string]: any;
}


export default function SchoolUpdateForm() {
  const router = useRouter();
  const { country, state, district, taluk, schoolpk, schoolName:initSchoolName,schoolCode:initSchoolCode,HMName:initHMName,HMCN:initHMCN,distance:intDistance,schoolEmail:initSchoolEmail,postalcode} = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const getString = (val: string | string[] | undefined): string =>  Array.isArray(val) ? val[0] : val ?? '';
  const [schoolCode, setSchoolCode] = useState(getString(initSchoolCode));
  const [schoolName, setSchoolName] = useState(getString(initSchoolName));
  const [HMName, setHMName] = useState(getString(initHMName));
  const [HMCN, setHMCN] = useState(getString(initHMCN));
  const [distance, setDistance] = useState(getString(intDistance));
  const [schoolEmail, setSchoolEmail] = useState(getString(initSchoolEmail));
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
    
  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!schoolCode.trim()) newErrors.schoolCode = 'School Code is required.';
    if (!schoolName.trim()) newErrors.schoolName = 'School Name is required.';
    if (!HMName.trim()) newErrors.HMName = 'Headmaster Name is required.';
    if (!HMCN.trim()) newErrors.HMCN = 'Contact Number (HM) is required.';
    if (!distance.trim() || isNaN(Number(distance))) newErrors.distance = 'Distance must be a valid number.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/update-school`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schoolCode,
          schoolName,
          HMName,
          HMCN,
          distance,
          schoolpk,
          schoolEmail
        }),
      });

      const res = await response.json();
      if (res.success) {
        Alert.alert('Success', 'School updated successfully.', [
          { text: 'OK',
            onPress: () => 
                router.replace({
                    pathname:'/schoolDetails',
                    params:{
                        schoolName, 
                        schoolpk, 
                        country:String(country),
                        state:String(state),
                        district:String(district),
                        taluk:String(taluk),
                        postalcode
                    }
                })
            },
        ]);
      } else {
        Alert.alert('Error', res.message);
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading && (
            <View style={styles.loadingOverlay}>
              <View style={styles.loadingBox}>
                <Text style={styles.loadingText}>Please wait…</Text>
              </View>
            </View>
          )}
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.label}>Country: {country}</Text>
        <Text style={styles.label}>State: {state}</Text>
        <Text style={styles.label}>District: {district}</Text>
        <Text style={styles.label}>Taluk: {taluk}</Text>
      </View>

      <LabelInput
        label="School Code"
        required
        value={schoolCode}
        onChangeText={(text: string) => setSchoolCode(text.replace(/[^0-9]/g, ''))}
        keyboardType="numeric"
        error={errors.schoolCode}
      />

      <LabelInput
        label="School Name"
        required
        value={schoolName}
        onChangeText={(text: string) => setSchoolName(text)}
        error={errors.schoolName}
      />

      <LabelInput
        label="Headmaster Name"
        required
        value={HMName}
        onChangeText={(text: string) => setHMName(text)}
        error={errors.HMName}
      />

      <LabelInput
        label="Contact Number (HM)"
        required
        value={HMCN}
        onChangeText={(text: string) => setHMCN(text)}
        keyboardType="numeric"
        error={errors.HMCN}
      />

      <LabelInput
        label="Distance"
        required
        value={distance}
        onChangeText={(text: string) => setDistance(text)}
        keyboardType="numeric"
        error={errors.distance}
      />

      <LabelInput
        label="School email"
        value={schoolEmail}
        onChangeText={(text: string) => setSchoolEmail(text)}
        keyboardType="email-address"
      />

      <Text style={styles.requiredNote}>*Required</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
          <Text style={styles.saveText}>Update</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const LabelInput = ({ label, required, error, ...props }: LabelInputProps) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>
      {label}
      {required && <Text style={styles.required}> *</Text>}
    </Text>
    <TextInput style={styles.input} {...props} />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  required: {
    color: 'red',
  },
  input: {
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  requiredNote: {
    fontSize: 12,
    color: 'red',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    backgroundColor: '#c9a9f2',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cancelText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: '#a18ae8',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  loadingBox: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 6,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
  },  
});
