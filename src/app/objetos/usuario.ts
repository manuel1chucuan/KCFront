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
    id: string;                  // ID único del usuario
    nombreDeUsuario: string;     // Nombre del usuario
    admini: boolean;             // Si tiene privilegios de administrador
    caja: boolean;               // Acceso al módulo de caja
    servicio: boolean;           // Acceso al módulo de servicio
    inventario: boolean;         // Acceso al módulo de inventario
    activo: boolean;             // Si el usuario está activo
    contrasena: string;          // Contraseña encriptada
    correo: string;              // Correo electrónico
    fechaCreacion: string;       // Fecha de creación en formato ISO
    fechaInactivo: string;       // Fecha de inactividad (o por defecto)
    version: number;             // Versión del usuario
}
