export const normalizeHorariosDisponibles = (horarios) => {
  if (!horarios) return [];

  if (Array.isArray(horarios)) {
    return horarios
      .map((h) => (typeof h === 'string' ? h.trim() : ''))
      .filter(Boolean);
  }

  if (typeof horarios === 'string') {
    return horarios
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean);
  }

  return [];
};
