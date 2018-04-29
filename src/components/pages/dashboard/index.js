import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { 
  Text, Icon,
} from 'native-base';

import AppBar from '../../shared/app-bar';
import { ML_10, FLEX_1, HORIZONTALLY_CENTER, MT_20 } from '../../../util/styles';
import * as Styles from './styles';

class DashboardComponent extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Home',
    drawerIcon: ({ tintColor }) => (
      <Icon 
        ios='ios-home'
        android="md-home"
        style={{ fontSize: 20, color: tintColor }}
      />
    )
  };

  render() {
    const { user } = this.props;

    return (
      <View style={FLEX_1}>
        <AppBar />
        <View style={[HORIZONTALLY_CENTER, MT_20]}>
          <Text style={[ML_10, Styles.WELCOME_TEXT]}>
            Hello {user.username}, this is your Dashboard.
          </Text>
        </View>
      </View>
    );
  }
}

function mapStateToProps({ user }) {
  return {
    user
  };
}
const connectedLoginForm = connect(mapStateToProps, null)(DashboardComponent);

export default connectedLoginForm;
