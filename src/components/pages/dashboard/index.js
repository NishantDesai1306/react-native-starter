import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { 
  Text, Icon,
} from 'native-base';

import AppBar from '../../shared/app-bar';
import { ML_10 } from '../../../util/styles';

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
    return (
      <View>
        <AppBar />
        <Text style={ML_10}>{JSON.stringify(this.props.user, null, 4)} </Text>
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
