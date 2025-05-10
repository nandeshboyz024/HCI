import React, { useState, useEffect } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { View, Text, TouchableOpacity, StyleSheet, Modal,Pressable, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_URL } from '@env';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';


type SchoolObj = {
  HMName: string;
  HMCN: string;
  SchoolCode: string;
  SchoolEmail: string | null;
  Distance: number;
};


export default function SchoolDetails() {
  const router = useRouter();
  const {
    schoolName,
    schoolpk,
    country,
    state,
    district,
    taluk,
    postalcode,
  } = useLocalSearchParams();


  const [school, setSchool] = useState<SchoolObj | null>(null);
  const [totalStudents, setTotalStudents] = useState<number | null>(null);
  const [primaryScreenedStudents, setPrimaryScreenedStudents] = useState<number | null>(null);
  const [secondaryScreenedStudents, setSecondaryScreenedStudents] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch(`${API_URL}/get-school`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ schoolpk }),
        });
        const res = await response.json();
        if (res.success) setSchool(res.data);
      } catch (err) {
        console.error('Error fetching school:', err);
      }
    };

    const fetchTotalStudents = async () => {
      try {
        const response = await fetch(`${API_URL}/get-total-students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ schoolpk }),
        });
        const res = await response.json();
        if (res.success) {
          setTotalStudents(res.data1.StudentCount);
          setPrimaryScreenedStudents(res.data2.StudentCount);
          setSecondaryScreenedStudents(res.data3.StudentCount);
        }
      } catch (err) {
        console.error('Error fetching TotalStudents:', err);
      }
    };

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
        Alert.alert('Error','Please select a CSV file only.');
        return;
      }

      setUploading(true); // show popup

      const file = {
        uri: pickedFile.uri,
        name: pickedFile.name,
        type: 'text/csv',
      } as any;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('schoolpk', schoolpk as any);

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });
      const data = await response.json();
      setUploading(false); // hide popup
      if(data.success) {
        setTotalStudents(data.totalRecords);
        Alert.alert('Success',`${file.name} uploaded successfully!\n${data.newAddedRecords} New Entry Added.\n${data.updatedRecords} Entry Updated.\n${data.skippedRecords} Entry Skipped.`);
      }
      else{
        if(data.message=='CSV columns do not match the expected order or names'){
          Alert.alert('Error',`${data.message}\n Expected Columns: ${data.expected}\n Actual Columns: ${data.actual}`);
        }
        else{
          Alert.alert('Error',data.message);
        }
      }
    } catch (error) {
      setUploading(false);
      Alert.alert('Error','Something went wrong! Please try again later.');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`${API_URL}/download-students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolpk }),
      });
      if (!response.ok) throw new Error('Failed to fetch CSV data');

      const csv = await response.text();
      const fileName = `students_${schoolpk}_${Date.now()}.csv`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (Platform.OS === 'android') {
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
          console.log(permissions);
        if (!permissions.granted) return;
        try {
          const uri = await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            fileName,
            'text/csv'
          );
          await FileSystem.writeAsStringAsync(uri, csv, {
            encoding: FileSystem.EncodingType.UTF8,
          });
          Alert.alert('Success','File saved successfully!');
        } catch (error) {
          console.error('Error saving file:', error);
          Alert.alert('Error','Failed to save file');
        }
      } else {
        Alert.alert('Error',`File saved to ${fileUri}`);
      }
    } catch (err) {
      console.error('Download error:', err);
      Alert.alert('Error','Failed to download student CSV.');
    }
  };


  return (
    <View style={styles.container}>
      {/* Uploading Popup */}
      <Modal visible={uploading} transparent animationType="fade">
        <View style={styles.backdrop}>
          <View style={styles.popup}>
            <ActivityIndicator size="large" />
            <Text style={styles.popupText}>Uploading…</Text>
          </View>
        </View>
      </Modal>

      <Text style={styles.schoolName}>{schoolName}</Text>
      
      <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
        <Ionicons name="add-circle-outline" size={20} color="black" />
        <Text style={styles.uploadText}>Upload Spreadsheet (.csv)</Text>
      </TouchableOpacity>

      {school ? (
        <View style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <Ionicons name="school-outline" size={22} color="black" />
            <Text style={styles.detailsTitle}>Details</Text>
            <MaterialIcons
              name="edit"
              size={30}
              color="black"
              style={{ marginLeft: 'auto' }}
              onPress={() =>
                router.replace({
                  pathname: '/schoolUpdateForm',
                  params: {
                    schoolpk,
                    schoolCode: school?.SchoolCode,
                    schoolName,
                    HMName: school?.HMName,
                    HMCN: school?.HMCN,
                    distance: school?.Distance,
                    schoolEmail: school?.SchoolEmail,
                    country,
                    state,
                    district,
                    taluk,
                    postalcode,
                  },
                })
              }
            />
          </View>
          <View style={{ height: 2, backgroundColor: '#ccc', marginVertical: 4 }} />
          <View style={styles.detailBody}>
            <Text>Headmaster: {school?.HMName}</Text>
            <Text>Contact: {school?.HMCN}</Text>
            <Text>School Code: {school?.SchoolCode}</Text>
            <Text>Taluk: {taluk}</Text>
            <Text>District Code: {postalcode}</Text>
            <Text>Distance: {school?.Distance}km</Text>
            <Text>Email: {school?.SchoolEmail}</Text>
          </View>
        </View>
      ) : (
        <Text>Loading school details...</Text>
      )}

      

      <Text style={styles.uploadedText}>
        Total Uploaded Students :{' '}
        <Text style={{ color: '#5a3ff0', fontWeight: 'bold' }}>
          {totalStudents ?? 'Loading...'}
        </Text>
      </Text>

      <Text style={styles.uploadedText}>
        Primary Screened Students :{' '}
        <Text style={{ color: '#5a3ff0', fontWeight: 'bold' }}>
          {primaryScreenedStudents ?? 'Loading...'}
        </Text>
      </Text>

      <Text style={styles.uploadedText}>
        Secondary Screened Students :{' '}
        <Text style={{ color: '#5a3ff0', fontWeight: 'bold' }}>
          {secondaryScreenedStudents ?? 'Loading...'}
        </Text>
      </Text>

      <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
        <Ionicons
          name="download-outline"
          size={24}
          color="white"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.downloadText}>Download</Text>
      </TouchableOpacity>
      
            <View style={styles.bottomNav}>
              <TouchableOpacity onPress={() => router.push('/schoolScreen')}>
                <Ionicons name="home" size={28} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Ionicons name="person-outline" size={28} color="black" />
              </TouchableOpacity>
             </View>
      
             {/* Bottom Sheet Modal */}
             <Modal
               animationType="slide"
               transparent={true}
               visible={modalVisible}
               onRequestClose={() => setModalVisible(false)}
             >
               <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                 <View style={styles.bottomSheet}>
                   <TouchableOpacity
                     style={styles.sheetButton}
                     onPress={() => {
                       setModalVisible(false);
                       router.push('/changePassword');
                     }}
                   >
                   <Text style={styles.sheetText}>Change Password</Text>
                   </TouchableOpacity>
                   <TouchableOpacity
                     style={styles.sheetButton}
                     onPress={() => {
                       setModalVisible(false);
                       router.replace('/');
                     }}
                   >
                     <Text style={styles.sheetText}>Logout</Text>
                   </TouchableOpacity>
                 </View>
               </Pressable>
             </Modal>
            </View>
  );
}


const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flex: 1 },
  schoolName: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginVertical:3},
  uploadedText: { textAlign: 'center', marginVertical: 8 },
  downloadBtn: {
    flexDirection: 'row',      
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#b9aaff',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginBottom: 8,
    marginTop:8,
  },
  downloadText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },  
  uploadBtn: {
    flexDirection: 'row',
    backgroundColor: '#c9dff3',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
    marginTop: 8,
    marginBottom:16,
  },
  uploadText: { 
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500'
  },
  detailsCard: { 
    backgroundColor:
    '#e0e0e0',
    borderRadius: 6,
    padding: 12 
  },
  detailsHeader: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 6 
  },
  detailsTitle: { 
    fontSize: 16,
    fontWeight: '600', 
    marginLeft: 6 
  },
  detailBody: { 
    marginTop: 4, 
    paddingLeft: 4 
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  popup: {
    width: 180,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  popupText: { 
    marginTop: 12, 
    fontSize: 16, 
    fontWeight: '600' 
  },
  bottomNav: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  sheetButton: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  sheetText: {
    fontSize: 16,
  },  
});
