import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, StatusBar, ScrollView, ActivityIndicator, Alert, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react'


const alturaStatusBar = StatusBar.currentHeight;
const KEY_GPT = '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';


export default function LivrosScreen() {

  const [load, defLoad] = useState(false);
  const [livro, defLivro] = useState("");

  const [genero, defGenero] = useState("");
  const [classificacaoEtaria, defClassificacaoEtaria] = useState("");
  const [tema, defTema] = useState("");
  const [autor, defAutor] = useState("");

  async function gerarLivro() {
    if (genero === "" || classificacaoEtaria === "" || tema === "" || autor === "") {
      Alert.alert("Atenção", "Informe todos os requisitos!", [{ text: "Beleza!" }])
      return;
    }
    defLivro("");
    defLoad(true);
    Keyboard.dismiss();

    const prompt = `Sugira um livro para o ${genero} usando os requisitos: ${autor}, ${classificacaoEtaria} e ${tema} e pesquise o livro no ${tema}. Caso encontre, informe o link.`;

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
        const livroCompleto = data.choices[0].message.content;
        defLivro(livroCompleto);
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
      <Text style={ESTILOS.header}>Sugestão de Livros</Text>
      <View style={ESTILOS.form}>
        <Text style={ESTILOS.label}>Insira os requisitos abaixo:</Text>
        <TextInput
          placeholder="Gênero"
          style={ESTILOS.input}
          value={genero}
          onChangeText={(texto) => defGenero(texto)}
        />
        <TextInput
          placeholder="Classificação Etária"
          style={ESTILOS.input}
          value={classificacaoEtaria}
          onChangeText={(texto) => defClassificacaoEtaria(texto)}
        />
        <TextInput
          placeholder="Tema"
          style={ESTILOS.input}
          value={tema}
          onChangeText={(texto) => defTema(texto)}
        />
        <TextInput
          placeholder="Autor de sua preferência"
          style={ESTILOS.input}
          value={autor}
          onChangeText={(texto) => defAutor(texto)}
        />
      </View>

      <TouchableOpacity style={ESTILOS.button} onPress={gerarLivro}>
        <Text style={ESTILOS.buttonText}>Gerar livro</Text>
        <MaterialIcons name="book" size={24} color="#FFF" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 24, marginTop: 4, }} style={ESTILOS.containerScroll} showsVerticalScrollIndicator={false} >
        {load && (
          <View style={ESTILOS.content}>
            <Text style={ESTILOS.title}>Selecionando livro...</Text>
            <ActivityIndicator color="#000" size="large" />
          </View>
        )}

        {livro && (
          <View style={ESTILOS.content}>
            <Text style={ESTILOS.title}>Seu filme 👇</Text>
            <Text style={{ lineHeight: 24 }}>{livro} </Text>
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
    backgroundColor: '#7de3cf',
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