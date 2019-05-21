
export enum Visibilidad {
    Publico,
    Privado
}

export interface Evento {
    id: string;
    titulo: string;
    descripcion: string;
    fecha: string;
    visibilidad: Visibilidad;
    imagenes: string[];
    usuarios: string[];
    creador: string;
    fechaRealizacion: string;
}