const validation = async (data: any, schema: any) => {
  try {
    await schema.validate(data, { abortEarly: false });
  } catch (error) {
    return error;
  }
};

interface ValidationError {
  message: string;
  field: string;
}

interface ErrorObject {
  errors: string[];
  inner: object[];
  name: string;
}

export const makeValidationError = (e: ValidationError) => {
  const errors: ErrorObject = {
    errors: [],
    inner: [],
    name: "ValidationError",
  };
  errors.errors.push(e.message);
  errors.inner.push({ path: e.field, message: e.message });
  return errors;
};

export default validation;
