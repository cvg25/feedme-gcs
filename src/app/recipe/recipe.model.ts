export enum Dificultad {
    Amateur,
    Avanzado,
    Experto,
    Profesional
}

export enum Categoria {
    Postres,
    Vegano,
    Gourmet,
    Comida_Rapida,
    Compartir,
    Otros
}

export interface PasoReceta {
    titulo: string;
    descripcion: string;
    tiempo: string;
}

export interface Comentario {
    userId: string;
    mensaje: string;
    fecha: string;
}


export interface Recipe {
    id: string;
    fechaCreacion: string;
    ingredientes: string[];
    titulo: string;
    descripcion: string;
    imagenes: string[];
    dificultad: Dificultad;
    tiempo: string;
    categoria: Categoria;
    pasos: PasoReceta[];
    userId: string;
    comentarios: Comentario[];
    likes: string[]; //Lista con los id de los usuarios que han dado like
}