import React, {useEffect} from 'react';
import {View, Text, Button, StyleSheet, TouchableOpacity} from 'react-native';
import Voice from '@react-native-voice/voice';

const HomeScreen = ({navigation}) => {
  useEffect(() => {
    const onSpeechResults = e => {
      const speechResult = e.value[0].toLowerCase();
      if (speechResult.includes('para transferi yap')) {
        navigation.navigate('Transfer');
        Voice.destroy().then(Voice.removeAllListeners); // TransferScreen'e geçerken dinleyiciyi kaldır
      } else if (speechResult.includes('fatura öde')) {
        navigation.navigate('Payment');
        Voice.destroy().then(Voice.removeAllListeners); // PaymentScreen'e geçerken dinleyiciyi kaldır
      }
    };

    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners); // HomeScreen'den çıkarken dinleyiciyi kaldır
    };
  }, [navigation]);

  const startSpeechToText = async () => {
    try {
      await Voice.start('tr-TR');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoş Geldiniz!</Text>
      <Button
        title="Para Transferi Yap"
        onPress={() => navigation.navigate('Transfer')}
        style={styles.button}
        color="purple"
      />
      <Button
        title="Fatura Öde"
        onPress={() => navigation.navigate('Payment')}
        style={styles.button}
        color="purple"
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
    backgroundColor: '#ecf0f1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  button: {
    marginTop: 50,
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

export default HomeScreen;
