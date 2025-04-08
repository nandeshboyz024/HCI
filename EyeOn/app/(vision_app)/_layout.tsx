import { Stack } from 'expo-router';

export default function HomeLayout() {
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
    <Stack.Screen name="index" options={{ title: "Vision App" }}/>
    <Stack.Screen name="admin" />
    <Stack.Screen name="(tester)" options={{ headerShown:false}}/>
    </Stack>
  );
}
