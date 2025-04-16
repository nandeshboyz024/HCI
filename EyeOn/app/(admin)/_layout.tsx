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
     <Stack.Screen name="changePassword" options={{title:"Change Password"}}/>
     <Stack.Screen name="searchSchool" options={{title:"Admin"}}/>
     <Stack.Screen name="schoolDetails" options={{title:"Admin"}}/>
     <Stack.Screen name="schoolForm" options={{title:"Admin"}}/>
     <Stack.Screen name="schoolUpdateForm" options={{title:"Update School Details"}}/>
    </Stack>
  );
}
