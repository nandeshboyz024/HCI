import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Import the icon library

const PrimaryScreening = () => {
  const { country, state, district, taluk, selectedSchool, selectedClass, selectedSection } = useLocalSearchParams();
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [remainingStudents, setRemainingStudents] = useState(27);
  const [testedStudents, setTestedStudents] = useState(23);
  const [activeTab, setActiveTab] = useState('remaining'); // 'remaining' or 'tested'

  // Dummy data for remaining students
  const dummyRemainingStudents = [
    { id: '1', name: 'Rahul Choudhary', parent: 'Vikram Choudhary', age: 15, sex: 'M' },
    { id: '2', name: 'Mohit Malhotra', parent: 'Ram Malhotra', age: 15, sex: 'M' },
    { id: '3', name: 'Rohit Malhotra', parent: 'Jagdish Malhotra', age: 15, sex: 'M' },
  ];

  // Dummy data for tested students
  const dummyTestedStudents = [
    { id: '4', name: 'Neha Sharma', parent: 'Devdatt Sharma', age: 15, sex: 'F', status: 'Secondary Evaluation Required', reVision: '4/7', leVision: '6/7' },
    { id: '5', name: 'Amit Kumar', parent: 'Rakesh Kumar', age: 15, sex: 'M', status: 'Normal' },
    { id: '6', name: 'Priya Singh', parent: 'Rajesh Singh', age: 15, sex: 'F', status: 'Normal', reVision: '5/6', leVision: '6/6' },
    { id: '7', name: 'Riya Singh', parent: 'Rajesh Singh', age: 15, sex: 'F', status: 'Normal', reVision: '5/6', leVision: '6/6' },
    // { id: '8', name: 'Priya Singh', parent: 'Rajesh Singh', age: 15, sex: 'F', status: 'Normal', reVision: '5/6', leVision: '6/6' },
    // { id: '9', name: 'Priya Singh', parent: 'Rajesh Singh', age: 15, sex: 'F', status: 'Normal', reVision: '5/6', leVision: '6/6' },
    // { id: '10', name: 'Priya Singh', parent: 'Rajesh Singh', age: 15, sex: 'F', status: 'Normal', reVision: '5/6', leVision: '6/6' },
    // { id: '11', name: 'Priya Singh', parent: 'Rajesh Singh', age: 15, sex: 'F', status: 'Normal', reVision: '5/6', leVision: '6/6' },

  ];

  useEffect(() => {
    if (activeTab === 'remaining') {
      setStudents(dummyRemainingStudents);
      setFilteredStudents(dummyRemainingStudents);
    } else {
      setStudents(dummyTestedStudents);
      setFilteredStudents(dummyTestedStudents);
    }
  }, [activeTab]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(
        students.filter((student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, students]);

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === 'remaining') {
      setStudents(dummyRemainingStudents);
      setFilteredStudents(dummyRemainingStudents);
    } else {
      setStudents(dummyTestedStudents);
      setFilteredStudents(dummyTestedStudents);
    }
  };

  const handleStudentPress = (student) => {
    router.push({
      pathname: '/(screener)/primary/visionForm',
      params: {
        studentId: student.id,
        studentName: student.name,
        studentParent: student.parent,
        studentREVision: student.reVision || '6/6', // Default to '6/6' if not available
        studentLEVision: student.leVision || '6/6', // Default to '6/6' if not available
      },
    });
  };

  const renderStudentItem = ({ item }) => (
    <TouchableOpacity style={styles.studentItem} onPress={() => handleStudentPress(item)}>
      <View style={styles.studentIcon}>
        <Text style={styles.studentIconText}>{item.name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.studentDetails}>
        <Text style={styles.studentName}>Name: {item.name}</Text>
        <Text style={styles.studentParent}>Parent: {item.parent}</Text>
        <Text style={styles.studentAge}>Age: {item.age}</Text>
        <Text style={styles.studentSex}>Sex: {item.sex}</Text>
        {activeTab === 'tested' && (
          <>
            <Text style={styles.studentStatus}>Status: {item.status}</Text>
            {item.reVision && <Text style={styles.studentVision}>RE Vision: {item.reVision}</Text>}
            {item.leVision && <Text style={styles.studentVision}>LE Vision: {item.leVision}</Text>}
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedSchool}</Text>
      <Text style={styles.subtitle}>Class {selectedClass}</Text>
      <Text style={styles.subtitle}>Section {selectedSection}</Text>
      <Text style={styles.info}>
        <Text style={{ color: '#0497F3' }}>{remainingStudents}</Text> / {remainingStudents + testedStudents}
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
        keyExtractor={(item) => item.id.toString()}
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
    borderRadius: 20,
    backgroundColor: '#007AFF',
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
  },
});

export default PrimaryScreening;
