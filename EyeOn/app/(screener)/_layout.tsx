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
    <Stack.Screen name="login" options={{ title: "Screener" }}/>
    <Stack.Screen name="primary" options={{title:"Primary Screener"}} />
    <Stack.Screen name="secondary" options={{title:"Secondary Screener"}}/>
    </Stack>
  );
}
