import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Import the icon library
import Footer from '../footer'; // Import the Footer component
import { API_URL } from '@env';

const PrimaryScreening = () => {
  const { selectedSchoolpk, selectedClass, selectedSection, selectedSchoolName } = useLocalSearchParams();
  const router = useRouter();

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [nOfRemainingStudents, setnOfRemainingStudents] = useState(27);
  const [nOfTestedStudents, setnOfTestedStudents] = useState(23);
  const [activeTab, setActiveTab] = useState('remaining'); // 'remaining' or 'tested'
  const [remainingStudents, setRemainingStudents] = useState([]);
  const [testedStudents, setTestedStudents] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true); // Set loading to true before fetching data
      try {
        const response = await fetch(`${API_URL}/getStudentsForPrimaryScreening`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ schoolpk: selectedSchoolpk, className: selectedClass, section: selectedSection })
        });
        console.log("response", response);

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            // Separate students based on status
            const remaining = result.data.filter(student => student.status === 0);
            const tested = result.data.filter(student => student.status === 1);

            // Transform the data into the desired format
            const transformedRemainingStudents = remaining.map(student => ({
              satsId: student.StudentId,
              Name: student.StudentName,
              Parent: student.ParentName,
              Age: student.Age,
              Sex: student.Sex
            }));

            const transformedTestedStudents = tested.map(student => ({
              satsId: student.StudentId,
              Name: student.StudentName,
              Parent: student.ParentName,
              Age: student.Age,
              Sex: student.Sex,
              status: student.testResultStatus,
              reVision: student.reVision,
              leVision: student.leVision
            }));

            setRemainingStudents(transformedRemainingStudents);
            setTestedStudents(transformedTestedStudents);
            setnOfRemainingStudents(transformedRemainingStudents.length);
            setnOfTestedStudents(transformedTestedStudents.length);
          } else {
            console.error('No data found or API response indicates failure.');
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

    if (selectedSchoolpk && selectedClass && selectedSection) {
      fetchStudents();
    }
  }, [selectedSchoolpk, selectedClass, selectedSection, activeTab]);

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
          student.Name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, students]);

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === 'remaining') {
      setStudents(remainingStudents);
      setFilteredStudents(remainingStudents);
    } else {
      setStudents(testedStudents);
      setFilteredStudents(testedStudents);
    }
  };

  const handleStudentPress = (student) => {
    router.push({
      pathname: '/(screener)/primary/visionForm',
      params: {
        satsId: student.satsId,
        studentName: student.Name,
        studentParent: student.Parent,
        studentREVision: student.reVision || '6/6', // Default to '6/6' if not available
        studentLEVision: student.leVision || '6/6', // Default to '6/6' if not available
        selectedSchoolpk,
        selectedClass,
        selectedSection,
        selectedSchoolName
      },
    });
  };

  const renderStudentItem = ({ item }) => (
    <TouchableOpacity style={styles.studentItem} onPress={() => handleStudentPress(item)}>
      <View style={styles.studentIcon}>
        <Ionicons name="person-circle-outline" size={40} color="#000" />
      </View>
      <View style={styles.studentDetails}>
        <Text style={styles.studentName}>Name: {item.Name}</Text>
        <Text style={styles.studentParent}>Parent Name: {item.Parent}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingVertical: 5 }}>
          <Text style={[styles.studentAge, { marginRight: 50 }]}>Age: {item.Age}</Text>
          <Text style={styles.studentSex}>Sex: {item.Sex}</Text>
        </View>
        {activeTab === 'tested' && (
            <>
            <Text style={styles.studentStatus}>Status: {item.status}</Text>

            <View style={{ flexDirection: 'row', marginTop: 5 }}>

            {item.reVision && <Text style={styles.studentVision}>RE Vision: {item.reVision}</Text>}
            {item.leVision && <Text style={styles.studentVision}>LE Vision: {item.leVision}</Text>}
            </View>
            </>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{selectedSchoolName}</Text>
        <Text style={styles.subtitle}>Class {selectedClass}</Text>
        <Text style={styles.subtitle}>Section {selectedSection}</Text>
        <View style={styles.statsContainer}>
          {activeTab === 'remaining' && (
            <Text style={styles.remainingStudentsText}>
              Remaining Students: {nOfRemainingStudents}
            </Text>
          )}
          {activeTab === 'tested' && (
            <Text style={styles.remainingStudentsText}>
              Tested Students: {nOfTestedStudents}
            </Text>
          )}
          <Text style={styles.totalStudentsText}>
            Total Students: {nOfRemainingStudents + nOfTestedStudents}
          </Text>
        </View>

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
          keyExtractor={(item) => item.satsId.toString()}
          style={styles.studentList}
        />
      </View>
      <Footer />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  remainingStudentsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF'
  },
  totalStudentsText: {
    fontSize: 16,
    // fontWeight: '500', // Light font weight
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
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentParent: {
    fontSize: 14,
    color: '#555',
  },
  studentAge: {
    fontSize: 14,
    color: '#555',
  },
  studentSex: {
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
    marginRight: 50
  },
});

export default PrimaryScreening;
