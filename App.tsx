import React, {useEffect, useState} from 'react';
import {FlatList, Text} from 'react-native';
type Item = {
  iso2: string;
  iso3: string;
  country: string;
};

function App(): JSX.Element {
  const [data, setData] = useState(Array<Item>);

  const getCountries = async () => {
    try {
      const response = await fetch(
        'https://countriesnow.space/api/v0.1/countries',
      );
      const json = await response.json();
      setData(json.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCountries();
  }, []);

  return (
    <FlatList
      data={data}
      renderItem={({item}) => (
        <>
          <Text>
            {item.iso2} - {item.iso3} - {item.country}
          </Text>
        </>
      )}
    />
  );
}

export default App;
