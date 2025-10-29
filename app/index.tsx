import {View, Text, Button} from 'react-native'
import {Link} from 'expo-router'

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
         <Link href='/profile' asChild>
            <Button title='Profil' />
         </Link>
         <Link href='/createTask' asChild>
            <Button title='Skapa en ny syssla' />
         </Link>
         <Link href='/updateTask' asChild>
            <Button title='Ändra syssla' />
         </Link>
         <Link href='/statistics' asChild>
            <Button title='Statestik' />
         </Link>
         <Link href='/householdoverview' asChild>
            <Button title='householdoverview' />
         </Link>
         <Link href='/accountOverview' asChild>
            <Button title='konto' />
         </Link>
      </View>
   )
}
