import React from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import {
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    ToastAndroid
} from 'react-native';
import { Field, reduxForm } from 'redux-form';
import ImagePicker from 'react-native-image-picker';
import {
    Button,
    Text,
    Icon
} from 'native-base';

import Styles from './styles';
import {
    HORIZONTALLY_CENTER,
    FLEX_1,
    EMPTY,
    FLEX_5,
    MT_20,
    MT_10,
    CENTER
} from '../../../../../util/styles';
import AppBar from '../../../../shared/app-bar';
import { REDUX_FORM_KEYS, SERVER_URL } from '../../../../../services/constant.service';
import { THEME } from '../../../../../theme';
import { updateProfilePicture, updateUserDetails } from '../../../../../services/user.service';
import renderInput from '../../../../shared/input';

class AccountDetailsComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            imageSrc: `${SERVER_URL}/${props.initialValues.profilePictureUrl}`
        };

        this.showImagePicker = this.showImagePicker.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
    }    

    showImagePicker() {
        if (this.props.network && !this.props.network.isConnected) {
            ToastAndroid.show(
                'To change profile picture you device should be connected to internet',
                ToastAndroid.LONG
            );
            return;
        }

        ImagePicker.showImagePicker({}, (response) => {
            if (response.didCancel) {
                return;
            }

            updateProfilePicture(response.data)
                .then(() => {
                    this.setState({
                        imageSrc: response.uri
                    });

                    ToastAndroid.show('Profile picture changes successfully', ToastAndroid.SHORT);
                })
                .catch((err) => {
                    console.log(err);
                    ToastAndroid.show(err.message || err.toString(), ToastAndroid.SHORT);
                });
        });
    }

    saveChanges() {
        const { accountDetails, navigation } = this.props;

        updateUserDetails(accountDetails.values)
            .then(() => {
                navigation.goBack();
            })
            .catch((err) => {
                console.log('error', err);
            });
    }

    render() {
        const { submitting, valid, network } = this.props;
        const isDeviceOffline = network && !network.isConnected;
        const disableSubmitButton = isDeviceOffline || submitting || !valid;
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

        const { imageSrc } = this.state;

        return ( 
            <View style={FLEX_1}>
                <AppBar goBack title={'Account Details'} />
                <View style={Styles.container}>
                    <View style={[FLEX_1, CENTER]}> 
                        {
                            isDeviceOffline && (
                                <View style={Styles.errorTextContainer}>
                                    <Icon 
                                        type='MaterialIcons'
                                        name='error' 
                                        style={Styles.errorTextIcon} 
                                    />
                                    <Text style={Styles.errorText}>
                                        To change your account details this device should be connected to internet.
                                    </Text>
                                </View>
                            )
                        }
                    </View>
                    <View style={FLEX_5}>
                        <ScrollView>
                            <View>
                                <View style={HORIZONTALLY_CENTER}>
                                    <TouchableOpacity onPress={this.showImagePicker}>
                                        <Image 
                                            style={Styles.profilePicture} 
                                            source={{ uri: imageSrc }} 
                                        /> 
                                    </TouchableOpacity> 
                                </View>
                                <Field 
                                    name='username'
                                    label='Username'
                                    type='text'
                                    component={renderInput}
                                    styles={{
                                        field: Styles.field,
                                        fieldInput: Styles.fieldInput,
                                        fieldText: Styles.fieldText,
                                        fieldErrorText: Styles.fieldErrorText,
                                        spinnerColor: THEME.PRIMARY
                                    }}
                                    isFirst
                                /> 
                                <Field
                                    name='email'
                                    label='Email'
                                    keyboardType='email-address'
                                    type='text'
                                    component={renderInput} 
                                    styles={{
                                        field: Styles.field,
                                        fieldInput: Styles.fieldInput,
                                        fieldText: Styles.fieldText,
                                        fieldErrorText: Styles.fieldErrorText,
                                        spinnerColor: THEME.PRIMARY
                                    }}
                                /> 
                            </View>

                            <View style={[Styles.buttonGroupContainer, MT_20]}>
                                <View style={[Styles.buttonContainer]}>
                                    <Button 
                                        onPress={this.saveChanges}
                                        disabled={disableSubmitButton}
                                        style={submitButtonStyle.container}
                                    >
                                        <View style={HORIZONTALLY_CENTER}>
                                            <Text 
                                                style={submitButtonStyle.text}
                                            > 
                                                Save Changes 
                                            </Text> 
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

const validate = (values, { accountDetails }) => {
    const error = {
        email: '',
        username: ''
    };

    let {
        username,
        email
    } = values;

    if (values.username === undefined) {
        username = '';
    }
    if (values.email === undefined) {
        email = '';
    }

    if (email.length < 8 && email !== '') {
        error.email = 'email is invalid';
    }
    if (!email.includes('@') && email !== '') {
        error.email = '@ not included';
    }

    if (!username &&
        accountDetails &&
        accountDetails.fields &&
        accountDetails.fields.username &&
        accountDetails.fields.username
    ) {
        error.username = 'username cannot be empty';
    } else if (username.length < 5) {
        error.username = 'username should have at least 5 characters';
    }

    return error;
};

const accountDetailsForm = reduxForm({
    form: REDUX_FORM_KEYS.ACCOUNT_DETAILS,
    validate
})(AccountDetailsComponent);

const accountDetailsWithNav = withNavigation(accountDetailsForm);

function mapStateToProps({ form, user, network }) {
    return {
        accountDetails: form && form[REDUX_FORM_KEYS.ACCOUNT_DETAILS],
        initialValues: user,
        network
    };
}
const connectedAccountDetailsForm = connect(mapStateToProps, null)(accountDetailsWithNav);

export default connectedAccountDetailsForm;
