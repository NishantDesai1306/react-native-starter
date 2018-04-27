import { StackNavigator } from 'react-navigation';
import LoginComponent from './components/pages/login';
import RegistrationComponent from './components/pages/registration';
import DashboardStack from './components/pages/dashboard/routes';

const AppNavigator = StackNavigator({
    Login: { screen: LoginComponent },
    Registration: { screen: RegistrationComponent },
    Dashboard: {
        screen: DashboardStack
    }
}, {
    headerMode: 'none',
    initialRouteName: 'Login',
    navigationOptions: {
        gesturesEnabled: false
    }
});

export default AppNavigator;
