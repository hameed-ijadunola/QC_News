import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { COLORS } from '../../constants';
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const FormTextInput = ({
  onInput,
  placeholder,
  label,
  suggestion,
  isAutoSuggest,
  errorMssg,
  isRequired,
  initialValue,
  isBold,
  isDisabled,
  isPassword,
  isSearch,
  leftIcon,
  rightIcon,
  setSearch,
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [hidePassword, setHidePassword] = useState(true);
  const isFocused = useIsFocused();
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    ProximaNova_400Regular: require('../../assets/fonts/ProximaNova-Regular.otf'),
    // ProximaNova_600SemiBold: require('../../assets/fonts/Proxima Nova Bold.otf'),
  });

  useEffect(() => {
    setInputValue(initialValue);
  }, [isFocused]);

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }
  const onInputChange = (text) => {
    setInputValue(text);
    onInput(text);
  };

  const onSuggestHandler = (value) => {
    setInputValue(value);
    onInput(value);
    console.log('Car suggest', value);
    setSuggestions([]);
  };

  return (
    <View>
      {label && (
        <View style={{ flexDirection: 'row', height: 20 }}>
          <Text style={styles.text}>{label}</Text>
          {isRequired && <Text style={styles.requiredText}> *</Text>}
        </View>
      )}
      <View style={{ flexDirection: 'row' }}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            isSearch ? styles.container1 : styles.container,
            isBold ? styles.textBold : isSearch ? styles.text1 : styles.text,
            suggestions.length > 1 && { marginBottom: 0 },
            errorMssg && { marginBottom: 0 },
            isDisabled && { color: COLORS.gray },
            leftIcon && { paddingLeft: 50 },
            { flexGrow: 1 },
          ]}
          editable={isDisabled ? !isDisabled : true}
          placeholder={placeholder}
          placeholderTextColor={isBold || isSearch ? COLORS.gray : COLORS.black}
          value={inputValue}
          onBlur={() => setSuggestions([])}
          onChangeText={(text) => onInputChange(text)}
          secureTextEntry={isPassword ? hidePassword : false}
        />
        {isPassword && (
          <TouchableOpacity
            style={errorMssg ? styles.eyeIcon1 : styles.eyeIcon}
            onPress={() => setHidePassword(!hidePassword)}
          >
            <Ionicons
              name={hidePassword ? 'eye-off' : 'eye'}
              size={24}
              color={COLORS.eyeIcon}
            />
          </TouchableOpacity>
        )}
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {errorMssg && <Text style={styles.errorText}>{errorMssg}</Text>}
      {/* {isAutoSuggest &&
          suggestions &&
          suggestions.map((text, index) => (
            <TouchableOpacity
              key={index}
              onPress={
                // () => console.log('hello')
                ()=>onInputChange(text)
                // onSuggestHandler(text);
              }
              style={styles.suggestion}
            >
              <Text>{text}</Text>
            </TouchableOpacity>
          ))} */}
    </View>
  );
};

export default FormTextInput;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.gray1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    height: 48,
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#DDDDDDAA',
  },
  container1: {
    backgroundColor: COLORS.white,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    height: 45,
    borderRadius: 15,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#DDDDDDAA',
  },
  outerContainer: {
    // height: 200,
    //   left: 20,
    //   position: 'absolute',
    //   right: 20,
    //   top: 30,
    //   zIndex: 10,
    backgroundColor: 'white',
  },
  leftIcon: {
    position: 'absolute',
    bottom: 28,
    left: 16,
    zIndex: 10,
  },
  rightIcon: {
    position: 'absolute',
    // bottom: 28,
    right: 0,
    // paddingHorizontal:16,
    zIndex: 10,
    width: 48,
    height: 44,
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'ProximaNova_400Regular',
    fontSize: 13,
    lineHeight: 16,
    color: COLORS.black,
    // marginBottom: 12,
  },
  text1: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    lineHeight: 16,
    color: COLORS.gray,
    // marginBottom: 12,
  },
  textBold: {
    fontFamily: 'ProximaNova_400Regular',
    fontSize: 13,
    lineHeight: 16,
    color: COLORS.black,
    fontWeight: 'bold',
  },
  requiredText: {
    fontFamily: 'ProximaNova_400Regular',
    fontSize: 13,
    color: COLORS.red,
    marginBottom: 12,
  },
  errorText: {
    fontFamily: 'ProximaNova_400Regular',
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.red,
    marginBottom: 12,
    marginLeft: 5,
    fontStyle: 'italic',
  },
  suggestion: {
    backgroundColor: COLORS.white,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    height: 35,
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  eyeIcon: {
    right: 16,
    position: 'absolute',
    bottom: 27,
    zIndex: 1,
  },
  eyeIcon1: {
    right: 16,
    position: 'absolute',
    bottom: 12,
    zIndex: 1,
  },
});
