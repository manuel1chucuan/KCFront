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
    ID: string;                  // ID único del usuario
    NombreDeUsuario: string;     // Nombre del usuario
    Admini: boolean;             // Si tiene privilegios de administrador
    Caja: boolean;               // Acceso al módulo de caja
    Servicio: boolean;           // Acceso al módulo de servicio
    Inventario: boolean;         // Acceso al módulo de inventario
    Activo: boolean;             // Si el usuario está activo
    Contrasena: string;          // Contraseña encriptada
    Correo: string;              // Correo electrónico
    FechaCreacion: string;       // Fecha de creación en formato ISO
    FechaInactivo: string;       // Fecha de inactividad (o por defecto)
    Version: number;             // Versión del usuario
}
