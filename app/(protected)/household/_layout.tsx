import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'

export default function HouseholdTabsLayout() {
   return (
      <Tabs>
         <Tabs.Screen
            name='overview'
            options={{
               title: 'Sysslor',
               headerTitleStyle: {fontSize: 24, fontWeight: '600'},
               tabBarIcon: ({color, size}) => <Ionicons name='home-outline' color={color} size={size} />,
            }}
         />
         <Tabs.Screen
            name='dayOverview'
            options={{
               title: 'DagsVy',
               headerTitleStyle: {fontSize: 24, fontWeight: '600'},
               tabBarIcon: ({color, size}) => <Ionicons name='today-outline' color={color} size={size} />,
            }}
         />
         <Tabs.Screen
            name='statistics'
            options={{
               title: 'Statistik',
               headerTitleStyle: {fontSize: 24, fontWeight: '600'},
               tabBarIcon: ({color, size}) => <Ionicons name='bar-chart-outline' color={color} size={size} />,
            }}
         />
         <Tabs.Screen
            name='profile'
            options={{
               title: 'Profil',
               headerTitleStyle: {fontSize: 24, fontWeight: '600'},
               tabBarIcon: ({color, size}) => <Ionicons name='person-outline' color={color} size={size} />,
            }}
            
         />
      </Tabs>
   )
}
