import supabase, { supabaseUrl } from "./supabase";

//*-----------------------ОТРИМАТИ МАСИВ ОБ'ЄКТІВ З ДОМІКАМИ(ПОТІМ ВИКОР useQuery)-----------------------
export async function getCabins() {
  let { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Не вдалось завантажити будинки");
  }
  return data;
}

//*-----------------------СТВОРЮЄМО АБО РЕДАКТУЄМО ДОМІК В ТАБЛИЦІ ПО ДАНИХ З ФОРМИ-----------------------
export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  //1.Створення/редактування доміка
  let query = supabase.from("cabins");

  //1.1 Створення доміка
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  //1.2 Редактування доміка
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Не вдалось додати новий будинок");
  }

  //2.Загрузимо зображення
  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  //3.Видалити домік якщо при загрузці доміка була помилка
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error("Не вдалось завантажити зображення");
  }
  return data;
}

//*-----------------------ВИДАЛИТИ ПЕВНИЙ ДОМІК З ТАБЛИЦІ ПО ІД(ПОТІМ ВИКОР useMutation)-----------------------
export async function deleteCabin(id) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Не вдалось видалити будинок");
  }
}
