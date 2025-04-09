import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Link } from 'expo-router';
export default function SchoolScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Dropdown */}
      <View style={styles.dropdown}>
        <TextInput
          style={styles.input}
          placeholder="Search / Select School"
          placeholderTextColor="#555"
          editable={false}
        />
        <Ionicons name="chevron-down" size={20} color="#555" style={styles.icon} />
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>View School</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Add School</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Ionicons name="home" size={28} color="black" />
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
            {/* <TouchableOpacity
              style={styles.sheetButton}
              onPress={()=>{
                setModalVisible(false);
                router.replace("/(admin)/changePassword");
              }}
            >
              <Text style={styles.sheetText}>Change Password</Text>
            </TouchableOpacity> */}

            <Link href="/changePassword" asChild>
                    <TouchableOpacity style={styles.sheetButton}>
                      <Text style={styles.sheetText}>Change Password</Text>
                    </TouchableOpacity>
            </Link>

            <TouchableOpacity
              style={styles.sheetButton}
              onPress={()=>{
                setModalVisible(false);
                router.replace("/");
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
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d3d3d3',
    borderRadius: 10,
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 30,
    position: 'relative',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  icon: {
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#A385E0',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
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
