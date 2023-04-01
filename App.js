import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as SMS from 'expo-sms';
import * as MailComposer from 'expo-mail-composer';

export default function App() {
  const [toEmail, setToEmail] = useState('');
  const subject = 'Unread SMS Messages';
  let body = '';

  // useEffect(() => {
  //   requestReadSmsPermission();
  // }, []);

  const requestReadSmsPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.READ_SMS);
    if (status === 'granted') {
      console.log('Read SMS permission granted');
    } else {
      console.log('Read SMS permission denied');
    }
  };

  async function getUnreadSMS() {
    const { sms } = await SMS.getUnreadSMSAsync();
    return sms;
  }

  function sendEmail(to, subject, body) {
    MailComposer.composeAsync({
      recipients: [to],
      subject,
      body,
    }).then(() => {
      console.log('Email sent successfully');
    }).catch((error) => {
      console.log(`Email failed to send with error: ${error}`);
    });
  }

  function sendSMS() {
    getUnreadSMS().then((unreadSMS) => {
      unreadSMS.forEach((sms) => {
        body += `From: ${sms.from}\n`;
        body += `Body: ${sms.body}\n\n`;
      });
      if (body !== '') {
        sendEmail(toEmail, subject, body);
      }
    });
  }

  return (
    <View style={styles.container}>
      <Button title="request permissions" onPress={requestReadSmsPermission} />
      <Text>Your E-mail</Text>
      <TextInput placeholder='E-mail' value={toEmail} onChangeText={(text) => setToEmail(text)} />
      <Button title='submit' onPress={sendSMS} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
