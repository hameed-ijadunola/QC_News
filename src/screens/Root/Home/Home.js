import {
  Alert,
  BackHandler,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import BackArrow from '../../../assets/images/left_arrow.svg';
import RightArrow from '../../../assets/images/right__arrow.svg';
import RightArrowBlack from '../../../assets/images/right__arrow_black.svg';
import LeftArrow from '../../../assets/images/left__arrow.svg';
import {COLORS} from '../../../constants/index';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import {
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
} from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';
import {
  useGetNewsDetailsMutation,
  useGetTopStoriesIdsQuery,
} from '../../../redux/features/newsApi';
import {saveTopStoriesId, setNewsFeed} from '../../../redux/features/newsSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useToast} from 'react-native-toast-notifications';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';

const Home = ({navigation}) => {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const dispatch = useDispatch();
  const toast = useToast();
  const {topStoriesId, newsFeed} = useSelector(state => state.newsFeed);
  const [range, setRange] = useState({no1: 0, no2: 10});
  const [refreshing, setRefreshing] = useState(true);
  const [refetch, setRefetch] = useState(true);
  const {
    data: getTopStoriesId,
    isFetching,
    isSuccess,
  } = useGetTopStoriesIdsQuery({
    refetchOnMountOrArgChange: true,
  });
  const [getNewsDetails, {isLoading: isGettingNewDetails}] =
    useGetNewsDetailsMutation();
  const fetchDetails = async arrIds => {
    let result = [];
    for (let i = 0; i < arrIds.length; i++) {
      const id = arrIds[i];
      const det = await getNewsDetails(id);
      if (det?.data) {
        console.log(det?.data);
        result.push(det?.data);
      }
    }
    dispatch(setNewsFeed(result));
    setRefreshing(false);
  };

  ///handle back action
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Exit QC News!', 'Are you sure you want to exit?', [
          {
            text: 'No',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'Yes', onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      };

      // Add Event Listener for hardwareBackPress
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        // Once the Screen gets blur Remove Event Listener
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );

  useEffect(() => {
    setRefreshing(true);
    isSuccess && dispatch(saveTopStoriesId(getTopStoriesId));
  }, [range, isFetching, isSuccess]);
  useEffect(() => {
    setRefreshing(true);
    fetchDetails(topStoriesId.slice(range.no1, range.no2));
  }, [topStoriesId, range]);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <>
      <StatusBar style='light' />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.title}>Latest Tech News</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                width: 45,
                height: 45,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              disabled={refreshing || isGettingNewDetails}
              onPress={() => {
                if (range.no1 !== 0) {
                  setRange({no1: range.no1 - 10, no2: range.no2 - 10});
                }
              }}>
              <LeftArrow marginRight={5} />
            </TouchableOpacity>
            <Text style={styles.no}>{range.no1}</Text>
            <Text style={styles.no}> - </Text>
            <Text style={styles.no}>{range.no2}</Text>
            <TouchableOpacity
              style={{
                width: 45,
                height: 45,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              disabled={refreshing || isGettingNewDetails}
              onPress={() => {
                console.log('pressed');
                range.no2 + 10 <= topStoriesId.length
                  ? setRange({
                      no1: range.no2,
                      no2: range.no2 + 10,
                    })
                  : range.no2 === topStoriesId.length
                  ? setRange({
                      no1: range.no1,
                      no2: topStoriesId.length,
                    })
                  : range.no2 + 10 > topStoriesId.length &&
                    setRange({
                      no1: range.no2,
                      no2: topStoriesId.length,
                    });
              }}>
              <RightArrow marginRight={10} marginLeft={10} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.halfModal]}>
          <FlatList
            data={[...newsFeed].sort(
              (a, b) =>
                moment(b?.time).format('x') - moment(a?.time).format('x'),
            )}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={styles.newsContainer}
                  key={item?.id}
                  onPress={() =>
                    navigation.navigate('NewsDetails', {
                      url: item?.url,
                      title: item?.title,
                    })
                  }>
                  <View style={styles.newsSubContainer}>
                    <Text style={styles.newsTitle} numberOfLines={2}>
                      {item?.title}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}>
                      <Text style={styles.text}>By: {item?.by}</Text>
                      <Text style={styles.text}>
                        Time:
                        {moment().isSame(
                          new Date(item?.time * 1000).toISOString(),
                          'day',
                        )
                          ? moment(
                              new Date(item?.time * 1000).toISOString(),
                            ).format('hh:mm a')
                          : moment(
                              new Date(item?.time * 1000).toISOString(),
                            ).format('hh:mma | DD/MM/YY')}
                      </Text>
                    </View>
                  </View>
                  <View style={{paddingLeft: 10, justifyContent: 'center'}}>
                    <RightArrowBlack />
                  </View>
                </TouchableOpacity>
              );
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing || isGettingNewDetails}
                onRefresh={() => setRefetch(!refetch)}
              />
            }
          />
        </View>
      </View>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  halfModal: {
    width: '100%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingTop: 30,
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    marginTop: 54,
    marginBottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: COLORS.white,
    marginLeft: 10,
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
  },
  newsTitle: {
    color: 'black',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
  },
  cancel: {
    right: 20,
    position: 'absolute',
  },
  newsContainer: {
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    borderColor: COLORS.gray1,
    marginBottom: 15,
    width: '100%',
    flexDirection: 'row',
  },
  newsSubContainer: {
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    width: '90%',
  },
  redBtnTxt: {
    color: COLORS.white,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
  },
  text: {
    color: COLORS.gray,
    fontSize: 13,
    lineHeight: 24,
    fontFamily: 'Montserrat_400Regular',
  },
  no: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 16,
    fontFamily: 'Montserrat_400Regular',
  },
});
