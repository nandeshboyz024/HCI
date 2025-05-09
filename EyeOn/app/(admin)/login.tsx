import {API_URL} from "@env";
import {useState} from 'react';
import {useRouter} from 'expo-router';

import {ActivityIndicator, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername]= useState('nandeshboyz');
  const [password, setPassword] = useState('12345678');
  const [loading,setLoading] = useState(false);
  
  const handleLogin = async()=>{
    if(loading) return;
    if (!username.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please enter both username and password.');
      return;
    }
    setLoading(true);
    try{
        const response = await fetch(`${API_URL}/varify-admin`, {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify({username,password})
      });
      const data = await response.json();
      if(data.success){
        router.push('/schoolScreen');
      }
      else{
        Alert.alert('Error',data.message);
      }
    } catch(err){
      Alert.alert('Error','Something went wrong. Please try again.');
    } finally{
      setLoading(false);
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin</Text>

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {loading?(
        <ActivityIndicator size="large" style={styles.loader} />
        ):(
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )
      }
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    backgroundColor: '#D3D3D3',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#8F73E2',
    paddingVertical: 15,
    width: 250,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  loader:{
    width:250,
    alignSelf:'center'
  }
});