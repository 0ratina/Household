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
      </View>
   )
}
