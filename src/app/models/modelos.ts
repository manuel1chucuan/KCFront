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
    id: string;
    nombreDeUsuario: string;
    admini: boolean;
    caja: boolean;
    servicio: boolean;
    inventario: boolean;
    activo: boolean;
    contrasena: string;
    correo: string;
    fechaCreacion: string;
    fechaInactivo: string;
    version: number;
}


//////////////////////////////////////Servicios////////////////////////////////////////
export interface CrearServicio {
    nombre: string;
    descripcion: string;
}


export interface Servicio {
    id: string;
    nombre: string;
    descripcion: string;
    fechaModificacion: Date;
    modifico: string;
    serviciosPorSucursal: ServicioPorSucursal[];
    version: number;
}

export interface ServicioPorSucursal {
  idSucursal: string;
  precio: number | null;
  fechaCreacion?: Date | null;
  creadoPor?: string | null;
}

//////////////////////////////////////Productos////////////////////////////////////////
export interface CrearProducto {
    nombre: string;
    descripcion: string;
}


export interface Producto {
    id: string;
    nombre: string;
    descripcion: string;
    fechaModificacion: Date;
    modifico: string;
    productoPorSucursal: ProductoPorSucursal[];
    version: number;
}

export interface ProductoPorSucursal {
  idSucursal: string;
  precio: number | null;
  stock: number | null;
  fechaCreacion?: Date | null;
  creadoPor?: string | null;
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
    id: string;
    nombre: string;
    fechaModificacion: Date;
    modifico: string;
    codigoPostal: number;
    estado: string;
    municipio: string;
    colonia: string;
    calle: string;
    numeroInt: number;
    numeroExt: number;
    version: number;
}