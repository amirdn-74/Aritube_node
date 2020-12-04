import mongoose from "mongoose";

const validateSingle = (id: any) => {
  try {
    return mongoose.Types.ObjectId(id);
  } catch (error) {
    return false;
  }
};

const validateMany = (ids: string[]) => {
  const result: any[] = [];

  ids.forEach((id) => {
    const tested = validateSingle(id);
    if (tested) result.push(tested);
    else result.push(false);
  });

  if (result.indexOf(false) !== -1) return [];
  return result;
};

export default { single: validateSingle, many: validateMany };
