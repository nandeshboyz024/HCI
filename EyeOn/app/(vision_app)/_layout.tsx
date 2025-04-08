import { Stack } from 'expo-router';
import { Header } from 'react-native/Libraries/NewAppScreen';

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
    <Stack.Screen name="(tester)" options={{ headerShown:false}}/>
    <Stack.Screen name="(admin)" options={{ headerShown:false}}/>
    </Stack>
  );
}
