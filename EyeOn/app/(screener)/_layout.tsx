import { Stack } from 'expo-router';

export default function TesterLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "text-primary",
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        }
      }}>
    {/* <Stack.Screen name="login" options={{ title: "Tester" }}/> */}
    <Stack.Screen name="FilterSchools" options={{ title: "Filter Schools" }}/>
    <Stack.Screen name="SchoolList" options={{ title: "Select School" }}/>
    
    <Stack.Screen name="SelectedSchools" options={{ title: "Selected Schools" }}/>
    {/* <Stack.Screen name="SchoolDetails" options={{ title: "School Details" }}/> */}
    
    {/* <Stack.Screen name="secondary"/> */}
    </Stack>
  );
}
