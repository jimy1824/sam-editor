import axios from "axios";
export const BASE_URL = 'http://localhost:8000/api/';
var headers = {'Content-Type': "application/json"};

export const http = axios.create({
    baseURL: BASE_URL,
    headers: headers,
});
