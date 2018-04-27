import React from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import DashboardHomeComponent from './index';
import SettingsStack from './settings/routes';
import { THEME } from '../../../theme';
import SideBar from './side-bar';

export default StackNavigator({
    DrawerStack: {
        screen: DrawerNavigator({
            Home: {
                screen: DashboardHomeComponent
            },
            Settings: {
                screen: SettingsStack
            }
        }, {
            initialRouteName: 'Home',
            contentOptions: {
                activeTintColor: THEME.PRIMARY
            },
            contentComponent: props => (
                <SideBar {...props} />
            )   
        })
    }
}, {
    headerMode: 'none',
    initialRouteName: 'DrawerStack'
});
