import { useForm } from "react-hook-form";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import { useCreateCabin } from "./useCreateCabin";
import { useUpdateCabin } from "./useUpdateCabin";

function CreateCabinForm({ cabinToUpdate = {}, onCloseModal }) {
  //ReactQuery
  //Функція для створення нового доміка в таблиці(з Хука)
  const { isCreating, createCabin } = useCreateCabin();
  //Функція для редактування наявного доміка в таблиці(з Хука)
  const { isUpdating, updateCabin } = useUpdateCabin();
  const isWorking = isCreating || isUpdating;

  const { id: updateId, ...updateValue } = cabinToUpdate;

  const isUpdateSession = Boolean(updateId);
  //Ф-ції з хука useForm
  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isUpdateSession ? updateValue : {},
  });
  const { errors } = formState;

  //React Hook Form
  function onSubmit(data) {
    const image = typeof data.image === "string" ? data.image : data.image[0];

    //Редактування
    if (isUpdateSession)
      updateCabin(
        { newCabinData: { ...data, image }, id: updateId },
        { onSuccess: (data) => reset() }
      );
    //Створення
    else
      createCabin(
        { ...data, image: image },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
        }
      );
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", {
            required: "Це поле є обов'язковим",
          })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register("maxCapacity", {
            required: "Це поле є обов'язковим",
            min: {
              value: 1,
              message: "Має бути мінімум 1 гість",
            },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register("regularPrice", {
            required: "Це поле є обов'язковим",
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disabled={isWorking}
          defaultValue={0}
          {...register("discount", {
            required: "Це поле є обов'язковим",
            validate: (value) =>
              value <= getValues().regularPrice ||
              "Скидка повинна бути меншою за ціну",
          })}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        error={errors?.description?.message}
      >
        <Textarea
          type="number"
          id="description"
          {...register("description", {
            required: "Це поле є обов'язковим",
          })}
        />
      </FormRow>

      <FormRow label="Cabin photo">
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            required: isUpdateSession ? false : "Це поле є обов'язковим",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isUpdateSession ? "Update cabin" : "Create new cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
