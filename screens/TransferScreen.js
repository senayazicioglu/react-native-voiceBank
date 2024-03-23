import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';

const TransferScreen = () => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  useEffect(() => {
    Tts.setDefaultLanguage('tr-TR')
      .then(() => {
        console.log('Dil Türkçe olarak ayarlandı');
      })
      .catch(error => {
        console.error('Dil ayarlama hatası:', error);
      });

    Tts.addEventListener('tts-start', event => console.log('start', event));
    Tts.addEventListener('tts-finish', event => console.log('finish', event));
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event));

    const onVoiceCommand = e => {
      const speechResults = e.value;
      for (let speechResult of speechResults) {
        speechResult = speechResult.toLowerCase();
        if (speechResult.includes('transfer yap')) {
          if (!amount || !recipient) {
            Alert.alert('Hata', 'Miktar ve alıcı bilgisi girilmedi.');
          } else {
            confirmTransfer();
          }
          return;
        }
        const amountRegex = /(\d+) (tl|lira)/i;
        const amountMatch = speechResult.match(amountRegex);
        if (amountMatch) {
          setAmount(amountMatch[1]);
          console.log('Miktar Ayarlandı', `${amountMatch[1]} TL`);
          continue;
        }
        const recipientRegex =
          /alıcı ([a-zA-ZğüşöçıİĞÜŞÖÇ\s]+)|([a-zA-ZğüşöçıİĞÜŞÖÇ\s]+)/i;
        const recipientMatch = speechResult.match(recipientRegex);
        if (recipientMatch) {
          const newRecipient = recipientMatch[1]
            ? recipientMatch[1].trim()
            : recipientMatch[2].trim();
          setRecipient(newRecipient);
          console.log('Alıcı Ayarlandı', newRecipient);
          continue;
        }
      }
    };

    Voice.onSpeechResults = onVoiceCommand;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      Tts.stop();
      Tts.removeEventListener('tts-start');
      Tts.removeEventListener('tts-finish');
      Tts.removeEventListener('tts-cancel');
    };
  }, []);

  const confirmTransfer = () => {
    Tts.speak(
      `${amount} TL'yi ${recipient} adlı alıcıya transfer etmek üzeresiniz. Transferi onaylamak için evet, iptal etmek için hayır deyin.`,
    );
  };

  const handleTransfer = () => {
    console.log(`Transfer: ${amount} TL ${recipient}`);
    Alert.alert(
      'Transfer Başarılı',
      `${amount} TL ${recipient} adına transfer edildi.`,
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Para Transferi</Text>
      <TextInput
        style={styles.input}
        placeholder="Miktarı Girin"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Alıcı Bilgisi Girin"
        value={recipient}
        onChangeText={setRecipient}
      />
      <Button title="Transfer Yap" onPress={handleTransfer} color="purple" />
      <TouchableOpacity
        style={styles.voiceButtonContainer}
        onPress={() => Voice.start('tr-TR')}>
        <View style={styles.voiceButton}>
          <Text style={styles.voiceButtonText}>Sesli Komutla Transfer</Text>
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
  input: {
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: '80%',
    color: '#333',
  },
  voiceButtonContainer: {
    width: '100%',
    height: '33%', // Sayfanın 1/3'ü
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
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

export default TransferScreen;
