import React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { AppEvent, MainColor, TestOrderItem } from '../MainUtils/AppUtils';
import OrderScreenManager from './OrderScreenManager';

import { EventRegister } from 'react-native-event-listeners';

import Icon from 'react-native-vector-icons/Ionicons';

import OrderItem from './OrderItem';
import { TouchableOpacity } from 'react-native-gesture-handler';

import ScreenManager from '../MainApp/AppController/ScreenManager'
import { Screen } from '../MainUtils/AppUtils';

import { CartBanner } from '../ScreenCart/CartBanner';

export default class OrderScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dataList: TestOrderItem,
            itemShowedIndex: 0,
        }

        mOderScreenManager = OrderScreenManager.getInstance();
    }

    registerObserver() {
        this.orderItemListener = EventRegister.addEventListener(AppEvent.updateOrderScreenItem, (dataList) => {
            this.setState({
                dataList,
            });
        })
    }

    removeObserver() {
        EventRegister.removeEventListener(this.orderItemListener);
    }

    componentDidMount() {
        this.registerObserver();
        mOderScreenManager.fetchData();
    }

    componentWillUnmount() {
        this.removeObserver();
    }

    renderHeader(bigItem) {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    if (bigItem.id < 0) {
                        return;
                    }
                    ScreenManager.getInstance().openScreen(Screen.OrderGridDetail,
                        {
                            title: bigItem.title,
                            dataSource: bigItem.data
                        });
                }}>
                <View style={styles.orderHeaderLayout}>
                    <Text style={styles.orderHeaderTitle}> {bigItem.title} </Text>
                    <Icon style={{ marginBottom: 3 }} name="ios-arrow-forward" size={20} />
                </View>
            </TouchableOpacity>

        )
    }

    handleMainFlatListScroll = ({ changed }) => {
        let itemChanged = changed[0];
        if (itemChanged.isViewable && itemChanged.title != " ") {
            this.updateScrollIndex(itemChanged.index);
        }
    }

    updateScrollIndex(index) {
        this.setState({
            itemShowedIndex: index
        })
        this.titleFlatListRef.scrollToIndex({ index: index, viewPosition: 0.5 })
    }

    handleMainListBeginScroll = () => {
        this.mainListScrolling = true;

        setTimeout(
            () => this.handleMainListEndScroll()
            , 1200);
    }

    handleMainListEndScroll = () => {
        this.mainListScrolling = false;
    }


    /* ---------------------------------- Header title horizontal list ---------------------------------- */
    renderTitleHorizontalList() {
        return (
            <View style={styles.titleHorizontalListLayout}>
                <FlatList
                    horizontal={true}
                    ref={(ref) => { this.titleFlatListRef = ref; }}
                    keyExtractor={item => item.id}
                    data={this.state.dataList}
                    showsHorizontalScrollIndicator={false}
                    renderItem={
                        ({ item, index }) => this.renderTitleHorizontalItem(item, index)
                    }
                />
            </View>
        )
    }

    renderTitleHorizontalItem(item, index) {
        return (
            <TouchableOpacity
                style={[parseInt(item.id) == this.state.itemShowedIndex && item.title != " " ? styles.titleHorizontalItemLayout : {}, { marginRight: 15 }]}
                activeOpacity={0.9}
                onPress={() => {
                    if (!this.mainListScrolling) {
                        this.updateScrollIndex(index);
                        this.mainFlatListRef.scrollToIndex({ animated: false, index: index });
                    }
                }}>
                <Text style={
                    [
                        styles.titleHorizontalListTextStyle,
                        parseInt(item.id) == this.state.itemShowedIndex ? styles.titleTextColorBlack : styles.titleTextColorGray
                    ]}>
                    {item.title}
                </Text>
            </TouchableOpacity>
        )
    }
    /* ---------------------------------- Header title horizontal list ---------------------------------- */



    /* ---------------------------------- Main Order List ---------------------------------- */
    renderMainOderList() {
        return (
            <FlatList
                ref={(ref) => { this.mainFlatListRef = ref; }}
                onMomentumScrollBegin={() => this.handleMainListBeginScroll()}
                onViewableItemsChanged={this.handleMainFlatListScroll}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 100
                }}
                keyExtractor={item => item.id}
                data={this.state.dataList}
                showsVerticalScrollIndicator={false}
                renderItem={
                    ({ item }) => this.renderOrderLayout(item, parseInt(item.id) == this.state.dataList.length - 1 ? true : false)
                }
            />
        )
    }

    renderOrderLayout(bigItem, lastItemInList) {
        return (
            <View style={styles.mainLayout}>
                {this.renderHeader(bigItem)}
                <FlatList
                    keyExtractor={item => item.id}
                    data={bigItem.data}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={
                        ({ item }) => <OrderItem lastItem={parseInt(item.id) == bigItem.data.length - 1 ? true : false} item={item} />
                    }
                />
                <View style={{ flex: 1, height: 1, backgroundColor: MainColor.lightGray, marginTop: 30, marginBottom: lastItemInList ? 50 : 0 }} />
            </View>
        )
    }
    /* ---------------------------------- Main Order List ---------------------------------- */

    render() {
        return (
            <View style={styles.mainLayout}>
                {this.renderTitleHorizontalList()}
                {this.renderMainOderList()}
                <CartBanner />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainLayout: {
        flex: 1,
        backgroundColor: 'white'
    },
    titleHorizontalListLayout: {
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: 'gray'
    },
    titleHorizontalListTextStyle: {
        paddingBottom: 12,
        paddingTop: 12,
        fontSize: 16,
        fontWeight: 'bold'
    },
    titleHorizontalItemLayout: {
        borderBottomWidth: 3,
        borderColor: 'orange'
    },
    titleTextColorBlack: {
        color: 'black'
    },
    titleTextColorGray: {
        color: '#BBBBBB'
    },
    orderHeaderLayout: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white'
    },
    orderHeaderTitle: {
        flex: 1,
        fontSize: 17,
        fontWeight: 'bold',
    },
    orderLayoutFooter: {
        marginTop: 20,
        borderBottomWidth: 0.5,
        borderColor: 'gray',
    }
});