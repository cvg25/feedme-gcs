
export interface User {
    id: string;
    nombre: string;
    username: string;
    email: string;
    password: string;
    recetas: string[];
    seguidores: string[];
    seguidos: string[];
    eventos: string[];
    imagen: string;
}