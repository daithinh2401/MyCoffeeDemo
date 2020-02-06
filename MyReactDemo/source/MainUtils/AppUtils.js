export const ScreenTypeEnum = {
    UnknownScreen: -1,
    NewScreen: 0,
    OrderScreen: 1,
    StoreScreen: 2,
    AccountScreen: 3,
    WebScreen: 4,
    RewardScreen: 5,
    AccountInfoScreen: 6,
    MusicScreen: 7,
    HistoryScreen: 8,
    PaymentScreen: 9,
    HelpScreen: 10,
    SettingScreen: 11,
    OrderGridDetail: 12,
    CartScreen: 13,
    UserRankScreen: 14,
    StoreDetailScreen: 15,
    LoginScreen: 16,
    SignUpScreen: 17,
    AppStackNavigation: 18,
    AuthStackNavigation: 19,
};

export const MapScreenType = new Map([
    ['UnknownScreen', -1],
    ['NewScreen', 0],
    ['OrderScreen', 1],
    ['StoreScreen', 2],
    ['AccountScreen', 3],
    ['WebScreen', 4],
    ['RewardScreen', 5],
    ['AccountInfoScreen', 6],
    ['MusicScreen', 7],
    ['HistoryScreen', 8],
    ['PaymentScreen', 9],
    ['HelpScreen', 10],
    ['SettingScreen', 11],
    ['OrderGridDetail', 12],
    ['CartScreen', 13],
    ['UserRankScreen', 14],
    ['StoreDetailScreen', 15],
    ['LoginScreen', 16],
    ['SignUpScreen', 17],
    ['AppStackNavigation', 18],
    ['AuthStackNavigation', 19],
]);

export const Screen = {
    HomeScreen: {
        name: 'Home',
        type: ScreenTypeEnum.NewScreen
    },
    OrderScreen: {
        name: 'Order',
        type: ScreenTypeEnum.OrderScreen
    },
    StoreScreen: {
        name: 'Store',
        type: ScreenTypeEnum.StoreScreen
    },
    AccountScreen: {
        name: 'Account',
        type: ScreenTypeEnum.AccountScreen
    },
    WebScreen: {
        name: 'WebScreen',
        type: ScreenTypeEnum.WebScreen
    },
    OrderGridDetail: {
        name: 'OrderGridDetail',
        type: ScreenTypeEnum.OrderGridDetail
    },
    CartScreen: {
        name: 'CartScreen',
        type: ScreenTypeEnum.CartScreen
    },
    RewardScreen: {
        name: 'RewardScreen',
        type: ScreenTypeEnum.RewardScreen
    },
    UserRankScreen: {
        name: 'UserRankScreen',
        type: ScreenTypeEnum.UserRankScreen
    },
    AccountInfoScreen: {
        name: 'AccountInfoScreen',
        type: ScreenTypeEnum.AccountInfoScreen
    },
    MusicScreen: {
        name: 'MusicScreen',
        type: ScreenTypeEnum.MusicScreen
    },
    HistoryScreen: {
        name: 'HistoryScreen',
        type: ScreenTypeEnum.HistoryScreen
    },
    PaymentScreen: {
        name: 'PaymentScreen',
        type: ScreenTypeEnum.PaymentScreen
    },
    HelpScreen: {
        name: 'HelpScreen',
        type: ScreenTypeEnum.HelpScreen
    },
    SettingScreen: {
        name: 'SettingScreen',
        type: ScreenTypeEnum.SettingScreen
    },
    StoreDetailScreen: {
        name: 'StoreDetailScreen',
        type: ScreenTypeEnum.StoreDetailScreen
    },
    LoginScreen: {
        name: 'LoginScreen',
        type: ScreenTypeEnum.LoginScreen
    },
    SignUpScreen: {
        name: 'SignUpScreen',
        type: ScreenTypeEnum.SignUpScreen
    },
    AuthStackNavigation: {
        name: 'AuthStackNavigation',
        type: ScreenTypeEnum.AuthStackNavigation
    },
    AppStackNavigation: {
        name: 'AppStackNavigation',
        type: ScreenTypeEnum.AppStackNavigation
    }
}

export const MainColor = {
    whiteSmoke: '#F5F5F5',
    lightGray: '#EEEEEE',
    gray: '#AAAAAA',
    activeColor: 'tomato',
    red: 'red',
    orange: '#FF9900',
    green: '#33CC66'
};

export const DefaultRegionDelta = {
    latitudeDelta: 0.025,
    longitudeDelta: 0.025
}

export const DefaultMiniMapRegionDelta = {
    latitudeDelta: 0.008,
    longitudeDelta: 0.008
}

export const AppEvent = {
    changeScreen: 'CHANGE_SCREEN',
    updateHeader: 'UPDATE_HEADER',
    updateNewsScreenItem: 'UPDATE_NEWS_SCREEN_ITEM',
    updateOrderScreenItem: 'UPDATE_ORDER_SCREEN_ITEM',
    orderItemDetailPopupVisible: 'ITEM_DETAIL_POPUP_VISIBLE',
    updatePopupUI: 'UPDATE_ORDER_POPUP',
    newItemInCart: 'NEW_ITEM_IN_CARD',
    locationInit: 'LOCATION_INIT',
    locationReload: 'LOCATION_RELOAD',
    updateStoreUI: 'UPDATE_STORES_UI',
    filterAllStores: 'ALL_STORES_FILTERED',
    storeSortedByDistance: 'STORE_SORTED_BY_DISTANCE',
    showProgressDialog: 'SHOW_PROGRESS_DIALOG',
}

export function copyObject(object) {
    let cloneObject = null;
    if(object) {
        cloneObject = JSON.parse(JSON.stringify(object));
    }

    return cloneObject;
}

export function toLocaleString(price) {
    if(Platform.OS === 'ios') {
        return price.toLocaleString()
    }
    
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const DefaultImageURL = {
    uri: "http://www.tiptoncommunications.com/components/com_easyblog/themes/wireframe/images/placeholder-image.png"
}

export const TestNewsScreen = [
    {
        id: '0',
        imageURL: {
            uri: DefaultImageURL.uri
        },
        title: '\n',
        content: '\n\n',
        bottomButton: ' ',
        sourceURL: {
            uri: ''
        }
    },
    {
        id: '1',
        imageURL: {
            uri: DefaultImageURL.uri
        },
        title: '\n',
        content: '\n\n',
        bottomButton: ' ',
        sourceURL: {
            uri: ''
        }
    },
    {
        id: '2',
        imageURL: {
            uri: DefaultImageURL.uri
        },
        title: '\n',
        content: '\n\n',
        bottomButton: ' ',
        sourceURL: {
            uri: ''
        }
    }
]

export const TestOrderItem = [
    {
        id: "-1",
        title: " ",
        data: [
            {
                id: "-1",
                name: " ",
                imageURL: DefaultImageURL.uri,
                price: -1
            },
            {
                id: "-2",
                name: " ",
                imageURL: DefaultImageURL.uri,
                price: -1
            }
        ]
    },
    {
        id: "-2",
        title: " ",
        data: [
            {
                id: "-1",
                name: " ",
                imageURL: DefaultImageURL.uri,
                price: -1
            },
            {
                id: "-2",
                name: " ",
                imageURL: DefaultImageURL.uri,
                price: -1
            }
        ]
    },
    {
        id: "-3",
        title: " ",
        data: [
            {
                id: "-1",
                name: " ",
                imageURL: DefaultImageURL.uri,
                price: -1
            },
            {
                id: "-2",
                name: " ",
                imageURL: DefaultImageURL.uri,
                price: -1
            }
        ]
    }
]