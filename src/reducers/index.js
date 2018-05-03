import { reducer as FormReducer } from 'redux-form';
import { reducer as network } from 'react-native-offline';
import UserReducer from './user.reducer';

export default {
  form: FormReducer,
  user: UserReducer,
  network
};
