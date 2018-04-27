import { reducer as FormReducer } from 'redux-form';
import UserReducer from './user.reducer';

export default {
  form: FormReducer,
  user: UserReducer,
};
