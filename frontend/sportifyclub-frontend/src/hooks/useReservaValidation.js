import { useState, useCallback } from "react";

export const useReservaValidation = () => {
  const [validationErrors, setValidationErrors] = useState({});

  const validateFecha = useCallback((fecha) => {
    if (!fecha) {
      return "La fecha es obligatoria";
    }

    const selectedDate = new Date(fecha);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return "No puedes reservar en fechas pasadas";
    }

    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);

    if (selectedDate > maxDate) {
      return "Solo puedes reservar hasta 3 meses en adelante";
    }

    return "";
  }, []);

  const validateHora = useCallback((hora, horariosDisponibles = []) => {
    if (!hora) {
      return "Debes seleccionar una hora";
    }

    if (horariosDisponibles.length > 0 && !horariosDisponibles.includes(hora)) {
      return "Esta hora no está disponible";
    }

    return "";
  }, []);

  const validateDuracion = useCallback((duracion) => {
    if (!duracion || duracion <= 0) {
      return "La duración debe ser mayor a 0";
    }

    if (duracion > 3) {
      return "La duración máxima es de 3 horas";
    }

    return "";
  }, []);

  const validateReserva = useCallback(
    (reservaData) => {
      const errors = {};

      const fechaError = validateFecha(reservaData.fecha);
      if (fechaError) errors.fecha = fechaError;

      const horaError = validateHora(
        reservaData.hora,
        reservaData.horariosDisponibles,
      );
      if (horaError) errors.hora = horaError;

      const duracionError = validateDuracion(reservaData.duracion);
      if (duracionError) errors.duracion = duracionError;

      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    },
    [validateFecha, validateHora, validateDuracion],
  );

  const clearErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  return {
    validationErrors,
    validateFecha,
    validateHora,
    validateDuracion,
    validateReserva,
    clearErrors,
  };
};

export default useReservaValidation;
