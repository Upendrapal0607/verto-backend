import { endpoint as getEndpoint } from "./getAll";
import { endpoint as createEndpoint } from "./add";
import { endpoint as editEndpoint } from "./edit";
import { endpoint as deleteEndpoint } from "./delete";

export const endpoints = [
getEndpoint, createEndpoint, editEndpoint, deleteEndpoint
];

export default endpoints;
