import PlaceSearchInput from "@/components/PlaceSearchInput";
import { Category } from "@/constants/category";
import Colors from "@/constants/colors";
import { NewIssue } from "@/constants/request/newIssue";
import { Status } from "@/constants/status";
import { useAuth } from "@/context/AuthContext";
import issueService from "@/services/issueService";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import LogInBlock from "@/components/LogInBlock";
import * as ImagePicker from "expo-image-picker";

const Page: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [lat, setLat] = useState<string>("");
  const [lon, setLon] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();
  const [selectedStatus, setSelectedStatus] = useState<number | undefined>();

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    address?: string;
  }>({});

  const { isLoggedIn, currentUser } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) return;

    const loadCategoriesAndStatuses = async () => {
      try {
        const loadedCategories = await issueService.getCategories();
        const loadedStatuses = await issueService.getStatuses();
        setCategories(loadedCategories);
        setStatuses(loadedStatuses);
        if (loadedCategories.length > 0)
          setSelectedCategory(loadedCategories[0].id);
        if (loadedStatuses.length > 0) setSelectedStatus(loadedStatuses[0].id);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadCategoriesAndStatuses();
  }, [isLoggedIn]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Se requieren permisos para acceder a tus fotos.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: false,
    });

    if (pickerResult.canceled) {
      return;
    }

    setImageUrl(pickerResult.assets[0].uri);
  };

  const handlePlaceSelection = (place: NominatimPlace) => {
    const latitude = place.lat;
    const longitude = place.lon;
    setLat(latitude);
    setLon(longitude);
    setAddress(place.display_name);
  };

  const onClearPlace = () => {
    setLat("");
    setLon("");
    setAddress("");
  };

  const validate = () => {
    let isValid = true;
    let newErrors = {};

    if (title.trim() === "") {
      newErrors = { ...newErrors, title: "El título es obligatorio." };
      isValid = false;
    }

    if (description.trim() === "") {
      newErrors = {
        ...newErrors,
        description: "La descripción es obligatoria.",
      };
      isValid = false;
    }

    if (address.trim() === "") {
      newErrors = { ...newErrors, address: "La dirección es obligatoria." };
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCreateIssue = async () => {
    if (!validate()) return;
    if (selectedCategory === undefined || selectedStatus === undefined) return;
    if (!currentUser?.id) return;

    const newIssue = new NewIssue(
      title,
      description,
      address,
      lat,
      lon,
      currentUser?.id,
      selectedCategory,
      selectedStatus
    );

    try {
      await issueService.createIssue(newIssue);
      router.navigate("/");
    } catch (error) {
      console.error("Hubo un error al crear la incidencia:", error);
    }
  };

  if (!isLoggedIn) {
    return <LogInBlock title="Crear Reporte de Incidencia" />;
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>Crear Reporte de Incidencia</Text>
      <Text style={styles.description}>
        Por favor, rellena los siguientes campos para reportar tu incidencia.
        Asegúrate de describir detalladamente el problema y añadir una imagen
        que ilustre la situación.
      </Text>
      <Button
        title="Seleccionar Imagen"
        onPress={pickImage} 
        color={Colors.primary}
      />

      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={{ width: 200, height: 200 }} />
      ) : null}

      <TextInput
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

      <TextInput
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      {errors.description && (
        <Text style={styles.errorText}>{errors.description}</Text>
      )}

      <PlaceSearchInput
        onPlaceSelected={handlePlaceSelection}
        onClear={onClearPlace}
      />
      {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

      <Text>Categoría:</Text>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)}
        style={styles.picker}
      >
        {categories.map((category) => (
          <Picker.Item
            key={category.id}
            label={category.name}
            value={category.id}
          />
        ))}
      </Picker>

      <Text>Estado:</Text>
      <Picker
        selectedValue={selectedStatus}
        onValueChange={(itemValue, itemIndex) => setSelectedStatus(itemValue)}
        style={styles.picker}
      >
        {statuses.map((status) => (
          <Picker.Item key={status.id} label={status.name} value={status.id} />
        ))}
      </Picker>

      <Button
        title="REPORTAR"
        onPress={handleCreateIssue}
        color={Colors.primary}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  picker: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default Page;
