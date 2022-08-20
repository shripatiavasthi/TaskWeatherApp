import React, { useEffect } from 'react';
import { Button, StyleSheet, Text, View, TextInput, Alert, Image, Dimensions, Modal, Pressable } from 'react-native';
import axios from "axios";

const { height, width } = Dimensions.get('screen');

export type Props = {
    city: string;
    ListRender: boolean;
    modal: boolean;
    capital: any;
};

const Hello: React.FC<Props> = ({ city, ListRender, capital, modal }) => {

    const [cityname, setcityname] = React.useState(city)
    const [ListshouldRender, setListshouldRender] = React.useState(ListRender)
    const [citydetails, setcitydetails] = React.useState([])
    const [modalVisible, setModalVisible] = React.useState(modal);
    const [capitaldetail, setcapitaldetail] = React.useState(capital)
    const [showlogic, setshowlogic] = React.useState(false)


    console.log(capitaldetail, ">>>>>>>>>")

    

    const submitbutton = () => {
        axios.get(`https://restcountries.com/v3.1/name/${cityname}`)
            .then(function (response) {
                if (response.status === 404) {
                    setListshouldRender(false)
                } else if (response.status === 200) {
                    setListshouldRender(true)
                    setcitydetails(response?.data)
                }
            })
            .catch(function (error) {
                console.log(error, "weather api error");
            });
    }

    const weather = (data: string) => {

        axios.get(`http://api.weatherstack.com/current?access_key=d68383d3cb470ad44cbee15ef6a94864&query=${data}`)
            .then(function (response) {
                console.log(response?.data, "weather api response");
                setcapitaldetail(response?.data)
                setModalVisible(true)
            })
            .catch(function (error) {
                console.log(error, "weather api error");
                setModalVisible(false)
            });
    }

    return (
        <View style={styles.container}>
            <View >
                <Text style={styles.greeting}>
                    Welcome to Weather App
                </Text>
                <TextInput placeholder='Enter your country' onChangeText={(value) => {
                    setcityname(value);
                    if (value.length >= 0) {
                        setshowlogic(false)
                    } else {
                        setshowlogic(true)
                    }
                }}></TextInput>
                <View>
                    <Button
                        disabled={showlogic}
                        title="Submit"
                        accessibilityLabel="decrement"
                        onPress={submitbutton}
                        color="red"
                    />
                </View>
            </View>
            
            {ListshouldRender ?
                <>
                    {modalVisible ?
                        <View style={styles.modalView}>
                            <View style={styles.subview}>
                                <Image source={{ uri: `${capitaldetail?.current?.weather_icons[0]}` }} style={styles.image} />
                            </View>
                            <View style={styles.subview}>
                                <Text style={styles.modalText}>temperature  {capitaldetail?.current?.temperature} </Text>
                                <Text style={styles.modalText}>wind_speed {capitaldetail?.current?.wind_speed}</Text>
                                <Text style={styles.modalText}>precipitation {capitaldetail?.current?.precip}</Text>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <Text style={styles.textStyle}>Back</Text>
                                </Pressable>
                            </View>
                        </View>
                        :
                        <View style={styles.list}>
                            {citydetails && citydetails.map((item) => {
                                return (
                                    <View style={styles.card}>
                                        <View style={styles.subview}>
                                            <Image source={{ uri: `${item.flags.png}` }} style={styles.image} />
                                        </View>
                                        <View style={styles.subview}>
                                            <Text >capital {item.capital} </Text>
                                            <Text>population {item.population}</Text>
                                            <Text>flag  </Text>
                                            <Text>Lat , Long {item.latlng[0]} {item.latlng[1]} </Text>
                                            <View style={styles.button}>
                                                <Button
                                                    title="Country Weather"
                                                    accessibilityLabel="decrement"
                                                    onPress={() => {
                                                        weather(item.capital)
                                                    }}
                                                    color="red"
                                                />
                                            </View>
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                    }
                </>
                :
                <View >
                    <Text style={styles.greeting}> Search Details</Text>
                </View>
            }
            {/* <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.subview}>
                                <Image source={{ uri: `${capitaldetail?.current?.weather_icons[0]}` }} style={styles.image} />
                            </View>
                            <View style={styles.subview}>
                                <Text style={styles.modalText}>temperature  {capitaldetail?.current?.temperature} </Text>
                                <Text style={styles.modalText}>wind_speed {capitaldetail?.current?.wind_speed}</Text>
                                <Text style={styles.modalText}>precipitation {capitaldetail?.current?.precip}</Text>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <Text style={styles.textStyle}>Hide Modal</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center'
    },
    greeting: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 16
    },
    list: {
        height: height / 1,
        width: width / 1.1,
        // backgroundColor: 'pink',
        marginTop: 10,
    },
    card: {
        margin: 10,
        backgroundColor: 'pink',
        flexDirection: 'row',
        padding: 10
    },
    subview: {
        margin: 10,
    },
    button: {
        margin: 10,
    },
    image: {
        height: 130,
        width: 120,
    },

    /// modal design
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 20,
        backgroundColor: '#eae9ee',
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        flexDirection: 'row',
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }


});

export default Hello;