import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { Spinner, View } from 'native-base';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './src/store';

import { CENTER } from './src/util/styles';
import { THEME } from './src/theme';
import AppRoutes from './src/routes';

export default class AppComponent extends React.Component {
  render() {
    const loader = (
      <View style={CENTER}>
        <Spinner color={THEME.PRIMARY} />
      </View>
    );

    return (
      <Provider store={store}>
        <PersistGate loading={loader} persistor={persistor}>
          <StatusBar
            backgroundColor={THEME.PRIMARY}
            barStyle="light-content"
          />
          <AppRoutes /> 
        </PersistGate>
      </Provider>
    );
  }
}
