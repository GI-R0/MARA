/**
 * Acciones disponibles para el reducer de reservas
 */
export const reservaActions = {
  SET_LOADING: "SET_LOADING",
  SET_RESERVAS: "SET_RESERVAS",
  SET_ERROR: "SET_ERROR",
  ADD_RESERVA: "ADD_RESERVA",
  UPDATE_RESERVA: "UPDATE_RESERVA",
  DELETE_RESERVA: "DELETE_RESERVA",
  FILTER_BY_STATUS: "FILTER_BY_STATUS",
  FILTER_BY_DATE: "FILTER_BY_DATE",
  SORT_RESERVAS: "SORT_RESERVAS",
  RESET_FILTERS: "RESET_FILTERS",
  CLEAR_ERROR: "CLEAR_ERROR",
};

/**
 * Estado inicial del reducer
 */
export const initialReservaState = {
  reservas: [],
  filteredReservas: [],
  loading: false,
  error: null,
  filters: {
    status: "all",
    startDate: null,
    endDate: null,
  },
  sortBy: "fecha",
  sortOrder: "asc",
};

/**
 * Filtra las reservas por estado
 */
const filterByStatus = (reservas, status) => {
  if (status === "all") return reservas;
  return reservas.filter((r) => r.estado === status);
};

/**
 * Filtra las reservas por rango de fechas
 */
const filterByDateRange = (reservas, startDate, endDate) => {
  if (!startDate || !endDate) return reservas;
  return reservas.filter((r) => {
    const reservaDate = new Date(r.fecha);
    return reservaDate >= startDate && reservaDate <= endDate;
  });
};

/**
 * Ordena las reservas
 */
const sortReservas = (reservas, sortBy, sortOrder) => {
  const sorted = [...reservas];

  sorted.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Manejar valores null/undefined
    if (aValue === null || aValue === undefined) aValue = "";
    if (bValue === null || bValue === undefined) bValue = "";

    // Convertir a date si es fecha
    if (sortBy === "fecha") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return sorted;
};

/**
 * Aplica todos los filtros y ordenamiento a las reservas
 */
const applyFiltersAndSort = (reservas, filters, sortBy, sortOrder) => {
  let result = [...reservas];

  // Aplicar filtros
  result = filterByStatus(result, filters.status);
  result = filterByDateRange(result, filters.startDate, filters.endDate);

  // Aplicar ordenamiento
  result = sortReservas(result, sortBy, sortOrder);

  return result;
};

/**
 * Reducer para gestionar el estado de reservas
 */
export const reservaReducer = (state, action) => {
  switch (action.type) {
    case reservaActions.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case reservaActions.SET_RESERVAS:
      return {
        ...state,
        reservas: action.payload,
        filteredReservas: applyFiltersAndSort(
          action.payload,
          state.filters,
          state.sortBy,
          state.sortOrder
        ),
        error: null,
        loading: false,
      };

    case reservaActions.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case reservaActions.ADD_RESERVA:
      const newReservas = [...state.reservas, action.payload];
      return {
        ...state,
        reservas: newReservas,
        filteredReservas: applyFiltersAndSort(
          newReservas,
          state.filters,
          state.sortBy,
          state.sortOrder
        ),
        loading: false,
        error: null,
      };

    case reservaActions.UPDATE_RESERVA:
      const updatedReservas = state.reservas.map((r) =>
        r._id === action.payload._id ? action.payload : r
      );
      return {
        ...state,
        reservas: updatedReservas,
        filteredReservas: applyFiltersAndSort(
          updatedReservas,
          state.filters,
          state.sortBy,
          state.sortOrder
        ),
        loading: false,
        error: null,
      };

    case reservaActions.DELETE_RESERVA:
      const deletedReservas = state.reservas.filter(
        (r) => r._id !== action.payload
      );
      return {
        ...state,
        reservas: deletedReservas,
        filteredReservas: applyFiltersAndSort(
          deletedReservas,
          state.filters,
          state.sortBy,
          state.sortOrder
        ),
        loading: false,
        error: null,
      };

    case reservaActions.FILTER_BY_STATUS:
      const newFilters1 = { ...state.filters, status: action.payload };
      return {
        ...state,
        filters: newFilters1,
        filteredReservas: applyFiltersAndSort(
          state.reservas,
          newFilters1,
          state.sortBy,
          state.sortOrder
        ),
      };

    case reservaActions.FILTER_BY_DATE:
      const newFilters2 = {
        ...state.filters,
        startDate: action.payload.start,
        endDate: action.payload.end,
      };
      return {
        ...state,
        filters: newFilters2,
        filteredReservas: applyFiltersAndSort(
          state.reservas,
          newFilters2,
          state.sortBy,
          state.sortOrder
        ),
      };

    case reservaActions.SORT_RESERVAS:
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder,
        filteredReservas: applyFiltersAndSort(
          state.reservas,
          state.filters,
          action.payload.sortBy,
          action.payload.sortOrder
        ),
      };

    case reservaActions.RESET_FILTERS:
      return {
        ...state,
        filters: initialReservaState.filters,
        sortBy: initialReservaState.sortBy,
        sortOrder: initialReservaState.sortOrder,
        filteredReservas: applyFiltersAndSort(
          state.reservas,
          initialReservaState.filters,
          initialReservaState.sortBy,
          initialReservaState.sortOrder
        ),
      };

    case reservaActions.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
