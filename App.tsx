import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DragList, {DragListRenderItemInfo} from 'react-native-draglist';

type Item = {
  iso2: string;
  iso3: string;
  country: string;
};

export default function App() {
  const [data, setData] = useState<string[]>([]);

  const getCountries = async () => {
    try {
      const response = await fetch(
        'https://countriesnow.space/api/v0.1/countries',
      );
      const json = await response.json();
      var cities = json.data.map(function (item: Item) {
        return item.iso2 + ' - ' + item.iso3 + ' - ' + item.country;
      });
      const filteredList: string[] = Array.from(new Set(cities));
      setData(filteredList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCountries();
  }, []);

  function keyExtractor(item: string) {
    return item;
  }

  const renderItem = useCallback((info: DragListRenderItemInfo<string>) => {
    const {item, onDragStart, onDragEnd, isActive} = info;

    return (
      <TouchableOpacity
        key={item}
        style={[styles.item, isActive && styles.active]}
        onLongPress={onDragStart}
        onPressOut={onDragEnd}>
        <Text style={styles.text}>{item}</Text>
      </TouchableOpacity>
    );
  }, []);

  async function onReordered(fromIndex: number, toIndex: number) {
    const copy = [...data]; // Don't modify react data in-place
    const removed = copy.splice(fromIndex, 1);

    copy.splice(toIndex, 0, removed[0]); // Now insert at the new pos
    setData(copy);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Countries List</Text>
      <DragList
        data={data}
        containerStyle={styles.dragList}
        keyExtractor={keyExtractor}
        onReordered={onReordered}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 30,
    paddingVertical: 20,
    flex: 1,
    height: '80%',
  },
  dragList: {
    height: '90%',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  item: {
    backgroundColor: 'lightgrey',
    borderWidth: 1,
    borderColor: 'black',
    minHeight: 30,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  active: {
    backgroundColor: 'yellow',
  },
});
