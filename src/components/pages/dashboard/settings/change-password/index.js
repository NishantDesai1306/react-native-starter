import React from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, ToastAndroid } from 'react-native';
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
  EMPTY
} from '../../../../../util/styles';
import { updatePassword } from '../../../../../services/user.service';
import { REDUX_FORM_KEYS } from '../../../../../services/constant.service';
import { THEME } from '../../../../../theme';
import AppBar from '../../../../shared/app-bar';

class ChangePasswordComponent extends React.Component {

    constructor(props) {
        super(props);

        this.renderInput = this.renderInput.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    changePassword() {
        const { changePasswordDetails } = this.props;

        updatePassword(changePasswordDetails.values)
        .then(() => {
            ToastAndroid.show('Password changes successfully', ToastAndroid.SHORT);
            this.props.navigation.goBack();
        })
        .catch((err) => {
            ToastAndroid.show(err.message, ToastAndroid.SHORT);
            console.log('error', err);
        });
    }

    renderInput({ input, label, meta: { error } }) {
        let hasError = false;
        
        if (error !== undefined) {
            hasError = true;
        }

        return ( 
            <View style={label === 'Old Password' ? {} : MT_10}>
                <Item error={hasError} style={Styles.field}>
                    <Text style={Styles.fieldText}>{label}</Text>
                    <Input {...input} style={[Styles.fieldInput]} />
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
            container: Object.assign(
                {}, 
                Styles.submitButton, 
                disableSubmitButton ? { backgroundColor: THEME.DISABLED_TEXT } : EMPTY
            ),
            buttonText: Object.assign(
                {}, 
                Styles.submitButtonText, 
                disableSubmitButton ? { color: THEME.TEXT_DARK } : EMPTY
            )
        };
    
        return (
            <View style={FLEX_1}>
                <AppBar goBack title='Change Password' />
                <View style={Styles.container}>
                    <View style={FLEX_1} />
                    <View style={FLEX_4}>
                        <Grid style={Styles.titleGrid}>
                            <Col 
                                size={10} 
                                style={Styles.titleIcon} 
                            >
                            <Icon style={Styles.title} name='key' />
                            </Col>
                            <Col size={90}>
                                <Text style={Styles.title}>Change Password</Text>
                            </Col>
                        </Grid>

                        <ScrollView>
                            <View>
                                <Field
                                    name='oldPassword'
                                    label='Old Password'
                                    type='password'
                                    component={this.renderInput} 
                                />
                                <Field
                                    name='newPassword'
                                    label='New Password'
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
                                <View style={Styles.buttonContainer}>
                                    <Button 
                                        style={submitButtonStyle.container} 
                                        onPress={this.changePassword}
                                    >
                                        <View style={HORIZONTALLY_CENTER}>
                                            <Text style={submitButtonStyle.buttonText}>Change Password</Text>
                                        </View>
                                    </Button>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </View>
        );
    }
}

const validate = (values, { changePasswordDetails }) => {
    const error = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    };

    let {
        oldPassword,
        newPassword,
        confirmPassword
    } = values;

    if (oldPassword === undefined) {
        oldPassword = '';
    }
    if (newPassword === undefined) {
        newPassword = '';
    }
    if (confirmPassword === undefined) {
        confirmPassword = '';
    }

    if (!oldPassword &&
        changePasswordDetails &&
        changePasswordDetails.fields &&
        changePasswordDetails.fields.oldPassword &&
        changePasswordDetails.fields.oldPassword
    ) {
        error.oldPassword = 'old password cannot be empty';
    }

    if (
        !newPassword &&
        changePasswordDetails &&
        changePasswordDetails.fields &&
        changePasswordDetails.fields.newPassword &&
        changePasswordDetails.fields.newPassword
    ) {
        error.newPassword = 'new password cannot be empty';
    }

    if (
        !confirmPassword &&
        changePasswordDetails &&
        changePasswordDetails.fields &&
        changePasswordDetails.fields.confirmPassword &&
        changePasswordDetails.fields.confirmPassword
    ) {
        error.confirmPassword = 'repeat your password';
    }

    if (newPassword !== confirmPassword) {
        error.confirmPassword = 'password and confirm password must match';
    }

    return error;
};

const reduxRegistrationForm = reduxForm({
    form: REDUX_FORM_KEYS.CHANGE_PASSWORD,
    validate
})(ChangePasswordComponent);

const registrationFormWithNav = withNavigation(reduxRegistrationForm);

function mapStateToProps({ form }) {
    return {
        changePasswordDetails: form && form[REDUX_FORM_KEYS.CHANGE_PASSWORD]
    };
}
const connectedRegistrationForm = connect(mapStateToProps, null)(registrationFormWithNav);

export default connectedRegistrationForm;
