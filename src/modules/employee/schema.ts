import { Schema } from 'mongoose';
import { COLLECTION, MODEL } from './constants';
// Create employee schema model
const employee = {
    name: { type: String, required: true},
    email: { type: String,required: true },
    position: { type: String },
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now },
};

const schema = new Schema(employee, {
    collection: COLLECTION,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
});

const employeeSchema = {
    model: MODEL,
    schema,
};

export default employeeSchema;
