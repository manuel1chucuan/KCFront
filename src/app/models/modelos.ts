//////////////////////////////////////Usuarios////////////////////////////////////////
export interface CrearUsuario {
    nombreDeUsuario: string;
    admini: boolean;
    caja: boolean;
    servicio: boolean;
    inventario: boolean;
    activo: boolean;
    contrasena: string;
    correo: string;
}

export interface Usuario {
    ID: string;
    NombreDeUsuario: string;
    Admini: boolean;
    Caja: boolean;
    Servicio: boolean;
    Inventario: boolean;
    Activo: boolean;
    Contrasena: string;
    Correo: string;
    FechaCreacion: string;
    FechaInactivo: string;
    Version: number;
}


//////////////////////////////////////Servicios////////////////////////////////////////
export interface CrearServicio {
    nombre: string;
    descripcion: string;
}


export interface Servicio {
    ID: string;
    Nombre: string;
    Descripcion: string;
    FechaModificacion: Date;
    Modifico: string;
    ServiciosPorSucursal: ServicioPorSucursal[];
    Version: number;
}
export interface ServicioPorSucursal {
    IdSucursal: string;
    Precio: number;
    FechaCreacion: Date;
    CreadoPor: string;
}

//////////////////////////////////////Sucursales////////////////////////////////////////
export interface CrearSucursal {
    nombre: string;
    codigoPostal: number;
    estado: string;
    municipio: string;
    colonia: string;
    calle: string;
    numeroInt?: number; // Opcional
    numeroExt: number;
}

export interface Sucursal {
    ID: string;
    Nombre: string;
    FechaModificacion: Date;
    Modifico: string;
    CodigoPostal: number;
    Estado: string;
    Municipio: string;
    Colonia: string;
    Calle: string;
    NumeroInt: number;
    NumeroExt: number;
    Version: number;
}

