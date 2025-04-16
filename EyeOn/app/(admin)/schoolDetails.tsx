import React, { useState, useEffect } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { API_URL } from '@env';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

type schoolObj = {
  HMName: string;
  HMCN: string;
  SchoolCode: string;
  SchoolEmail:string|null;
};

export default function SchoolDetails() {
    const {schoolName, schoolpk, taluk, postalcode} = useLocalSearchParams();
    const [school,setSchool] = useState<schoolObj|null>(null);
    const [HMName,setHMName] = useState(null);
    const [HMCN,setHMCN] = useState(null);
    const [SchoolCode,setSchoolCode] = useState(null);
    const [SchoolEmail,setSchoolEmail]=useState(null);
    const [TotalStudents,setTotalStudents]=useState(null);

    useEffect(() => {
          const fetchSchools = async () => {
            try {
              const response = await fetch(`${API_URL}/get-school`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ schoolpk })
              });
              const res = await response.json();
              if(res.success){
                setSchool(res.data);
              }
            } catch (err) {
              console.error("Error fetching school:", err);
            }
          };
          const fetchTotalStudents = async()=> {
            try{
            
            const response = await fetch(`${API_URL}/get-total-students`,{
              method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ schoolpk })
            })
            const res = await response.json();
            if(res.success){
              setTotalStudents(res.data.TotalStudents);
            }
            }catch(err){
              console.error("Error fetching TotalStudents:", err);
            }
          }
          fetchSchools();
          fetchTotalStudents();
        }, [schoolpk]);

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const pickedFile = result.assets[0];
      if (!pickedFile.name.toLowerCase().endsWith('.csv')) {
        alert('Please select a CSV file only.');
        return;
      }
      else{
        const file = {
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: 'text/csv',
        };
        const formData = new FormData();
        formData.append('file', file as any);
        formData.append('schoolpk',schoolpk as any);
        const response = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });
        const data = await response.json();
        console.log('Upload response:', data);
      }
      } catch (error) {
        console.error('File upload error:', error);
      }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`${API_URL}/download-students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolpk }),
      });
  
      const csv = await response.text();
  
      const fileUri = FileSystem.documentDirectory + `students_${schoolpk}.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });
  
      if (!(await Sharing.isAvailableAsync())) {
        alert('Sharing not available on this device');
        return;
      }
      await Sharing.shareAsync(fileUri);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download student CSV.');
    }
  };

  
  return (
    <View style={styles.container}>
      <Text style={styles.schoolName}>{schoolName}</Text>
      <Text style={styles.uploadedText}>
        Total student uploaded : <Text style={{ color: '#5a3ff0', fontWeight: 'bold' }}>{TotalStudents?TotalStudents:"Loading..."}</Text>
      </Text>

      <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
        <Ionicons name="download-outline" size={24} color="white" />
      </TouchableOpacity>


      <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
        <Ionicons name="add-circle-outline" size={20} color="black" />
        <Text style={styles.uploadText}>Upload Spreadsheet (.csv)</Text>
      </TouchableOpacity>

      {school ?
      (
        <View style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <Ionicons name="person-circle-outline" size={22} color="black" />
            <Text style={styles.detailsTitle}>Details</Text>
            <MaterialIcons name="edit" size={18} color="black" style={{ marginLeft: 'auto' }} />
        </View>
        <View style={styles.detailBody}>
          <Text>Headmaster:{school?.HMName}</Text>
          <Text>Contact: {school?.HMCN}</Text>
          <Text>School Code: {school?.SchoolCode}</Text>
          <Text>Taluk: {taluk}</Text>
          <Text>District Code: {postalcode}</Text>
          <Text>Email: {school?.SchoolEmail}</Text>
        </View>
      </View>
      ) : (
        <Text>Loading school details...</Text>
      )}

        

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  schoolName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  uploadedText: {
    textAlign: 'center',
    marginVertical: 8,
  },
  downloadBtn: {
    alignSelf: 'center',
    backgroundColor: '#b9aaff',
    borderRadius: 10,
    padding: 6,
    marginBottom: 12,
  },
  uploadBtn: {
    flexDirection: 'row',
    backgroundColor: '#c9dff3',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  detailsCard: {
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    padding: 12,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  detailBody: {
    marginTop: 4,
    paddingLeft: 4,
  },
});
