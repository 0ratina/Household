import {useQuery} from '@tanstack/react-query'
import {Redirect} from 'expo-router'
import {ActivityIndicator, View} from 'react-native'
import {authKey} from '../../src/auth/bindAuthStateChanged'
import {auth} from '../../src/firebase'

export default function Index() {
   const {data: user, isLoading} = useQuery({
      queryKey: authKey,
      queryFn: async () => auth.currentUser ?? null,
      initialData: auth.currentUser ?? null,
   })

   if (user === undefined) {
      return (
         <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size='large' />
         </View>
      )
   }

   return user ? <Redirect href='/(protected)/accountOverview' /> : <Redirect href='/(public)/login' />
}
