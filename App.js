import 'react-native-gesture-handler';
import React, {useCallback, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StyleSheet, Text, View} from 'react-native';
import RootStack from './src/navigation/RootStack/RootStack';
import {ToastProvider} from 'react-native-toast-notifications';
import {COLORS} from './src/constants';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('UserDatabase.db');
const Stack = createStackNavigator();

export default function App({navigation}) {
  const [appIsReady, setAppIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState('RootStack');
  let persistor = persistStore(store);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          Poppins_400Regular,
          Poppins_500Medium,
          Poppins_600SemiBold,
        });
        db.transaction(tx => {
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS table_user (id INTEGER PRIMARY KEY AUTOINCREMENT, user_name TEXT, user_email TEXT, user_password TEXT)',
          );
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  const Toast = props => {
    return (
      <View
        style={{
          borderRadius: props.borderRadius ? props.borderRadius : 20,
          paddingVertical: props.paddingVertical ? props.paddingVertical : 10,
          paddingHorizontal: props.paddingHorizontal
            ? props.paddingHorizontal
            : 10,
          backgroundColor: props.backgroundColor
            ? props.backgroundColor
            : COLORS.red_light2,
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          {props.title && (
            <Text
              style={{
                color: props.titleColor,
                fontSize: 11,
                fontFamily: 'Poppins_500Medium',
              }}>
              {props.title}
            </Text>
          )}
          {props.text && (
            <Text
              style={{
                color: props.textColor,
                fontSize: 11,
                fontFamily: 'Poppins_400Regular',
              }}>
              {props.text}
            </Text>
          )}
        </View>
        {props.action && (
          <Text
            style={{
              color: props.actionColor,
              fontSize: 11,
              fontFamily: 'Poppins_600SemiBold',
            }}>
            {props.action}
          </Text>
        )}
        {/* {props.message&& */}
        {props.message !== '' && (
          <Text
            style={{
              color: props.textColor ? props.textColor : COLORS.black,
              fontSize: 11,
              fontFamily: 'Poppins_400Regular',
            }}>
            {props.message}
          </Text>
        )}
      </View>
    );
  };
  return (
    <ToastProvider
      // placement='bottom | top'
      // duration={5000}
      // animationType='slide-in | zoom-in'
      // animationDuration={250}
      offsetTop={120} // offset for both top and bottom toasts
      offsetBottom={100} // offset for both top and bottom toasts
      // offsetTop={30}
      // offsetBottom={40}
      swipeEnabled={true}
      renderToast={toast => <Toast {...toast} />}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
              initialRouteName={initialRoute}>
              <Stack.Screen name='RootStack' component={RootStack} />
            </Stack.Navigator>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    fontFamily: 'Montserrat',
    fontSize: 30,
  },
});
