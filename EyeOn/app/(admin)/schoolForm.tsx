import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_URL } from '@env';

interface LabelInputProps {
    label: string;
    required?: boolean;
    error?: string;
    [key: string]: any;
  }

export default function SchoolForm() {
  const router = useRouter(); 
  const {country,state,district,taluk,postalcodepk,postalcode} = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [schoolCode, setSchoolCode] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [HMName, setHMName] = useState('');
  const [HMCN, setHMCN] = useState('');
  const [distance, setDistance] = useState('');
  const [schoolEmail, setSchoolEmail] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const submitForm = async()=>{
    setLoading(true);
    try{
          const response = await fetch(`${API_URL}/add-school`, {
          method:'POST',
          headers:{
            'Content-Type':'application/json',
          },
          body: JSON.stringify({
            schoolCode,
            schoolName,
            HMName,
            HMCN,
            distance,
            postalcodepk,
            schoolEmail
        })
        });
        const res = await response.json();
        if(res.success){
          router.push({
            pathname: '/schoolDetails',
            params: {
              country,
              state,
              district,
              schoolName,
              schoolpk:res.schoolpk,
              taluk,
              postalcode
            },
          });
        }
        else{
          Alert.alert('Error',res.message);
        }
      } catch(err){
        Alert.alert('Error','Something went wrong. Please try again.');
      }
      finally{
        setLoading(false);
      }
  }

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!schoolCode.trim()) newErrors.schoolCode = 'Please Enter Unique School Code.';
    if (!schoolName.trim()) newErrors.schoolName = 'Please Enter School Name.';
    if (!HMName.trim()) newErrors.HMName = 'Please Enter Headmaster\'s name.';
    if (!/^\d{10}$/.test(HMCN.trim())) newErrors.HMCN = 'Contact number required 10 digits.';
    if (!distance.trim() || isNaN(Number(distance))) newErrors.distance = 'Distance must be a valid number.';
    if (schoolEmail.trim() && !schoolEmail.includes('@')) newErrors.schoolEmail = 'Email must contain "@"';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
    setShowConfirm(true);
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
        label="Distance (in Km)"
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
        error={errors.schoolEmail}
      />

      <Text style={styles.requiredNote}>*Required</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
      {showConfirm && (
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Confirm Submission</Text>
      <Text style={styles.modalMessage}>
      Please confirm that the school's location — country, state, district, and taluk — is correct.  
      You will not be able to edit the location later, but you can still edit the other school details.
      </Text>
      <View style={styles.modalButtons}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowConfirm(false)}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() => {
            setShowConfirm(false);
            submitForm();
          }}
        >
        <Text style={styles.saveText}>Confirm</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  </View>
)}

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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
