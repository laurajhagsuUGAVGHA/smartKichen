import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, StatusBar, ScrollView, ActivityIndicator, Alert, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react'


const alturaStatusBar = StatusBar.currentHeight;
const KEY_GPT = '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';


export default function LojaScreen() {

  const [load, defLoad] = useState(false);
  const [loja, defLoja] = useState("");

  const [tamanho, defTamanho] = useState("");
  const [genero, defGenero] = useState("");
  const [tipoderoupa, defTipoDeRoupa] = useState("");
  const [preco, defPreco] = useState("");

  async function gerarRoupa() {
    if (loja === "" || tipoderoupa === "" || preco === "" || genero === "") {
      Alert.alert("Atenção", "Informe todos os requisitos!", [{ text: "Beleza!" }])
      return;
    }
    defLoja("");
    defLoad(true);
    Keyboard.dismiss();

    const prompt = `Sugira uma roupa para o ${genero} usando os requisitos: ${tipoderoupa}, ${preco} e ${tamanho} e pesquise o tipo de roupa na ${loja}. Caso encontre, informe o link.`;

    fetch("https://api.openai.com/v1/chat/completions", {
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
    })

      .then(response => response.json())
      .then((data) => {
        console.log(data.choices[0].message.content);
        const lojaRoupa = data.choices[0].message.content;
        defLoja(lojaRoupa);
      })   
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        defLoad(false);
      })
  }


  return (
    <View style={ESTILOS.container}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#F1F1F1" />
      <Text style={ESTILOS.header}>Sugestão de roupas</Text>
      <View style={ESTILOS.form}>
        <Text style={ESTILOS.label}>Insira os requisitos abaixo:</Text>
        <TextInput
          placeholder="Gênero"
          style={ESTILOS.input}
          value={genero}
          onChangeText={(texto) => defGenero(texto)}
        />
        <TextInput
          placeholder="Tipo de Roupa"
          style={ESTILOS.input}
          value={tipoderoupa}
          onChangeText={(texto) => defTipoDeRoupa(texto)}
        />
        <TextInput
          placeholder="Preço Estimado"
          style={ESTILOS.input}
          value={preco}
          onChangeText={(texto) => defPreco(texto)}
        />
       <TextInput
          placeholder="Tamanho"
          style={ESTILOS.input}
          value={tamanho}
          onChangeText={(texto) => defTamanho(texto)}
        />
      </View>

      <TouchableOpacity style={ESTILOS.button} onPress={gerarRoupa}>
        <Text style={ESTILOS.buttonText}>Gerar Sugestão de Roupa</Text>
              <MaterialIcons name="checkroom" size={24} color="black" />
     
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 24, marginTop: 4, }} style={ESTILOS.containerScroll} showsVerticalScrollIndicator={false} >
        {load && (
          <View style={ESTILOS.content}>
            <Text style={ESTILOS.title}>Selecionando uma roupa...</Text>
            <ActivityIndicator color="#000" size="large" />
          </View>
        )}

        {loja && (
          <View style={ESTILOS.content}>
            <Text style={ESTILOS.title}>Sua Roupa ideal👇</Text>
            <Text style={{ lineHeight: 24 }}>{loja} </Text>
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
    backgroundColor: '#ffb7aa',
    width: '90%',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold'
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
    marginBottom: 14
  },
  containerScroll: {
    width: '90%',
    marginTop: 8,
  }

})