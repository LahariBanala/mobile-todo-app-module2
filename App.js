import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function HomeScreen({navigation}) {
  const [tasks, setTasks] = useState([
    {id:'1', title:'Complete Module 2 notes', category:'Study', done:false},
    {id:'2', title:'Review mobile UI basics', category:'Study', done:false},
  ]);

  const toggleTask = (id) => setTasks(tasks.map(t => t.id === id ? {...t, done:!t.done} : t));
  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));

  const addTask = (task) => setTasks([...tasks, {...task, id:Date.now().toString(), done:false}]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My To-Do List</Text>
      <Text style={styles.subtitle}>{tasks.length} task(s)</Text>

      <FlatList
        data={tasks}
        keyExtractor={item=>item.id}
        ListEmptyComponent={<Text style={styles.empty}>No tasks yet. Add your first task!</Text>}
        renderItem={({item})=>(
          <View style={styles.card}>
            <TouchableOpacity style={styles.taskArea} onPress={()=>toggleTask(item.id)}>
              <Text style={[styles.check, item.done && styles.doneCheck]}>{item.done ? '✓' : '○'}</Text>
              <View style={{flex:1}}>
                <Text style={[styles.task, item.done && styles.done]}>{item.title}</Text>
                <Text style={styles.category}>{item.category}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>deleteTask(item.id)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={()=>navigation.navigate('Add Task', {addTask})}>
        <Text style={styles.addText}>+ Add Task</Text>
      </TouchableOpacity>
    </View>
  );
}

function AddTaskScreen({navigation, route}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Study');

  const save = () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Please enter a task name.');
      return;
    }
    route.params.addTask({title:title.trim(), category});
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Task</Text>
      <Text style={styles.label}>Task name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your task"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.categories}>
        {['Personal','Study','Work'].map(c=>(
          <TouchableOpacity key={c} style={[styles.chip, category===c && styles.selectedChip]} onPress={()=>setCategory(c)}>
            <Text style={[styles.chipText, category===c && styles.selectedText]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={save}>
        <Text style={styles.addText}>Save Task</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{title:'To-Do App'}} />
        <Stack.Screen name="Add Task" component={AddTaskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, padding:20, backgroundColor:'#f7f8fc'},
  title:{fontSize:28,fontWeight:'700',marginTop:10,color:'#172033'},
  subtitle:{fontSize:15,color:'#687086',marginBottom:15},
  card:{backgroundColor:'#fff',borderRadius:14,padding:15,marginBottom:12,flexDirection:'row',alignItems:'center'},
  taskArea:{flexDirection:'row',alignItems:'center',flex:1},
  check:{fontSize:28,marginRight:12,color:'#4169e1'},
  doneCheck:{color:'#28a36a'},
  task:{fontSize:16,fontWeight:'600',color:'#222'},
  done:{textDecorationLine:'line-through',color:'#888'},
  category:{fontSize:12,color:'#777',marginTop:4},
  delete:{fontSize:13,color:'#c0392b',fontWeight:'600',marginLeft:8},
  empty:{textAlign:'center',color:'#777',marginTop:50},
  addButton:{backgroundColor:'#172033',padding:16,borderRadius:12,alignItems:'center',marginTop:10},
  addText:{color:'#fff',fontSize:16,fontWeight:'700'},
  label:{fontSize:15,fontWeight:'600',marginTop:20,marginBottom:8,color:'#333'},
  input:{backgroundColor:'#fff',borderWidth:1,borderColor:'#ddd',borderRadius:10,padding:14,fontSize:16},
  categories:{flexDirection:'row',gap:8,marginBottom:20},
  chip:{paddingVertical:10,paddingHorizontal:15,borderRadius:20,backgroundColor:'#e9ebf2'},
  selectedChip:{backgroundColor:'#172033'},
  chipText:{color:'#333'},
  selectedText:{color:'#fff',fontWeight:'600'}
});
