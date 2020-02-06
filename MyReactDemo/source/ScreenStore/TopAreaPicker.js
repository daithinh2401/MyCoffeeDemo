import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated, SectionList } from 'react-native';
import { MainColor, AppEvent } from '../MainUtils/AppUtils';

import { EventRegister } from 'react-native-event-listeners';

import { animationActionStyle } from '../MainUtils/AnimatedUtils';

import DropDownIcon from 'react-native-vector-icons/FontAwesome';
import StoresManager from './StoresManager';

export default class TopAreaPicker extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            pickerShow: false,
            pickerText: 'Chọn khu vực'
        }

        this.animateValue = new Animated.Value(this.state.pickerShow);
        this.storeManager = StoresManager.getInstance();
    }

    componentDidMount() {
        this.locationListener = EventRegister.addEventListener(AppEvent.filterAllStores,() => this.handleAllStoresFilter());
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.locationListener);
    }

    handleAllStoresFilter() {
        this.setState({ 
            pickerShow: false, 
            pickerText: 'Chọn khu vực'
        })
    }

    handleAreaPickerPress(text) {
        Animated.timing(this.animateValue, {
            toValue: !this.state.pickerShow,
            duration: 300,
        }).start()

        this.setState({ 
            pickerShow: !this.state.pickerShow, 
            pickerText: text ? text : this.state.pickerText 
        })
    }

    renderDropDownIcon() {
        let animateStyle = animationActionStyle(this.animateValue, this.state.pickerShow);

        return (
            <Animated.View style={animateStyle}>
                <DropDownIcon style={styles.iconStyle} name="caret-down" size={23} />
            </Animated.View>
        )
    }

    renderAreaPicker() {
        return (
            <TouchableOpacity
                style={styles.pickerLayout}
                onPress={() => this.handleAreaPickerPress()}
                activeOpacity={1}
            >
                <Text style={styles.pickerTextStyle}> {this.state.pickerText} </Text>
                {this.renderDropDownIcon()}
            </TouchableOpacity>
        )
    }

    renderAreaSectionList() {
        if(!this.state.pickerShow) {
            return null;
        }

        let sectionAreaList = this.storeManager.getSectionAreaList();

        return (
            <SectionList
                style={{ maxHeight: 250 }}
                showsVerticalScrollIndicator = {false}
                sections={sectionAreaList}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) =>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => this.handleAreaListItemPress(item)}
                    >
                        <Text style={styles.sectionItemTextStyle}>{item}</Text>
                    </TouchableOpacity>
                }
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeaderTextStyle}>{title}</Text>
                )}
            />
        )
    }

    handleAreaListItemPress(name) {
        this.handleAreaPickerPress(name);
        this.storeManager.filterStoresByDistrictName(name);
    }

    render() {
        return (
            <View style={styles.mainLayout}>
                {this.renderAreaPicker()}
                {this.renderAreaSectionList()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainLayout: {
        position: 'absolute', left: 0, top: 0, right: 0,
        margin: 15
    },
    pickerLayout: {
        borderRadius: 7, borderWidth: 0.3, borderColor: MainColor.gray,
        flexDirection: 'row', backgroundColor: 'white',
        justifyContent: 'center', alignItems: 'center',
        padding: 15
    },
    pickerTextStyle: {
        flex: 1, fontSize: 16, fontWeight: 'bold'
    },
    iconStyle: {
        transform: []
    },
    sectionHeaderTextStyle: {
        padding: 10, paddingLeft: 20, paddingRight: 20,
        flex: 1, backgroundColor: MainColor.whiteSmoke,
        fontSize: 16
    },
    sectionItemTextStyle: {
        padding: 20, paddingLeft: 30, paddingRight: 30,
        flex: 1, backgroundColor: 'white',
        fontSize: 16
    }
});