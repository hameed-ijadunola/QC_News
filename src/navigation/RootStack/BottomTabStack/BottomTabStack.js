import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeIcon from '../../../assets/images/home-tab-icon.svg';
import HomeIconRed from '../../../assets/images/home-tab-icon-red.svg';
import AccountIcon from '../../../assets/images/account-tab-icon.svg';
import AccountIconRed from '../../../assets/images/account-tab-icon-red.svg';

import {StyleSheet} from 'react-native';

import {useFonts, Poppins_300Light} from '@expo-google-fonts/poppins';

import AppLoading from 'expo-app-loading';
import About from '../../../screens/Root/About/About';
import HomeStack from './HomeStack';

const Tab = createBottomTabNavigator();

export default function BottomTabStack() {
  let [fontsLoaded] = useFonts({
    Poppins_300Light,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: 'gray',
        tabBarHideOnKeyboard: true,
        tabBarStyle: {height: 66},
      }}
      initialRouteName='News'>
      <Tab.Screen
        name='News'
        component={HomeStack}
        options={{
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.textStyleBottomBar,
          tabBarIcon: ({focused}) => (focused ? <HomeIconRed /> : <HomeIcon />),
        }}
      />
      <Tab.Screen
        name='About'
        component={About}
        options={{
          tabBarLabel: 'About Me',
          tabBarLabelStyle: styles.textStyleBottomBar,
          tabBarIcon: ({focused}) =>
            focused ? <AccountIconRed /> : <AccountIcon />,
        }}
        listeners={({navigation}) => ({
          blur: () => navigation.setParams({screen: undefined}),
        })}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
  imageIconStyleBottomBar: {
    width: 50,
    height: 50,
    marginVertical: 20,
    marginTop: 20,
  },
  textStyleBottomBar: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Poppins_300Light',
  },
});
