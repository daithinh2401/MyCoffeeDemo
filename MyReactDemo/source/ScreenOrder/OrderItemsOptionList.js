import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { MainColor, AppEvent, toLocaleString } from '../MainUtils/AppUtils';

import { EventRegister } from 'react-native-event-listeners'

import { CheckBox } from 'react-native-elements'
import OrderPopupManager from './OrderPopupManager';

export default class OrderItemsOptionList extends React.Component {

    constructor(props) {
        super(props);
    }

    UNSAFE_componentWillMount() {
        this.popupManager = OrderPopupManager.getInstance();
    }

    prepareDataList(item) {
        let { size, toping, description } = item;
        let list = [];

        if (size) list.push({ title: 'Size', data: size });
        if (toping) list.push({ title: 'Topping', data: toping });
        if (description) list.push({ title: 'Giới thiệu món', data: description });

        return list;
    }

    render() {
        let mainItem = this.popupManager.getMainItem();
        let dataList = this.prepareDataList(mainItem);

        return (
            <FlatList
                style={styles.mainLayout}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => 'key' + index}
                data={dataList}
                renderItem={({index}) => 
                    <OptionsLayout index = {index} item={dataList[index]} />
                }
            />
        )
    }
}

class OptionsLayout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            updateItem: false
        }
    }

    UNSAFE_componentWillMount() {
        this.popupManager = OrderPopupManager.getInstance();

        let sizeChecking = this.popupManager.getSizeChecking();
        this.popupManager.updateSizeCheck(sizeChecking.title, sizeChecking.value);
    }

    componentDidMount() {
        this.itemCheckListener = EventRegister.addEventListener(AppEvent.updatePopupUI, (updateItem) => {
            this.setState({
                updateItem
            });
        })
    }

    componentWillUnmount() {
        this.popupManager.removeInstance();

        EventRegister.removeEventListener(this.itemCheckListener);
    }

    renderDivider(lastItem) {
        return (
            <View style = {[{height: 0.3, backgroundColor: MainColor.gray}, lastItem ? {}: {marginLeft: 20, marginRight: 20}]} />
        )
    }

    renderTitle(title) {
        return (
            <View>
                <Text style={styles.titleTextSize}>{title}</Text>
            </View>
        )
    }

    updatePrice(price) {
        if(price > 0) {
            return "+ " + toLocaleString(price) + " đ";
        }

        return "";
    }


    /* -------------------- Options Size -------------------- */
    updateSizeCheck(title, value) {
        this.popupManager.updateSizeCheck(title, value);
    }

    renderSizeItem(item, index) {
        return (
            <TouchableOpacity  
                key = {index}
                onPress = {() => this.updateSizeCheck(item.sizeTitle, item.sizeFee)}
                activeOpacity = {0.9} 
                style = {styles.toppingLayout} >
                <CheckBox 
                    onPress = {() => this.updateSizeCheck(item.sizeTitle, item.sizeFee)}
                    checked = {this.popupManager.isCheckingSize(item.sizeTitle)}
                    checkedColor = {MainColor.orange} 
                    checkedIcon = 'dot-circle-o' 
                    uncheckedIcon = 'circle-o'/>
                <Text style = {[styles.descriptionTextStyle, {flex: 1}, this.popupManager.isCheckingSize(item.sizeTitle) ? styles.textStyleBold : {}]}>{item.sizeTitle}</Text>
                <Text style = {[styles.descriptionTextStyle , this.popupManager.isCheckingSize(item.sizeTitle) ? styles.textStyleBold : {}]}>{this.updatePrice(item.sizeFee)}</Text>
            </TouchableOpacity>
        )
    }

    renderSizeLayout(data) {
        return (
            data.map((item, index) => {
                let isLastItem = index == data.length - 1;
                return(this.renderSizeItem(item, index, isLastItem))
            })
        )
    }
    /* -------------------- Options Size -------------------- */

    /* -------------------- Options Topping -------------------- */
    updateToppingCheckList(toppingName, toppingFee) {
        let itemIndex = this.popupManager.isToppingListHaveItem(toppingName, toppingFee);
        this.popupManager.addOrRemoveTopping(toppingName, toppingFee, itemIndex);
    }

    renderToppingItem(item, index) {
        let havingItem = this.popupManager.isToppingListHaveItem(item.toppingName, item.toppingFee) != -1;

        return (
            <TouchableOpacity 
                key = {index}
                onPress = {() => this.updateToppingCheckList(item.toppingName, item.toppingFee)} 
                activeOpacity = {0.9} 
                style = {styles.toppingLayout} >
                <CheckBox 
                    onPress = {() => this.updateToppingCheckList(item.toppingName, item.toppingFee)}
                    checkedColor = {MainColor.orange} checked = {havingItem}/>
                <Text style = {[styles.descriptionTextStyle, {flex: 1}, havingItem ? styles.textStyleBold : {}]}>{item.toppingName}</Text>
                <Text style = {[styles.descriptionTextStyle, havingItem ? styles.textStyleBold : {}]}>{this.updatePrice(item.toppingFee)}</Text>
            </TouchableOpacity>
        )
    }

    renderToppingLayout(data) {
        return (
            data.map((item, index) => {
                let isLastItem = index == data.length - 1;
                return(this.renderToppingItem(item, index, isLastItem))
            })
        )
    }
    /* -------------------- Options Topping -------------------- */

    renderDescriptionLayout(data) {
        return (
            <View style={styles.descriptionLayout}>
                <Text style={styles.descriptionTextStyle}>{data}</Text>
            </View>
        )
    }

    renderItem() {
        let { title, data } = this.props.item;
        let renderLayout;

        if (title == 'Size' && data.length > 0) {
            renderLayout = this.renderSizeLayout(data);
        }
        else if (title == 'Topping' && data.length > 0) {
            renderLayout = this.renderToppingLayout(data);
        }
        else if (title == 'Giới thiệu món' && data.length > 0) {
            renderLayout = this.renderDescriptionLayout(data);
        }

        return (
            <View>
                {this.renderTitle(title)}
                {renderLayout}
            </View>
        )
    }

    render() {
        return (
            <View>
                {this.renderItem()}
            </View>
        )
    }
}

const styles = StyleSheet.create({

    mainLayout: {
        backgroundColor: MainColor.whiteSmoke
    },
    titleTextSize: {
        fontSize: 17,
        fontWeight: 'bold',
        padding: 10,
        paddingLeft: 15,
    },
    descriptionTextStyle: {
        fontSize: 16,
    },
    textStyleBold: {
        fontWeight: 'bold',
    },
    descriptionLayout: {
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: 'white'
    },
    toppingLayout: {
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'white',
        paddingRight: 20,
    },
    dividerStyle: {
        flex: 1, 
        height: 0.3, 
        backgroundColor: MainColor.gray
    }
});