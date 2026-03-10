# Diagrama de Relaciones

## Relaciones
- User (club) --1:N-- Pista
- User (user) --1:N-- Reserva
- Pista --1:N-- Reserva

## Queries Ejemplo
- Pistas de un club: `Pista.find({ club: userId })`
- Reservas de un usuario: `Reserva.find({ usuario: userId }).populate('pista')`
- Reservas en una pista: `Reserva.find({ pista: pistaId })`