import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Import the icon library
import { API_URL } from '@env'; // Ensure you have the correct path to your .env file

const SecondaryScreening = () => {
  const { selectedSchoolpk, selectedClass, selectedSection, selectedSchoolName } = useLocalSearchParams();
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [remainingStudents, setRemainingStudents] = useState([]);
  const [testedStudents, setTestedStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('remaining'); // 'remaining' or 'tested'
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true); // Set loading to true before fetching data
      try {
        const response = await fetch(`${API_URL}/getStudentsForSecondaryScreening`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            schoolpk: selectedSchoolpk,
            className: selectedClass,
            section: selectedSection,
          }),
        });
        console.log("Response:", response);

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            const studentsData = result.data;
            const remaining = studentsData.filter(student => student.status === 0);
            const tested = studentsData.filter(student => student.status === 1);
            setRemainingStudents(remaining);
            setTestedStudents(tested);
            setStudents(remaining); // Default to remaining students
            setFilteredStudents(remaining); // Default to remaining students
          } else {
            console.error('Failed to fetch students:', result.message);
          }
        } else {
          console.error('Failed to fetch students:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchStudents();
  }, [selectedSchoolpk, selectedClass, selectedSection]);

  useEffect(() => {
    if (activeTab === 'remaining') {
      setStudents(remainingStudents);
      setFilteredStudents(remainingStudents);
    } else {
      setStudents(testedStudents);
      setFilteredStudents(testedStudents);
    }
  }, [activeTab, remainingStudents, testedStudents]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(
        students.filter((student) =>
          student.StudentName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, students]);

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const handleStudentPress = (student) => {
    router.push({
      pathname: '/(screener)/secondary/secondaryVisionForm',
      params: {
        satsId: student.StudentId,
        studentName: student.StudentName,
        studentParent: student.ParentName,
        studentRightEyeSPH: student.rightEyeSPH,
        studentRightEyeCyl: student.rightEyeCYL,
        studentRightEyeAxis: student.rightEyeAXIS,
        studentRightEyeVision: student.rightEyeVision,
        studentLeftEyeSPH: student.leftEyeSPH,
        studentLeftEyeCyl: student.leftEyeCYL,
        studentLeftEyeAxis: student.leftEyeAXIS,
        studentLeftEyeVision: student.leftEyeVision,

        selectedRefractiveError: student.refractiveError || '', // Default to empty string if not available
        selectedSpectaclesFrameCode: student.spectaclesFrameCode || '', // Default to empty string if not available
        selectedMobileNumber: student.mobileNumber || '', // Default to empty string if not available

        selectedSchoolpk: selectedSchoolpk,
        selectedClass: selectedClass,
        selectedSection: selectedSection,
        selectedSchoolName: selectedSchoolName
      },
    });
  };

  const renderStudentItem = ({ item }) => (
    <TouchableOpacity style={styles.studentItem} onPress={() => handleStudentPress(item)}>
      <View style={styles.studentIcon}>
              <Ionicons name="person-circle-outline" size={40} color="#000" />
      </View>
      <View style={styles.studentDetails}>
        <Text style={styles.studentName}>Name: {item.StudentName}</Text>
        <Text style={styles.studentParent}>Parent Name: {item.ParentName}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingVertical: 5 }}>
          <Text style={[styles.studentAge, { marginRight: 50 }]}>Age: {item.Age}</Text>
          <Text style={styles.studentSex}>Sex: {item.Sex}</Text>
        </View>
        {activeTab === 'remaining' && (
          <>
            <Text style={styles.studentStatus}>Status: {item.primaryTestResultStatus}</Text>
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
            {item.rightEyeVision && <Text style={styles.studentVision}>RE Vision: {item.rightEyeVision}</Text>}
            {item.leftEyeVision && <Text style={styles.studentVision}>LE Vision: {item.leftEyeVision}</Text>}
            </View>   
          </>
        )}

        {activeTab === 'tested' && (
          <>
            <Text style={styles.studentAgeSex}>Mobile No.: {item.mobileNumber}</Text>
            <Text style={styles.studentEyeDetails}>Right Eye:</Text>
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              <Text style={styles.studentVision}>SPH: {item.rightEyeSPH}</Text>
              <Text style={styles.studentVision}>CYL: {item.rightEyeCYL}</Text>
              <Text style={styles.studentVision}>AXIS: {item.rightEyeAXIS}</Text>
              <Text style={styles.studentVision}>VISION: {item.rightEyeVision}</Text>
            </View>
            <Text style={styles.studentEyeDetails}>Left Eye:</Text>
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              <Text style={styles.studentVision}>SPH: {item.leftEyeSPH}</Text>
              <Text style={styles.studentVision}>CYL: {item.leftEyeCYL}</Text>
              <Text style={styles.studentVision}>AXIS: {item.leftEyeAXIS}</Text>
              <Text style={styles.studentVision}>VISION: {item.leftEyeVision}</Text>
            </View>
            <Text style={styles.studentRemark}>Remark: {item.refractiveError}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        {/* <Text style={styles.loadingText}>Loading...</Text> */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedSchoolName}</Text>
      <Text style={styles.subtitle}>Class {selectedClass}</Text>
      <Text style={styles.subtitle}>Section {selectedSection}</Text>
      <Text style={styles.info}>
        <Text style={{ color: '#0497F3' }}>{testedStudents.length}</Text> / {remainingStudents.length + testedStudents.length}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, activeTab === 'remaining' && styles.activeButton]} onPress={() => handleTabPress('remaining')}>
          <Text style={[styles.buttonText, activeTab === 'remaining' && styles.activeButtonText]}>Remaining</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, activeTab === 'tested' && styles.activeButton]} onPress={() => handleTabPress('tested')}>
          <Text style={[styles.buttonText, activeTab === 'tested' && styles.activeButtonText]}>Tested</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Student"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredStudents}
        renderItem={renderStudentItem}
        keyExtractor={(item) => item.StudentId.toString()}
        style={styles.studentList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#AFE0FE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: '#0497F3',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
  },
  activeButtonText: {
    color: '#fff',
  },
  searchContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  studentList: {
    flex: 1,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  studentIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  studentIconText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  studentParent: {
    fontSize: 14,
    color: '#555',
  },
  studentAgeSex: {
    fontSize: 14,
    color: '#555',
  },
  studentStatus: {
    fontSize: 14,
    color: '#007AFF',
  },
  studentVision: {
    fontSize: 14,
    color: '#555',
    marginRight: 20
  },
  studentEyeDetails: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    marginTop: 10,
  },
  studentRemark: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 10,
  },
  studentAge: {
    fontSize: 14,
    color: '#555',
  },
  studentSex: {
    fontSize: 14,
    color: '#555',
  }
});

export default SecondaryScreening;
