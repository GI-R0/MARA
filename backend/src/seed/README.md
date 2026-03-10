# Seed del Backend

Este directorio contiene el script para sembrar la base de datos con datos iniciales.

## Archivos

- `seed.js`: Script principal que lee los CSV y crea documentos en MongoDB.

## Uso

1. Asegúrate de que los archivos CSV estén en `../data/`.
2. Ejecuta `npm run seed` desde la raíz del backend.

## Datos

- `usuarios.csv`: Usuarios con roles user, club, admin.
- `pistas.csv`: Pistas deportivas.
- `reservas.csv`: Reservas relacionadas.

Los datos se generan aleatoriamente para tener al menos 100 registros en total.