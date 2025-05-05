import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useRouter } from 'expo-router';
import Footer from './footer'; // Import the Footer component
import { API_URL } from '@env';

type DropdownItem = {
  label: string;
  value: string;
  id?: number;
  postalcode?: string;
};

const FilterSchools = () => {
  const router = useRouter();

  const [country, setCountry] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [district, setDistrict] = useState<string | null>(null);
  const [taluk, setTaluk] = useState<string | null>(null);
  const [talukcode, setTalukcode] = useState<number | null>(null);
  const [postalcode, setPostalcode] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState(1);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [taluks, setTaluks] = useState<[string, number, string][]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${API_URL}/get-countries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const res = await response.json();
        if (res.success) {
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
        if (res.success) {
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
    setPostalcode(null);
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
        if (res.success) {
          setDistricts(res.data);
        }
      } catch (err) {
        console.error("Error fetching districts:", err);
      }
    };
    setDistrict(null);
    setTaluk(null);
    setTalukcode(null);
    setPostalcode(null);
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
        if (res.success) {
          setTaluks(res.data);
        }
      } catch (err) {
        console.error("Error fetching taluks:", err);
      }
    };

    setTaluk(null);
    setTalukcode(null);
    setPostalcode(null);
    setTaluks([]);
    fetchTaluks();
  }, [district]);

  const handleCountryChange = (item: DropdownItem) => {
    setCountry(item.value);
    setState(null);
    setDistrict(null);
    setTaluk(null);
    setTalukcode(null);
    setPostalcode(null);
    if (item.value) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  };

  const handleStateChange = (item: DropdownItem) => {
    setState(item.value);
    setDistrict(null);
    setTaluk(null);
    setTalukcode(null);
    setPostalcode(null);
    if (item.value) {
      setCurrentStep(3);
    } else {
      setCurrentStep(2);
    }
  };

  const handleDistrictChange = (item: DropdownItem) => {
    setDistrict(item.value);
    setTaluk(null);
    setTalukcode(null);
    setPostalcode(null);
    if (item.value) {
      setCurrentStep(4);
    } else {
      setCurrentStep(3);
    }
  };

  const handleTalukChange = (item: DropdownItem) => {
    setTaluk(item.value);
    if (item.id) setTalukcode(item.id);
    if (item.postalcode) setPostalcode(item.postalcode);
    if (item.value) {
      setCurrentStep(5);
    } else {
      setCurrentStep(4);
    }
  };

  const handleNext = () => {
    if (!country) {
      Alert.alert('Error', 'Please select a country');
      return;
    }
    if (!state) {
      Alert.alert('Error', 'Please select a state');
      return;
    }
    if (!district) {
      Alert.alert('Error', 'Please select a district');
      return;
    }
    if (!taluk) {
      Alert.alert('Error', 'Please select a taluk');
      return;
    }

    console.log(country, state, district, taluk, talukcode, postalcode);
    router.push({
      pathname: '/SchoolList',
      params: {
        country,
        state,
        district,
        taluk,
        talukcode,
        postalcode
      },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={[styles.header, { textAlign: 'center' }]}>Filter Schools</Text>
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
                data={taluks?.map(([name, id, postalcode]) => ({ label: name, value: name, id, postalcode })) || []}
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
            <Button title="Next" onPress={handleNext} color="#007BFF" />
          )}
        </View>
        <Footer />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
  header: {
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
});

export default FilterSchools;
