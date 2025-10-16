import { View, Text, Button } from 'react-native'
import { Link } from 'expo-router'

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
<<<<<<< HEAD
         <Link href='/createhousehold' asChild>
            <Button title='skapa hushåll ' />
         <Link href="/profile">
=======
         <Link href='/profile' asChild>
>>>>>>> ae80ad067852fc0da591c536a9c43b70b99ea970
            <Button title='profile' />
         </Link>
      </View>
   )
}
