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
    <Stack.Screen name="login" options={{ title: "Tester" }}/>
    <Stack.Screen name="primary" />
    <Stack.Screen name="secondary"/>
    </Stack>
  );
}
