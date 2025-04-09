import { Stack } from 'expo-router';

export default function AdminLayout() {
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
     <Stack.Screen name="login" options={{ title: "Admin" }}/>
     <Stack.Screen name="schoolScreen" options={{ title: "Admin" }}/>
    </Stack>
  );
}
