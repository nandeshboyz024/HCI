import React, { useState } from 'react';
import {API_URL} from "@env";
import {useRouter} from 'expo-router';
import { View, Text, TextInput, StyleSheet,ActivityIndicator, TouchableOpacity, Alert} from 'react-native';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [loading,setLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    username:'',
    currentPassword:'',
    newPassword:'',
    confirmPassword:''
  });

  const validate = () => {
    let valid = true;
    let tempErrors = {
      username: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  
    const alphanumericRegex = /^[A-Za-z0-9]+$/;
  
    if (!username.trim()) {
      tempErrors.username = 'Username is required';
      valid = false;
    }
    if (!currentPassword) {
      tempErrors.currentPassword = 'Current password is required';
      valid = false;
    }
    if (!newPassword) {
      tempErrors.newPassword = 'New password is required';
      valid = false;
    } else if (newPassword.length < 6 || newPassword.length > 10) {
      tempErrors.newPassword = 'Password must be between 6 and 10 characters long';
      valid = false;
    } else if (!alphanumericRegex.test(newPassword)) {
      tempErrors.newPassword = 'Password must be alphanumeric only (A-Z, a-z, 0-9)';
      valid = false;
    }
    if (!confirmPassword) {
      tempErrors.confirmPassword = 'Please confirm your new password';
      valid = false;
    } else if (confirmPassword !== newPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }
  
    setErrors(tempErrors);
    return valid;
  };
  


  const handleSubmit = async() => {
    if (!validate()) return;
    setLoading(true);
    try{
      const response = await fetch(`${API_URL}/change-admin-password`, {
              method:'POST',
              headers:{
                'Content-Type':'application/json',
              },
              body: JSON.stringify({username,currentPassword,newPassword})
            });
            const data = await response.json();
            if(data.success){
              Alert.alert('Success',data.message);
              setUsername('');
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              setErrors({
                          username: '',
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
            }
            else{
              Alert.alert('Error',data.message);
            }
    }
    catch(err){
      console.error(err);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
    finally{
      setLoading(false);
    }
  }

  return (  
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter username"
        placeholderTextColor="#aaa"
      />
      {errors.username && <Text style={styles.error}>{errors.username}</Text>}

      <Text style={styles.label}>Current Password</Text>
      <TextInput
        style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
        placeholder="Enter current password"
        placeholderTextColor="#aaa"
      />
      {errors.currentPassword && <Text style={styles.error}>{errors.currentPassword}</Text>}

      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        placeholder="Enter new password"
        placeholderTextColor="#aaa"
      />
      {errors.newPassword && <Text style={styles.error}>{errors.newPassword}</Text>}

      <Text style={styles.label}>Confirm New Password</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="Confirm new password"
        placeholderTextColor="#aaa"
      />
      {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}
      {loading?(
        <ActivityIndicator size="large" style={styles.loader} />
      ):
      (
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    )
    }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    color: '#000',
  },
  error: {
    color: 'red',
    marginBottom: 12,
    fontSize: 12,
  },
  button: {
    backgroundColor: '#A084E8',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  loader:{
    width:250,
    alignSelf:'center'
  },
});