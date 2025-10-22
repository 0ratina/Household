import { Link } from 'expo-router'
import { Button, Text, View } from 'react-native'

export default function HomeScreen() {
   return (
      <View>
         <Text>Test</Text>
         <Link href='/login' asChild>
            <Button title='Gå till Login' />
         </Link>
         <Link href='/createUser' asChild>
            <Button title='Skapa användare' />
         </Link>
         <Link href='/househould' asChild>
            <Button title='hushåll' />
         </Link>
         <Link href='/createhousehold' asChild>
            <Button title='skapa hushåll ' />
         </Link>
         <Link href='/(tabs)/profile' asChild>
            <Button title='Profil' />
         </Link>
         <Link href='/createtask' asChild>
            <Button title='Skapa en ny syssla' />
         </Link>
         <Link href='/updateTask' asChild>
            <Button title='Ändra syssla' />
         </Link>
         <Link href='/(tabs)/profile' asChild>
            <Button title='Statestik' />
         </Link>
         <Link href='/joinHousehold' asChild>
            <Button title='Gå med i hushåll' />
            </Link>
         <Link href='/householdoverview' asChild>
            <Button title='householdoverview' />
         </Link>
         <Link href='/(tabs)/accountOverview' asChild>
            <Button title='Kontoöversikt' />
         </Link>
         <Link href='/taskOverview' asChild>
            <Button title='Översikt Syssla' />
         </Link>
      </View>
   )
}
