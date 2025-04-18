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
    <Stack.Screen name="FilterSchools" options={{ title: "Screener" }}/>
    <Stack.Screen name="SchoolList" options={{ title: "Select School" }}/>
    <Stack.Screen name="primary" options={{ headerShown: false }}/>
    <Stack.Screen name="selectedSchools" options={{ title: "Screening" }}/>
    <Stack.Screen name="secondary" options={{ headerShown: false }}/>
    
    {/* <Stack.Screen name="SchoolDetails" options={{ title: "School Details" }}/> */}
    
    {/* <Stack.Screen name="secondary"/> */}
    </Stack>
  );
}
