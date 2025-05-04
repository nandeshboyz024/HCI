import React, { useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Modal,Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Dropdown } from 'react-native-element-dropdown';
import { API_URL } from '@env';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type SchoolItem = {
    label: string;
    value: string;
    code: number;
};

export default function SearchSchool(){
  const router = useRouter();
  const { country, state, district, taluk, talukcode, postalcode} = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [schoolName, setSchoolName] = useState<string|null>(null);
  const [schoolpk,setSchoolpk] = useState<number|null>(null);

  const [schools, setSchools] = useState<[number, string][]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      const fetchSchools = async () => {
        try {
          const response = await fetch(`${API_URL}/get-schools`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({postalcodepk: talukcode})
          });
          const res = await response.json();
          if(res.success){
            setSchools(res.data);
          }
        } catch (err) {
          console.error("Error fetching countries:", err);
        }
      };
      fetchSchools();
    }, []);



  // console.log(country, state, district, taluk, talukcode, postalcode);

  if (!country || !state || !district || !taluk) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>No filters selected</Text>
      </View>
    );
  }

  const handleSchoolChange = (item:SchoolItem) => {
    setError(null);
    setSchoolName(item.value);
    setSchoolpk(item.code);
  };

  const handleGoToSchool = () => {
    if (schoolpk) {
        router.push({
            pathname: '/schoolDetails',
            params: {
              schoolName,
              schoolpk,
              country,
              state,
              district,
              taluk,
              postalcode
            },
          });
    } else {
      setError('Please select a school first');
    }
  };

  return (
    <>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.label}>Country: {country}</Text>
        <Text style={styles.label}>State: {state}</Text>
        <Text style={styles.label}>District: {district}</Text>
        <Text style={styles.label}>Taluk: {taluk}</Text>
      </View>
      <View style={styles.container}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={schools.map(([code,name]) => ({ label: name, value: name,code}))}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select a School"
          searchPlaceholder="Search..."
          value={schoolName}
          onChange={handleSchoolChange}
        />
        {error && <Text style={styles.errorText}>{error}</Text>} 
        <TouchableOpacity style={styles.button} onPress={handleGoToSchool}>
          <Text style={styles.buttonText}>Go to School</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.replace('/schoolScreen')}>
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    // justifyContent: 'top',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    alignSelf:'center',
    backgroundColor: "#8F73E2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: 200,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  dropdown: {
    margin: 16,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 6,
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

