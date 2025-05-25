import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';

const useMealQuery = () => {
  const [messages, setMessages] = useState<
    {text: string; isUser?: boolean; isLoading?: boolean}[]
  >([
    {
      text: "Hi! I'm your AI-powered Chef in the kitchen! I can help you discover recipes, improve your skills, and solve cooking conundrums. Ask me about techniques, ingredients (e.g., 'chicken rice'), or recipe ideas (e.g., 'How to cook pasta al dente')!",
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleQuery = useCallback(async (query: string) => {
    setInputText('');
    setMessages(prev => [...prev, {text: query, isUser: true}]);
    setMessages(prev => [...prev, {text: '', isLoading: true}]);

    const response = await getAIResponse(query);
    setIsThinking(false);
    setMessages(prev => {
      const newMessages = [...prev];
      newMessages[newMessages.length - 1] = {text: response.trim()};
      return newMessages;
    });
  }, []);

  const getAIResponse = async (query: string) => {
    try {
        const apiKey = '025ac59df0de49b88c492a6eb2825748'; 
      let searchQuery = query.trim().toLowerCase();
      let ingredients = '';
      let intent = '';

      const hasInstructionWords = query.match(
        /(how|what|give|suggest|make|cook)/i,
      );
      if (hasInstructionWords) {
        const potentialKeywords = searchQuery
          .replace(/[^a-zA-Z\s]/g, '')
          .split(' ')
          .filter(
            word =>
              ![
                'how',
                'what',
                'give',
                'me',
                'a',
                'recipe',
                'suggest',
                'make',
                'cook',
                'with',
                'to',
                'i',
                'can',
                'do',
              ].includes(word.toLowerCase()),
          )
          .filter(word => word.length > 0);
        ingredients = potentialKeywords.join(',').trim() || 'chicken, rice';
        intent = 'recipe';
      } else {
        ingredients = searchQuery
          .split(/[\s,]+/)
          .filter(word => word.length > 0)
          .join(',');
      }

      let url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
        intent || searchQuery,
      )}&includeIngredients=${encodeURIComponent(
        ingredients,
      )}&addRecipeInformation=true&apiKey=${apiKey}&number=1`;
      let response = await axios.get(url);

      if (response.data.results && response.data.results.length > 0) {
        const recipe = response.data.results[0];
        const lines = [
          `Recipe : ${recipe.title}`,
          ...(recipe.analyzedInstructions[0]?.steps.map(
            (step: {step: string}) => step.step,
          ) || ['No detailed steps available']),
          `Total Time: ${recipe.readyInMinutes} minutes`,
          `Servings: ${recipe.servings}`,
          `Ingredients : ${recipe.extendedIngredients
            .map((ing: {name: string}) => ing.name)
            .join(', ')}`,
        ];
        let fullResponse = '';
        for (const [index, line] of lines.entries()) {
          await new Promise(resolve => setTimeout(resolve, 600));
          fullResponse += line + (index < lines.length - 1 ? '\n' : '');
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {text: fullResponse};
            return newMessages;
          });
        }
        return fullResponse;
      }

      //fallback if at all there are no recipes for the current query
      url = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=1`;
      response = await axios.get(url);

      console.log('Random Recipe Response:', response.data); // Debug log

      if (response.data.recipes && response.data.recipes.length > 0) {
        const recipe = response.data.recipes[0];
        const lines = [
          `Recipe: ${recipe.title} (Suggested since no exact match found)`,
          ...(recipe.analyzedInstructions[0]?.steps.map(
            (step: {step: string}) => step.step,
          ) || ['No detailed steps available.']),
          `Total Time: ${recipe.readyInMinutes} minutes`,
          `Servings: ${recipe.servings}`,
          `Ingredients: ${recipe.extendedIngredients
            .map((ing: {name: string}) => ing.name)
            .join(', ')}`,
        ];
        let fullResponse = '';
        for (const [index, line] of lines.entries()) {
          await new Promise(resolve => setTimeout(resolve, 600));
          fullResponse += line + (index < lines.length - 1 ? '\n' : '');
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {text: fullResponse};
            return newMessages;
          });
        }
        return fullResponse;
      }

      return 'Sorry, I couldn’t find a suitable recipe. Please try a different query or check your connection!';
    } catch (error) {
      console.error(
        'API Error:',
        error.response?.status,
        error.response?.data || error.message,
      );
      if (error.response?.status === 402 || error.response?.status === 429) {
        return 'Sorry, API limit reached. Please try again later or contact support!';
      }
      return 'Sorry, I couldn’t fetch a recipe. Please check your internet connection or try again later!';
    }
  };

  return {messages, inputText, setInputText, isThinking, handleQuery};
};

const MealQueryScreen = () => {
  const {messages, inputText, setInputText, isThinking, handleQuery} =
    useMealQuery();
  const hardcodedQueries = [
    'Give me a recipe I can pair or make with Dr Pepper Blackberry!',
    'Can you suggest a classic Greek salad recipe?',
    'Suggest a recipe with chicken rice.',
  ];
  const renderMessage = ({
    item,
  }: {
    item: {text: string; isUser?: boolean; isLoading?: boolean};
  }) => {
    if (item.isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#ff2d55" />
          <Text style={styles.loadingText}>Thinking</Text>
          <Text style={styles.dots}>...</Text>
        </View>
      );
    }

    return (
      <Animatable.View
        animation={'fadeInUp'}
        duration={600}
        easing="ease-in-out"
        style={[
          styles.message,
          item?.isUser ? styles.userMessage : styles.systemMessage,
        ]}>
        <Text style={styles.messageText}>{item?.text}</Text>
      </Animatable.View>
    );
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    await handleQuery(inputText);
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#fff0f5', '#ffe4e1']} style={styles.gradient}>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.chatContainer}
        />

        <View style={styles.suggestionContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {hardcodedQueries.map((query, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleQuery(query)}
                style={styles.suggestionButton}>
                <Text style={styles.suggestionText}>{query}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me anything about food..."
            placeholderTextColor="#666"
            onSubmitEditing={handleSend}
            editable={!isThinking}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default MealQueryScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  chatContainer: {
    padding: 15,
    paddingBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    elevation: 2,
  },
  sendButton: {
    backgroundColor: '#ff2d55',
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  sendText: {
    color: 'white',
    fontWeight: 'bold',
  },
  suggestionContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  suggestionButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    elevation: 2,
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
    maxWidth: 200,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },
  message: {
    padding: 15,
    borderRadius: 15,
    marginVertical: 5,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  systemMessage: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  dot: {
    fontSize: 16,
    color: '#ff2d55',
  },
});
