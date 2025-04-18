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
    <Stack.Screen name="primaryScreener" options={{ title: "Primary Screener" }}/>
    <Stack.Screen name="VisionForm" options={{ title: "Primary Screening Form" }}/>
    
    </Stack>
  );
}
