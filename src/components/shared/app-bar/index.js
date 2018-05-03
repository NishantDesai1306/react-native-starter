import React from 'react';
import { withNavigation } from 'react-navigation';
import { 
  Header,
  Body,
  Title,
  Left,
  Button,
  Icon,
  Right,
  View,
  Text
} from 'native-base';

import { ML_10 } from '../../../util/styles';
import Styles from './styles';
import { THEME } from '../../../theme';

class AppBarComponent extends React.Component {

    constructor(props) {
        super(props);

        this.getTitle = this.getTitle.bind(this);
        this.goBack = this.goBack.bind(this);
        this.openDrawer = this.openDrawer.bind(this);
    }

    getTitle() {
        const {
            navigation,
            title
        } = this.props;

        return title || navigation.state.routeName;
    }

    goBack() {
        this.props.navigation.goBack();
    }

    openDrawer() {
        this.props.navigation.navigate('DrawerOpen');
    }

    render() {
        const backButton = (
            <Button transparent onPress={this.goBack}>
                <Icon style={{ color: THEME.TEXT_LIGHT }} name='arrow-back' />
            </Button>
        );

        const menuButton = (
            <Button transparent onPress={this.openDrawer}>
                <Icon style={{ color: THEME.TEXT_LIGHT }} name='menu' />
            </Button>
        );

        const { goBack } = this.props;
        
        return (
            <Header androidStatusBarColor={THEME.PRIMARY}>
                <View style={Styles.container}>
                    <View>
                        { goBack ? backButton : menuButton }
                    </View>
                    <View style={Styles.title}>
                        <Title style={ML_10}>{this.getTitle()}</Title>
                    </View>
                </View>
            </Header>
        );
    }
}

export default withNavigation(AppBarComponent);
