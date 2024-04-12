import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, StatusBar, ScrollView, ActivityIndicator, Alert, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const alturaStatusBar = StatusBar.currentHeight;
const KEY_GPT = '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';

export default function ViagensScreen() {
  const [load, setLoad] = useState(false);
  const [viagem, setViagem] = useState("");
  const [local, setLocal] = useState("");
  const [valorestimado, setValorEstimado] = useState("");
  const [pessoas, setPessoas] = useState("");
  const [dias, setDias] = useState("");

  async function gerarViagem() {
    if (local === "" || valorestimado === "" || pessoas === "" || dias === "") {
      Alert.alert("Atenção", "Informe todos os requisitos!", [{ text: "Beleza!" }]);
      return;
    }
    setViagem("");
    setLoad(true);
    Keyboard.dismiss();

    const prompt = `Sugira uma viagem para o ${local} usando os requisitos: ${valorestimado}, ${pessoas} e ${dias} e pesquise o local no ${local}. Caso encontre, informe o link.`;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${KEY_GPT}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.2,
          max_tokens: 500,
          top_p: 1,
        })
      });
      const data = await response.json();
      console.log(data.choices[0].message.content);
      const viagemCompleta = data.choices[0].message.content;
      setViagem(viagemCompleta);
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
    }
  }

  return (
    <View style={ESTILOS.container}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#F1F1F1" />
      <Text style={ESTILOS.header}>Sugestão de viagens</Text>
      <View style={ESTILOS.form}>
        <Text style={ESTILOS.label}>Insira os requisitos abaixo:</Text>
        <TextInput
          placeholder="Local"
          style={ESTILOS.input}
          value={local}
          onChangeText={(texto) => setLocal(texto)}
        />
        <TextInput
          placeholder="Valor Estimado"
          style={ESTILOS.input}
          value={valorestimado}
          onChangeText={(texto) => setValorEstimado(texto)}
        />
        <TextInput
          placeholder="Pessoas"
          style={ESTILOS.input}
          value={pessoas}
          onChangeText={(texto) => setPessoas(texto)}
        />
        <TextInput
          placeholder="Dias"
          style={ESTILOS.input}
          value={dias}
          onChangeText={(texto) => setDias(texto)}
        />
      </View>

      <TouchableOpacity style={ESTILOS.button} onPress={gerarViagem}>
        <Text style={ESTILOS.buttonText}>Gerar viagem</Text>
        <MaterialIcons name="travel-explore" size={24} color="#FFF" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 24, marginTop: 4 }} style={ESTILOS.containerScroll} showsVerticalScrollIndicator={false}>
        {load && (
          <View style={ESTILOS.content}>
            <Text style={ESTILOS.title}>Selecionando viagem...</Text>
            <ActivityIndicator color="#000" size="large" />
          </View>
        )}

        {viagem !== "" && (
          <View style={ESTILOS.content}>
            <Text style={ESTILOS.title}>Sua viagem sugerida:</Text>
            <Text style={{ lineHeight: 24 }}>{viagem}</Text>
          </View>
        )}
      </ScrollView>

    </View>
  );
}

const ESTILOS = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    paddingTop: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingTop: Platform.OS === 'android' ? alturaStatusBar : 54
  },
  form: {
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#94a3b8',
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#46c69e',
    width: '90%',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  content: {
    backgroundColor: '#FFF',
    padding: 16,
    width: '100%',
    marginTop: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14,
  },
  containerScroll: {
    width: '90%',
    marginTop: 8,
  }
});
