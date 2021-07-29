import axios from "axios";
export const BASE_URL = 'http://localhost:8000/api/';
// export const BASE_URL = 'http://44.192.67.250/api/';
export const MEDIA_URL = 'http://44.192.67.250';
var headers = {'Content-Type': "application/json"};

export const http = axios.create({
    baseURL: BASE_URL,
    headers: headers,
});
