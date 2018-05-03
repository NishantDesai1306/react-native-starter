import React from 'react';
import { green } from 'material-colors';
import { View, Item, Text, Input, Icon, Spinner } from 'native-base';
import { MT_10, FLEX_1 } from '../../../util/styles';
import { THEME } from '../../../theme';

export default function renderInput({
    input, 
    styles: {
        field, 
        fieldInput, 
        fieldText,
        fieldErrorText,
        spinnerColor
    }, 
    type, 
    label, 
    meta: { 
        error, 
        asyncValidating, 
        touched, 
        valid 
    },
    isFirst
}) {
    let hasError = false;
    const isValid = !!(!asyncValidating && touched && valid && input.value);
    
    if (error !== undefined) {
        hasError = true;
    }

    return ( 
        <View style={isFirst ? {} : MT_10}>
            <Item 
                error={hasError}
                style={field}
            >
                <Text style={fieldText}>{label}</Text>
                <Input 
                    {...input} 
                    style={fieldInput} 
                    secureTextEntry={type === 'password'}
                />
                { isValid && <Icon name='ios-checkmark-circle' style={{ color: green['500'] }} /> }
                { hasError && <Icon name='ios-close-circle' style={{ color: THEME.ERROR_TEXT }} /> }
                { asyncValidating ? <Spinner color={spinnerColor} /> : null }
            </Item>
            {
                hasError ? (
                    <View style={FLEX_1}>
                        <Text style={fieldErrorText}>{error}</Text>
                    </View> 
                ) : 
                null
            }
        </View>
    );
}
