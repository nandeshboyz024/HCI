import React, { useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Dropdown } from 'react-native-element-dropdown';
import { API_URL } from '@env';
import { useRouter } from 'expo-router';

type SchoolItem = {
    label: string;
    value: string;
    code: string;
};

export default function SearchSchool(){
  const router = useRouter();
  const { country, state, district, taluk, talukcode, postalcode} = useLocalSearchParams();
  const [schoolName, setSchoolName] = useState<string|null>(null);
  const [schoolCode,setSchoolCode] = useState<string|null>(null);

  const [schools, setSchools] = useState<[string, string][]>([]);

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



  console.log(country, state, district, taluk, talukcode, postalcode);

  if (!country || !state || !district || !taluk) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>No filters selected</Text>
      </View>
    );
  }

  const handleSchoolChange = (item:SchoolItem) => {
    setSchoolName(item.value);
    setSchoolCode(item.code);
  };

  const handleGoToSchool = () => {
    if (schoolCode) {
        router.push({
            pathname: '/schoolDetails',
            params: {
              schoolName,
              schoolCode,
              taluk,
              postalcode
            },
          });
    } else {
      console.log('Please select a school first');
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
        <TouchableOpacity style={styles.button} onPress={handleGoToSchool}>
          <Text style={styles.buttonText}>Go to School</Text>
        </TouchableOpacity>
      </View>
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
});

