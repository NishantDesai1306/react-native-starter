import React from 'react';
import { connect } from 'react-redux';
import { View, ScrollView } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Field, reduxForm } from 'redux-form';
import { 
  Button,
  Text,
  Icon,
  Grid,
  Col,
  Item,
  Input
} from 'native-base';

import Styles from './styles';
import {  
  HORIZONTALLY_CENTER, 
  FLEX_1, 
  MT_10, 
  FLEX_4, 
  DISABLED_TEXT, 
  EMPTY
} from '../../../util/styles';
import { register } from '../../../services/auth.service';
import { REDUX_FORM_KEYS } from '../../../services/constant.service';
import { THEME } from '../../../theme';

class RegistrationComponent extends React.Component {

  constructor(props) {
    super(props);

    this.renderInput = this.renderInput.bind(this);
    this.register = this.register.bind(this);
  }

  register() {
    const { registrationDetails } = this.props;

    register(registrationDetails.values)
    .then((data) => {
      console.log('data', data);
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
      <View style={label === 'Username' ? {} : MT_10}>
        <Item error={hasError} style={Styles.field}>
          <Text style={Styles.fieldText}>{label}</Text>
          <Input {...input} style={Styles.fieldInput} />
        </Item>
        {
          hasError ? (
            <View style={FLEX_1}>
              <Text style={Styles.fieldErrorText}>{error}</Text>
            </View> 
          ) : 
          null
        }
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
  
    return (
      <View style={Styles.container}>
        <View style={FLEX_1} />
        <View style={FLEX_4}>
          <Grid style={Styles.titleGrid}>
            <Col 
              size={35} 
              style={Styles.titleIcon} 
            >
              <Icon style={Styles.title} name='person' />
            </Col>
            <Col size={65}>
              <Text style={Styles.title}>Register</Text>
            </Col>
          </Grid>

          <ScrollView>
            <View>
              <Field 
                name='username'
                label='Username'
                type='text'
                component={this.renderInput}
              />
              <Field 
                name='email'
                label='Email'
                keyboardType='email-address'
                type='text'
                component={this.renderInput}
              />
              <Field
                name='password'
                label='Password'
                type='password'
                component={this.renderInput} 
              />
              <Field
                name='confirmPassword'
                label='Confirm Password'
                type='password'
                component={this.renderInput} 
              />
            </View>

            <View style={Styles.buttonGroupContainer}>
              <View style={[Styles.buttonContainer]}>
                <Button 
                  disabled={disableSubmitButton}
                  style={submitButtonStyle.container} 
                  onPress={this.register}
                >
                  <View style={HORIZONTALLY_CENTER}>
                    <Text style={submitButtonStyle.text}>Create Account</Text>
                  </View>
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const validate = (values, { registrationDetails }) => {
  const error = {
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  };

  let {
    username,
    email,
    password,
    confirmPassword
  } = values;

  if (values.username === undefined) {
    username = '';
  }
  if (values.email === undefined) {
    email = '';
  }
  if (values.password === undefined) {
    password = '';
  }
  if (values.password === undefined) {
    password = '';
  }
  if (values.confirmPassword === undefined) {
    confirmPassword = '';
  }

  if (email.length < 8 && email !== '') {
    error.email = 'too short';
  }
  if (!email.includes('@') && email !== '') {
    error.email = '@ not included';
  }

  if (
    !username &&
    registrationDetails &&
    registrationDetails.fields &&
    registrationDetails.fields.username &&
    registrationDetails.fields.username
  ) {
    error.username = 'username cannot be empty';
  }

  if (
      !password &&
      registrationDetails &&
      registrationDetails.fields &&
      registrationDetails.fields.password &&
      registrationDetails.fields.password
  ) {
    error.password = 'password cannot be empty';
  }

  if (
    !confirmPassword &&
    registrationDetails &&
    registrationDetails.fields &&
    registrationDetails.fields.confirmPassword &&
    registrationDetails.fields.confirmPassword
  ) {
    error.confirmPassword = 'repeat your password';
  }

  if (password !== confirmPassword) {
    error.confirmPassword = 'password and confirm password must match';
  }

  return error;
};

const reduxRegistrationForm = reduxForm({
  form: REDUX_FORM_KEYS.REGISTRATION,
  validate
})(RegistrationComponent);

const registrationFormWithNav = withNavigation(reduxRegistrationForm);

function mapStateToProps({ form }) {
  return {
    registrationDetails: form && form[REDUX_FORM_KEYS.REGISTRATION]
  };
}
const connectedRegistrationForm = connect(mapStateToProps, null)(registrationFormWithNav);

export default connectedRegistrationForm;
