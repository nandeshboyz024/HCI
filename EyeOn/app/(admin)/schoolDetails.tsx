import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

export default function SchoolDetails() {
    const {schoolName, schoolCode, taluk, postalcode} = useLocalSearchParams();

    const school = {
    name: schoolName,
    uploaded: 0,
    headmaster: 'Chokha Ji',
    contact: '+10 98 1098 1098',
    code: schoolCode,
    taluk: taluk,
    districtCode: postalcode,
    email: 'example@gmail.com'
  };

  const handleUpload = () => {
    console.log('Upload Spreadsheet clicked');
    // Use DocumentPicker.getDocumentAsync() if needed
  };

  return (
    <View style={styles.container}>
      <Text style={styles.schoolName}>{school.name}</Text>
      <Text style={styles.uploadedText}>
        Total student uploaded : <Text style={{ color: '#5a3ff0', fontWeight: 'bold' }}>{school.uploaded}</Text>
      </Text>

      <TouchableOpacity style={styles.downloadBtn}>
        <Ionicons name="download-outline" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
        <Ionicons name="add-circle-outline" size={20} color="black" />
        <Text style={styles.uploadText}>Upload Spreadsheet (.csv)</Text>
      </TouchableOpacity>

      <View style={styles.detailsCard}>
        <View style={styles.detailsHeader}>
          <Ionicons name="person-circle-outline" size={22} color="black" />
          <Text style={styles.detailsTitle}>Details</Text>
          <MaterialIcons name="edit" size={18} color="black" style={{ marginLeft: 'auto' }} />
        </View>

        <View style={styles.detailBody}>
          <Text>Headmaster: {school.headmaster}</Text>
          <Text>Contact: {school.contact}</Text>
          <Text>School Code: {school.code}</Text>
          <Text>Taluk: {school.taluk}</Text>
          <Text>District Code: {school.districtCode}</Text>
          <Text>Email: {school.email}</Text>
        </View>
      </View>
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
