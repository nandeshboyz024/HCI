import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { API_URL } from '@env';



type DropdownItem = {
  label: string;
  value: string;
  id?: number;
};

const FilterSchools = () => {
  const router = useRouter();

  const [country, setCountry] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [district, setDistrict] = useState<string | null>(null);
  const [taluk, setTaluk] = useState<string | null>(null);

  const [talukcode, setTalukcode] = useState<number | null>(null);

  const [currentStep, setCurrentStep] = useState(1);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [taluks, setTaluks] = useState<[string, number][]>([]);

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



  // const countries = ['India', 'USA', 'Canada']; // Example data
  // const states = {
  //   India: ['Karnataka', 'Maharashtra', 'Tamil Nadu'],
  //   USA: ['California', 'Texas', 'New York'],
  //   Canada: ['Ontario', 'British Columbia', 'Quebec'],
  // };
  // const districts = {
  //   Karnataka: ['Bangalore', 'Mysore', 'Hubli'],
  //   Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
  //   TamilNadu: ['Chennai', 'Coimbatore', 'Madurai'],
  //   California: ['Los Angeles', 'San Diego', 'San Jose'],
  //   Texas: ['Houston', 'Dallas', 'Austin'],
  //   NewYork: ['New York City', 'Buffalo', 'Rochester'],
  //   Ontario: ['Toronto', 'Ottawa', 'Hamilton'],
  //   BritishColumbia: ['Vancouver', 'Victoria', 'Kelowna'],
  //   Quebec: ['Montreal', 'Quebec City', 'Gatineau'],
  // };
  // const taluks = {
  //   Bangalore: ['Yelahanka', 'Devanahalli', 'Hoskote'],
  //   Mysore: ['Nanjangud', 'T.Narsipur', 'H.D.Kote'],
  //   Hubli: ['Dharwad', 'Navalgund', 'Ron'],
  //   Mumbai: ['Andheri', 'Bandra', 'Chembur'],
  //   Pune: ['Hadapsar', 'Kothrud', 'Shivajinagar'],
  //   Nagpur: ['Kamptee', 'Katol', 'Saoner'],
  //   Chennai: ['Ambattur', 'Ayanavaram', 'Guindy'],
  //   Coimbatore: ['Pollachi', 'Mettupalayam', 'Perur'],
  //   Madurai: ['Melur', 'Thirumangalam', 'Usilampatti'],
  //   LosAngeles: ['Santa Monica', 'Beverly Hills', 'Hollywood'],
  //   SanDiego: ['La Jolla', 'Chula Vista', 'Carlsbad'],
  //   SanJose: ['Sunnyvale', 'Santa Clara', 'Cupertino'],
  //   Houston: ['Pasadena', 'Baytown', 'Deer Park'],
  //   Dallas: ['Plano', 'Irving', 'Garland'],
  //   Austin: ['Round Rock', 'Cedar Park', 'Georgetown'],
  //   NewYorkCity: ['Manhattan', 'Brooklyn', 'Queens'],
  //   Buffalo: ['Amherst', 'Cheektowaga', 'Tonawanda'],
  //   Rochester: ['Greece', 'Irondequoit', 'Brighton'],
  //   Toronto: ['Mississauga', 'Brampton', 'Scarborough'],
  //   Ottawa: ['Gatineau', 'Nepean', 'Kanata'],
  //   Hamilton: ['Burlington', 'Stoney Creek', 'Ancaster'],
  //   Vancouver: ['Surrey', 'Burnaby', 'Richmond'],
  //   Victoria: ['Saanich', 'Langford', 'Colwood'],
  //   Kelowna: ['West Kelowna', 'Lake Country', 'Peachland'],
  //   Montreal: ['Laval', 'Longueuil', 'Terrebonne'],
  //   QuebecCity: ['Lévis', 'Sainte-Foy', 'Beauport'],
  //   Gatineau: ['Hull', 'Aylmer', 'Buckingham'],
  // };

  const handleCountryChange = (item) => {
    // const item = value;
    console.log("Selected country:", item.value);

    setCountry(item.value);
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

  const handleStateChange = (item:DropdownItem) => {
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

  const handleDistrictChange = (item:DropdownItem) => {
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

  const handleTalukChange = (item:DropdownItem) => {
    setTaluk(item.value);
    if(item.id) setTalukcode(item.id);
    if (item.value) {
      setCurrentStep(5);
    }
    else{
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

    console.log(country, state, district, taluk, talukcode);
    router.push({
      pathname: '/SchoolList',
      params: {
        country,
        state,
        district,
        taluk,
        talukcode
      },
    });
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
            data={countries?.map((country) => ({ label: country, value: country }))}
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
            // data={states[country]?.map((state) => ({ label: state, value: state })) || []}
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
            // data={districts[state]?.map((district) => ({ label: district, value: district })) || []}

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
            // data={taluks[district]?.map((taluk) => ({ label: taluk, value: taluk })) || []}
            // data={taluks?.map((taluk) => ({ label: taluk, value: taluk })) || []}
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
        <Button title="Next" onPress={handleNext} />
      )}
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
