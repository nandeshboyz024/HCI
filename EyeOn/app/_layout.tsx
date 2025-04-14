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
    <Stack.Screen
      name="index"
      options={{
        title: "Vision App",
        headerBackVisible: false, // 👈 hides the back arrow
        gestureEnabled: false,    // 👈 disables back swipe on iOS
      }}
    />
    <Stack.Screen name="(screener)" options={{ headerShown:false}}/>
    <Stack.Screen name="(admin)" options={{ headerShown:false}}/>
    </Stack>
  );
}
