import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { withNavigation, NavigationActions } from 'react-navigation';
import { Field, reduxForm } from 'redux-form';
import { 
  Button,
  Text,
  Icon,
  Grid,
  Col,
  Item,
  Input,
  Spinner
} from 'native-base';

import Styles from './styles';
import { 
  HORIZONTALLY_CENTER,
  FLEX_1,
  MT_20,
  FLEX_3,
  EMPTY,
  DISABLED_TEXT,
  CENTER
} from '../../../util/styles';
import { REDUX_FORM_KEYS } from '../../../services/constant.service';
import { login } from '../../../services/auth.service';
import { getUserDetails } from '../../../services/user.service';
import { THEME } from '../../../theme';

class LoginComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      validatingToken: true
    };

    this.renderInput = this.renderInput.bind(this);
    this.login = this.login.bind(this);
    this.navigateToDashboard = this.navigateToDashboard.bind(this);
  }

  componentWillMount() {
    getUserDetails()
    .then((data) => {
      if (data) {
        this.navigateToDashboard();
      }
    })
    .catch(() => {
      this.setState({
        validatingToken: false
      });
    });
  }

  navigateToDashboard() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Dashboard' })
      ]
    });
    
    this.props.navigation.dispatch(resetAction);
  }

  login() {
    const { loginDetails } = this.props;

    login(loginDetails.values)
    .then(() => {
      this.navigateToDashboard();
    })
    .catch((err) => {
      console.log('error', err);
    });
  }

  renderInput({ input, label, meta: { error } }) {
    let hasError = false;
    
    if (error !== undefined) {
      hasError = true;
    }

    return ( 
      <View>
        <Item error={hasError} style={Styles.field}>
          <Text style={Styles.fieldText}>{label}</Text>
          <Input {...input} style={Styles.fieldInput} />
        </Item>
        {hasError ? <Text style={Styles.fieldErrorText}>{error}</Text> : <Text />}
      </View>
    );
  }

  render() {
    const { pristine, submitting, valid } = this.props;
    const disableSubmitButton = pristine || submitting || !valid;
    const submitButtonStyle = {
      container: Object.assign({},
          Styles.submitButton,
          disableSubmitButton ? { backgroundColor: THEME.DISABLED_TEXT } : EMPTY
      ),
      text: Object.assign({},
          Styles.submitButtonText,
          disableSubmitButton ? { color: THEME.TEXT_DARK } : EMPTY
      )
    };
    const { validatingToken } = this.state;

    if (validatingToken) {
      return (
        <View style={CENTER}>
          <Spinner color={THEME.PRIMARY} />
        </View>
      );
    }

    return (
      <View style={Styles.container}>
        <View style={FLEX_1} />
        <View style={FLEX_3}>
          <Grid style={Styles.titleGrid}>
            <Col 
              size={40} 
              style={Styles.titleIcon} 
            >
              <Icon style={Styles.title} name='person' />
            </Col>
            <Col size={60}>
              <Text style={Styles.title}>Login</Text>
            </Col>
          </Grid>

          <View style={MT_20}>
            <Field 
              name='email'
              keyboardType='email-address'
              label='Email'
              type='text'
              component={this.renderInput}
            />
            <Field
              name='password'
              label='Password'
              type='password'
              component={this.renderInput} 
            />
          </View>

          <View style={Styles.buttonGroupContainer}>
            <View style={Styles.buttonContainer}>
              <Button 
                style={[submitButtonStyle.container]} 
                disabled={disableSubmitButton} 
                onPress={this.login}
              >
                <View style={HORIZONTALLY_CENTER}>
                  <Text style={submitButtonStyle.text}>Login</Text>
                </View>
              </Button>
            </View>
            <View style={[Styles.buttonContainer, MT_20]}>
              <Button 
                style={Styles.submitButton} 
                onPress={() => { this.props.navigation.navigate('Registration'); }}
              >
                <View style={HORIZONTALLY_CENTER}>
                  <Text style={Styles.submitButtonText}>Register</Text>
                </View>
              </Button>
            </View>
          </View>
        </View>
        <View style={FLEX_1} />
      </View>
    );
  }
}

const validate = (values, { loginDetails }) => {
  const error = {
    email: '',
    password: ''
  };

  let {
    email,
    password
  } = values;

  if (values.email === undefined) {
    email = '';
  }
  if (values.password === undefined) {
    password = '';
  }

  if (email.length < 8 && email !== '') {
    error.email = 'too short';
  }
  if (!email.includes('@') && email !== '') {
    error.email = '@ not included';
  }

  if (
      !password &&
      loginDetails &&
      loginDetails.fields &&
      loginDetails.fields.password &&
      loginDetails.fields.password
  ) {
    error.password = 'password cannot be empty';
  }

  return error;
};

const reduxLoginForm = reduxForm({
  form: REDUX_FORM_KEYS.LOGIN,
  validate
})(LoginComponent);

const loginFormWithNav = withNavigation(reduxLoginForm);

function mapStateToProps({ form }) {
  return {
    loginDetails: form && form[REDUX_FORM_KEYS.LOGIN]
  };
}
const connectedLoginForm = connect(mapStateToProps, null)(loginFormWithNav);

export default connectedLoginForm;
