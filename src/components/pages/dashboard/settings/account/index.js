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
    Item,
    Input,
} from 'native-base';

import Styles from './styles';
import {
    HORIZONTALLY_CENTER,
    FLEX_1,
    MT_10,
    DISABLED_TEXT,
    EMPTY,
    FLEX_5,
    MT_20
} from '../../../../../util/styles';
import AppBar from '../../../../shared/app-bar';
import { REDUX_FORM_KEYS, SERVER_URL } from '../../../../../services/constant.service';
import { THEME } from '../../../../../theme';
import { updateProfilePicture, updateUserDetails } from '../../../../../services/user.service';

class AccountDetailsComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            imageSrc: `${SERVER_URL}/${props.initialValues.profilePictureUrl}`
        };

        this.renderInput = this.renderInput.bind(this);
        this.showImagePicker = this.showImagePicker.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
    }

    showImagePicker() {
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

    renderInput({ input, label, meta: { error } }) {
        let hasError = false;

        if (error !== undefined) {
            hasError = true;
        }

        return ( 
            <View style={label === 'Username' ? {} : MT_10}>
                <Item error={hasError} style={[Styles.field, { borderBottomColor: THEME.PRIMARY }]}>
                    <Text style={Styles.fieldText}> { label } </Text>
                    <Input {...input} style={Styles.fieldInput} /> 
                </Item> 
                {
                    hasError ? ( 
                        <View style={FLEX_1}>
                            <Text style={Styles.fieldErrorText}> { error } </Text> 
                        </View> 
                    ) :
                    null
                } 
            </View>
        );
    }

    render() {
        const { submitting, valid } = this.props;
        const disableSubmitButton = submitting || !valid;
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
                    <View style={FLEX_1} /> 
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
                                    component={this.renderInput}
                                /> 
                                <Field
                                    name='email'
                                    label='Email'
                                    keyboardType='email-address'
                                    type='text'
                                    component={this.renderInput} 
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
        error.email = 'too short';
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
    }

    return error;
};

const accountDetailsForm = reduxForm({
    form: REDUX_FORM_KEYS.ACCOUNT_DETAILS,
    validate
})(AccountDetailsComponent);

const accountDetailsWithNav = withNavigation(accountDetailsForm);

function mapStateToProps({ form, user }) {
    return {
        accountDetails: form && form[REDUX_FORM_KEYS.ACCOUNT_DETAILS],
        initialValues: user
    };
}
const connectedAccountDetailsForm = connect(mapStateToProps, null)(accountDetailsWithNav);

export default connectedAccountDetailsForm;
