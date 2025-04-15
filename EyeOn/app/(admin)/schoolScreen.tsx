import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable,Alert,Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select';
import { API_URL } from "@env";
import { Dropdown } from 'react-native-element-dropdown';


export default function SchoolScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [district, setDistrict] = useState(null);
  const [taluk, setTaluk] = useState(null);
  const [talukcode,setTalukcode]=useState(null);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [taluks, setTaluks] = useState<[string, number][]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  // Fetch countries on initial load
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${API_URL}/get-countries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const res = await response.json();
        if(res.success){
          setCountries(res.data);
        }
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (!country) return;

    const fetchStates = async () => {
      try {
        const response = await fetch(`${API_URL}/get-states`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Country: country })
        });
        const res = await response.json();
        if(res.success){
          setStates(res.data);
        }
      } catch (err) {
        console.error("Error fetching states:", err);
      }
    };

    setState(null);
    setDistrict(null);
    setTaluk(null);
    setTalukcode(null);
    setStates([]);
    setDistricts([]);
    setTaluks([]);
    fetchStates();
  }, [country]);

  useEffect(() => {
    if (!country || !state) return;

    const fetchDistricts = async () => {
      try {
        const response = await fetch(`${API_URL}/get-districts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Country: country, State: state })
        });
        const res = await response.json();
        if(res.success){
          setDistricts(res.data);
        }
      } catch (err) {
        console.error("Error fetching districts:", err);
      }
    };
    setDistrict(null);
    setTaluk(null);
    setTalukcode(null);
    setDistricts([]);
    setTaluks([]);
    fetchDistricts();
  }, [state]);

  useEffect(() => {
    if (!country || !state || !district) return;

    const fetchTaluks = async () => {
      try {
        const response = await fetch(`${API_URL}/get-taluks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Country: country, State: state, District: district })
        });
        const res = await response.json();
        if(res.success){
          setTaluks(res.data);
        }
      } catch (err) {
        console.error("Error fetching taluks:", err);
      }
    };

    setTaluk(null);
    setTalukcode(null);
    setTaluks([]);
    fetchTaluks();
  }, [district]);

  const handleNext = () => {
    // handle navigation or data submission
    console.log({ country, state, district, taluk, talukcode});
  };

  const handleCountryChange = (item) => {
    // const item = value;
    console.log("Selected country:", item.value);

    setCountry(item.value);
    // setCountry(item.value);
    setState(null);
    setDistrict(null);
    setTaluk(null);
    setTalukcode(null);
    if (item.value) {
      setCurrentStep(2);
    }
    else{
      setCurrentStep(1);
    }
  };

  const handleStateChange = (item) => {
    setState(item.value);
    setDistrict(null);
    setTaluk(null);
    setTalukcode(null);
    if (item.value) {
      setCurrentStep(3);
    }
    else{
      setCurrentStep(2);      
    }
  };

  const handleDistrictChange = (item) => {
    setDistrict(item.value);
    setTaluk(null);
    setTalukcode(null);
    if (item.value) {
      setCurrentStep(4);
    }
    else{
      setCurrentStep(3);      
    }
  };

  const handleTalukChange = (item) => {
    setTaluk(item.value);
    setTalukcode(item.id)
    if (item.value) {
      setCurrentStep(5);
    }
    else{
      setCurrentStep(4);      
    }
  };

return (
  <View style={styles.container}>
    <Text style={styles.header}>Filter Schools</Text>
    {currentStep >= 1 && (
      <View style={styles.filterBox}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={countries.map((country) => ({ label: country, value: country }))}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select Country"
          searchPlaceholder="Search..."
          value={country}
          onChange={handleCountryChange}
        />
      </View>
    )}
    {currentStep >= 2 && (
      <View style={styles.filterBox}>
        <Dropdown
          key={country} // Add a key to force re-render
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={states?.map((state) => ({ label: state, value: state })) || []}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select State"
          searchPlaceholder="Search..."
          value={state}
          onChange={handleStateChange}
        />
      </View>
    )}
    {currentStep >= 3 && (
      <View style={styles.filterBox}>
        <Dropdown
          key={state} // Add a key to force re-render
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={districts?.map((district) => ({ label: district, value: district })) || []}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select District"
          searchPlaceholder="Search..."
          value={district}
          onChange={handleDistrictChange}
        />
      </View>
    )}
    {currentStep >= 4 && (
      <View style={styles.filterBox}>
        <Dropdown
          key={district} // Add a key to force re-render
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          // data={taluks?.map((item) => ({ label: item.Taluk, value: item.Taluk })) || []}
          data={taluks.map(([name, id]) => ({ label: name, value: name, id}))}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select Taluk"
          searchPlaceholder="Search..."
          value={taluk}
          onChange={handleTalukChange}
        />
      </View>
    )}
    {currentStep === 5 && (
      <View style={{ alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Add School</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>View School</Text>
          </TouchableOpacity>
        </View>
      </View>

    )}
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
};



const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    alignSelf:'center',
    fontSize: 24,
    marginBottom: 20,
  },
  filterBox: {
    backgroundColor: '#f0f0f0', // Grey background
    borderRadius: 8,
    marginBottom: 15,
    padding: 1,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  button: {
    alignSelf:'center',
    backgroundColor: "#8F73E2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: 140,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "bold",
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
