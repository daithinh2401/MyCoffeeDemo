import React from 'react';
import { Text, View, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';

import SimpleHeader from '../ScreenHeader/SimpleHeader'
import { toLocaleString } from '../MainUtils/AppUtils'

import OrderScreenManager from './OrderScreenManager';
import { CartBanner } from '../ScreenCart/CartBanner';
import FastImage from 'react-native-fast-image';

export default class OrderGridDetail extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const title = navigation.getParam('title');

        return {
            header: () =>
                <SimpleHeader localHeaderTitle={title} />
        };
    };

    constructor(props) {
        super(props);
    }

    handleItemPress(item) {
        if(parseInt(item.id) >= 0) {
            OrderScreenManager.getInstance().openOrderItemDetail(item, false, -1)
        }
    }

    renderGridItems(item) {
        return (
            <TouchableOpacity activeOpacity = {0.9} onPress = {() => this.handleItemPress(item)} style={styles.item}>
                <FastImage style={styles.image} source={{ uri: item.imageURL }} />
                <Text numberOfLines = {2} style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemContent}>{toLocaleString(item.price)} đ</Text>
            </TouchableOpacity>
        )
    }

    renderItem = ({ item, index }) => {
        if (item.empty === true) {
            return <View style={[styles.item, styles.itemInvisible]} />;
        }
        return (
            this.renderGridItems(item)
        );
    };

    render() {
        const dataSource = this.props.navigation.getParam('dataSource');
        return (
            <View style = {styles.container}>
                <FlatList
                    keyExtractor = {item => item.id}
                    data={formatData(dataSource, numColumns)}
                    renderItem={this.renderItem}
                    numColumns={numColumns}
                />
                <SafeAreaView>
                    <CartBanner />
                </SafeAreaView>
            </View>
        )
    }
}

const numColumns = 3;

const formatData = (data, numColumns) => {
    let dataFormat = [...data];
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
        dataFormat.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
        numberOfElementsLastRow++;
    }

    return dataFormat;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 20
    },
    item: {
        width: (Dimensions.get('window').width - 60) / numColumns,
        marginLeft: 15,
        marginTop: 20,
    },
    image: {
        height: (Dimensions.get('window').width - 50) / numColumns,
        borderRadius: 15,
        marginBottom: 5
    },
    itemInvisible: {
        backgroundColor: 'transparent',
    },
    itemTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5
    },
    itemContent: {
        fontSize: 15
    }
});