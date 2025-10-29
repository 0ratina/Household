import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function TabsLayout() {
   return (
      <Tabs>
         <Tabs.Screen
            name='accountOverview'
            options={{
               title: 'Konto',
               tabBarIcon: ({ color, size }) => <Ionicons name='home-outline' color={color} size={size} />,
            }}
         />
         <Tabs.Screen
            name='statistics'
            options={{
               title: 'Statistik',
               tabBarIcon: ({ color, size }) => <Ionicons name='bar-chart-outline' color={color} size={size} />,
            }}
         />
         <Tabs.Screen
            name='profile'
            options={{
               title: 'Profil', headerTitleStyle: { fontSize: 24, fontWeight: "600" },
               tabBarIcon: ({ color, size }) => <Ionicons name='person-outline' color={color} size={size} />,
            }}
         />
      </Tabs>
   )
}
