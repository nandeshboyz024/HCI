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
    <Stack.Screen name="secondaryScreener" options={{ title: "Secondary Screening" }}/>
    <Stack.Screen name="secondaryVisionForm" options={{ title: "Secondary Screening Form" }}/>
    
    </Stack>
  );
}
