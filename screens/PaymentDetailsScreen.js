import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
} from 'react-native';
import Voice from '@react-native-voice/voice';

const PaymentDetailsScreen = ({route}) => {
  const [amount, setAmount] = useState('');
  const [isListening, setIsListening] = useState(false);
  const {paymentMethod} = route.params;

  useEffect(() => {
    const onSpeechResults = event => {
      if (event.value && event.value.length > 0) {
        const spokenText = event.value[0].toLowerCase();
        if (spokenText.includes('ödeme yap')) {
          handlePayment();
          setIsListening(false); // Ses algılamayı durdur
        } else {
          // Miktarı algıla ve ayarla
          const match = spokenText.match(/\d+/); // Rakamları çıkar
          const extractedAmount = match ? match[0] : null;
          if (extractedAmount) {
            setAmount(extractedAmount);
            setIsListening(false); // Ses algılamayı durdur
            console.log(`Algılanan miktar: ${extractedAmount}`);
          }
        }
      }
    };

    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const handlePayment = () => {
    console.log(`Ödeme (${paymentMethod.label}): ${amount} TL`);
    // Ödeme işlemleri burada yapılır
    alert(`Ödeme başarılı: ${amount} TL`);
  };

  const handleVoiceGuide = async () => {
    if (isListening) {
      Voice.stop();
      setIsListening(false);
    } else {
      try {
        await Voice.start('tr-TR'); // Türkçe ses algılama için
        setIsListening(true);
        console.log('Ses algılama başlatıldı.');
      } catch (e) {
        console.error('Ses algılama hatası:', e);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{paymentMethod.label} Ödeme Detayları</Text>
      <TextInput
        style={styles.input}
        placeholder="Miktarı Girin"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <Button title="Ödeme Yap" onPress={handlePayment} color="purple" />
      <TouchableOpacity
        style={styles.voiceButtonContainer}
        onPress={handleVoiceGuide}>
        <View style={styles.voiceButton}>
          <Text style={styles.voiceButtonText}>
            {isListening ? 'Dinlemeyi Durdur' : 'Sesli Komutla Yönlendirme'}
          </Text>
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
    backgroundColor: '#c8a2c8', // Arka plan rengi
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff', // Metin rengi
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: '80%',
    color: '#333', // Koyu gri metin rengi
  },
  button: {
    backgroundColor: 'purple', // Buton arka plan rengi
    color: '#fff', // Beyaz metin rengi
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

export default PaymentDetailsScreen;
