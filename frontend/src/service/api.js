import axios from 'axios';

// Em produção na Vercel, o prefixo será /_/backend devido ao seu vercel.json
// Em desenvolvimento local, continua sendo seu localhost
const isProd = process.env.NODE_ENV === 'production';
const API_URL = isProd ? '/_/backend' : 'http://localhost:3001';

export const loginUsuario = async (login, senha) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { login, senha });
        return response.data;
    } catch (error) {
        throw error;
    }
};