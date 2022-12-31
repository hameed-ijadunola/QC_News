import {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
  BackHandler,
  ToastAndroid,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {theme} from '../../../constants';
const {COLORS, SIZES, FONTS} = theme;
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import {
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
} from '@expo-google-fonts/montserrat';

import {MaterialCommunityIcons, Ionicons} from '@expo/vector-icons';

import AppLoading from 'expo-app-loading';
import {StatusBar} from 'expo-status-bar';

import KeyboardAvoidingWrapper from '../../../components/KeyboardAvoidingWrapper';

import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateName,
} from '../../../helpers/validation/validation';
import {useToast} from 'react-native-toast-notifications';
import * as SQLite from 'expo-sqlite';
import {useDispatch} from 'react-redux';
import {saveCredentials} from '../../../redux/features/authSlice';

function openDatabase() {
  if (Platform.OS === 'web') {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase('UserDatabase.db');
  return db;
}

const db = openDatabase();

const SignUp = ({navigation}) => {
  const window = useWindowDimensions();
  // const screenWidth = window.width;
  const toast = useToast();
  const dispatch = useDispatch();

  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState({
    name: null,
    email: null,
    password: null,
  });

  ///handle back action

  const onSubmit = async () => {
    setLoading(true);
    try {
      const nameError = validateName(state.name);
      const emailError = validateEmail(state.email);
      const passwordError = validatePassword(state.password);
      if (emailError || passwordError || nameError) {
        setError({
          ...error,
          name: nameError,
          email: emailError,
          password: passwordError,
        });
        toast.show('Enter correct details', {
          placement: 'bottom',
          duration: 3000,
        });
        setLoading(false);
        return;
      } else {
        setError({
          ...error,
          name: null,
          email: null,
          password: null,
        });
        console.log(state.name, state.email, state.password);

        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM table_user WHERE user_email = ?',
            [state.email],
            (tx, resultSet) => {
              const len = resultSet.rows.length;
              if (len) {
                toast.hideAll();
                toast.show('Email is already registered');
              } else {
                tx.executeSql(
                  'insert into table_user (user_name, user_email, user_password) VALUES (?,?,?)',
                  [state.name, state.email, state.password],
                  (tx, results) => {
                    console.log(results);
                    console.log('Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                      toast.hideAll();
                      toast.show('Signed up successful', {
                        placement: 'top',
                        duration: 2000,
                      });
                      db.transaction(tx => {
                        tx.executeSql(
                          `SELECT * FROM table_user WHERE user_email = ? AND user_password = ?`,
                          [state.email, state.password],
                          (tx, results) => {
                            var len = results.rows.length;
                            if (len > 0) {
                              dispatch(saveCredentials(results.rows.item(0)));
                            } else {
                              navigation.navigate('SignIn');
                            }
                          },
                        );
                      });
                    } else {
                      toast.hideAll();
                      toast.show('Sign up Failed');
                    }
                  },
                );
              }
              setLoading(false);
            },
            (tx, error) => {
              console.log(error);
              setLoading(false);
            },
          );
        });
      }
    } catch (error) {
      console.log('error SigningUp', error);
      setLoading(false);
      return false;
    }
  };

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={{backgroundColor: COLORS.white, flex: 1}}>
      <StatusBar style='dark' />
      <View
        style={{
          position: 'absolute',
          left: 15,
          top: 60,
          zIndex: 1,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name='keyboard-backspace'
            size={24}
            color={COLORS.black}
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={[styles.safeArea, {marginTop: 60}]}>
          <Text style={styles.title}>{'Create\nAccount'}</Text>
          <Text style={styles.desc}>Sign up to get latest Tech News.</Text>

          <KeyboardAvoidingWrapper>
            <View>
              <MyTextInput
                label='Name'
                placeholder='Name'
                placeholderTextColor={COLORS.placeholderTxt}
                onChangeText={text => setState({...state, name: text})}
                value={state.name}
              />
              {error.name !== null && (
                <Text style={styles.errorText}>{error.name}</Text>
              )}

              <MyTextInput
                label='Email'
                placeholder='Enter email'
                placeholderTextColor={COLORS.placeholderTxt}
                onChangeText={text => setState({...state, email: text})}
                value={state.email}
              />
              {error.email !== null && (
                <Text style={styles.errorText}>{error.email}</Text>
              )}

              <MyTextInput
                label='Password'
                placeholder='Password'
                placeholderTextColor={COLORS.placeholderTxt}
                onChangeText={text => setState({...state, password: text})}
                value={state.password}
                secureTextEntry={hidePassword}
                isPassword={true}
                hidePassword={hidePassword}
                setHidePassword={setHidePassword}
              />
              {error.password !== null && (
                <Text style={styles.errorText}>{error.password}</Text>
              )}

              <TouchableOpacity
                style={!loading ? [styles.redBtn] : [styles.grayBtn]}
                onPress={onSubmit}>
                {!loading ? (
                  <Text style={styles.btnTxt}>Sign up</Text>
                ) : (
                  <ActivityIndicator size='small' color={COLORS.white} />
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingWrapper>
        </View>
        <View style={{flexDirection: 'row', marginLeft: 24, marginBottom: 20}}>
          <Text style={styles.desc}>Account registered? </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SignIn');
            }}>
            <Text style={styles.linkTxt}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUp;

const MyTextInput = ({
  label,
  shift,
  isPassword,
  hidePassword,
  setHidePassword,
  ...props
}) => {
  return (
    <View>
      <TextInput style={styles.textInput} {...props} />
      {isPassword && (
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons
            name={hidePassword ? 'eye-off' : 'eye'}
            size={24}
            color={COLORS.eyeIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  txt: {
    fontSize: 40,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: COLORS.white,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    backgroundColor: COLORS.white,
  },
  title: {
    ...FONTS.title,
    color: COLORS.black,
    paddingTop: 10,
    marginBottom: 10,
  },
  subtitle: {
    ...FONTS.h2,
    color: COLORS.black,
    fontStyle: 'normal',
    marginTop: 30,
    marginBottom: 16,
  },
  desc: {
    ...FONTS.h3,
    color: COLORS.gray,
    paddingVertical: 10,
  },
  linkTxt: {
    ...FONTS.h3,
    fontFamily: 'Poppins_700Bold',
    color: COLORS.gray,
    paddingVertical: 10,
  },
  backIcon: {
    marginBottom: 30,
  },
  redBtn: {
    width: '100%',
    height: 48,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.red,
    marginVertical: 24,
    flexDirection: 'row',
  },
  grayBtn: {
    width: '100%',
    height: 48,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.inactive_btn,
    marginVertical: 24,
    flexDirection: 'row',
  },
  btnTxt: {
    ...FONTS.btn,
    color: COLORS.white,
  },
  textInput: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginTop: 16,
    paddingVertical: 16,
    width: '100%',
    height: 48,
    backgroundColor: COLORS.placeholder_gray,
    borderColor: COLORS.placeholder_border,
    borderWidth: 1,
    borderRadius: 5,
    ...FONTS.placeholder,
  },
  placeholderTxt: {
    ...FONTS.h4,
    color: COLORS.placeholder_gray,
  },
  eyeIcon: {
    right: 16,
    position: 'absolute',
    bottom: 12,
    zIndex: 1,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 11,
  },
});
