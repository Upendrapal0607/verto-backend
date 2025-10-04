import { registerModel } from "../core/database/index";
import employeeSchema from "./employee/schema";

const schemas = [
employeeSchema
];

const registerModels = () => {
    schemas.forEach((model) => {
        registerModel(model.model, model.schema);
    });
};

export default registerModels;
