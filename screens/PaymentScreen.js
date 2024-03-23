import React, {useEffect} from 'react';
import {View, Text, Button, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native-gesture-handler';
import Voice from '@react-native-voice/voice';

const PaymentScreen = () => {
  const navigation = useNavigation();

  const paymentMethods = [
    {id: '1', label: 'Elektrik'},
    {id: '2', label: 'Su'},
    {id: '3', label: 'TV'},
    {id: '4', label: 'Telefon'},
    {id: '5', label: 'Doğalgaz'},
  ];

  const handlePaymentMethodSelect = method => {
    navigation.navigate('PaymentDetails', {
      paymentMethod: method,
    });
  };

  const startSpeechToText = async () => {
    try {
      await Voice.start('tr-TR');
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = e => {
    if (e.value && e.value.length > 0) {
      const speechResult = e.value[0].toLowerCase();
      const selectedMethod = paymentMethods.find(method =>
        speechResult.includes(method.label.toLowerCase()),
      );
      if (selectedMethod) {
        handlePaymentMethodSelect(selectedMethod);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fatura Öde</Text>
      <FlatList
        data={paymentMethods}
        renderItem={({item}) => (
          <Button
            title={item.label}
            onPress={() => handlePaymentMethodSelect(item)}
            color="purple"
          />
        )}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity
        style={styles.voiceButtonContainer}
        onPress={startSpeechToText}>
        <View style={styles.voiceButton}>
          <Text style={styles.voiceButtonText}>Sesli Komutla Yönlendirme</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c8a2c8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  voiceButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    height: '33%', // Sayfanın 1/3'ü
  },
  voiceButton: {
    width: '90%',
    height: '90%',
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  voiceButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
