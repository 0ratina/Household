import {Tabs} from 'expo-router'
import {Ionicons} from '@expo/vector-icons'

export default function TabsLayout() {
   return (
      <Tabs>
         <Tabs.Screen
            name='kontooversikt'
            options={{
               title: 'Konto',
               tabBarIcon: ({color, size}) => <Ionicons name='home-outline' color={color} size={size} />,
            }}
         />
         <Tabs.Screen
            name='statistik'
            options={{
               title: 'Statistik',
               tabBarIcon: ({color, size}) => <Ionicons name='bar-chart-outline' color={color} size={size} />,
            }}
         />
         <Tabs.Screen
            name='profile'
            options={{
               title: 'Profil',
               tabBarIcon: ({color, size}) => <Ionicons name='person-outline' color={color} size={size} />,
            }}
         />
      </Tabs>
   )
}
