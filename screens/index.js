// /src/screens/index.js

import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import TransferScreen from './TransferScreen';
import PaymentScreen from './PaymentScreen';
import PaymentDetailsScreen from './PaymentDetailsScreen';

const Stack = createStackNavigator();

const MainStack = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Transfer" component={TransferScreen} />
    <Stack.Screen name="Payment" component={PaymentScreen} />
    <Stack.Screen name="PaymentDetails" component={PaymentDetailsScreen} />
  </Stack.Navigator>
);

export default MainStack;

//YORUM SATIRINA ALABİLİRSİN HEPSİNİ. OLMASI YA DA OLMAMASI HİCBİR SEY DEĞİŞTİRMİYOR.
