import colors from "@/constants/colors";
import React, { useState } from "react";
import {
  TextInput,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity
} from "react-native";
interface SearchInputProps {
  onPlaceSelected: (place: NominatimPlace) => void;
  onClear: () => void;
}

const PlaceSearchInput: React.FC<SearchInputProps> = ({ onPlaceSelected, onClear }) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<NominatimPlace[]>([]);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleSearch = async (text: string) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(async () => {
      if (text.length > 3) {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=3&q=${text}`
        );
        const data: NominatimPlace[] = await response.json();
        setResults(data);
      } else {
        setResults([]);
      }
    }, 1000);

    setDebounceTimer(timer);
  };

  const handleSelectPlace = (place: NominatimPlace) => {
    setQuery(place.display_name);
    setResults([]);
    onPlaceSelected(place);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    onClear();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar dirección..."
          onChangeText={(text) => {
            setQuery(text);
            handleSearch(text);
          }}
          value={query}
        />
        <View>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectPlace(item)}>
            <Text style={styles.item}>{item.display_name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#cccccc",
    height: 40,
  },
  clearButton: {
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: colors.grey,
  },
  clearButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  item: {
    padding: 10,
    fontSize: 14,
    borderWidth: 1,
    marginTop: 2,
  },
});

export default PlaceSearchInput;
