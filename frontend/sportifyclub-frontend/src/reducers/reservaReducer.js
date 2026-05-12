export const reservaActions = {
  SET_LOADING: "SET_LOADING",
  SET_RESERVAS: "SET_RESERVAS",
  ADD_RESERVA: "ADD_RESERVA",
  UPDATE_RESERVA: "UPDATE_RESERVA",
  DELETE_RESERVA: "DELETE_RESERVA",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  FILTER_BY_STATUS: "FILTER_BY_STATUS",
  FILTER_BY_DATE: "FILTER_BY_DATE",
  SORT_RESERVAS: "SORT_RESERVAS",
  RESET_FILTERS: "RESET_FILTERS",
};

export const initialReservaState = {
  reservas: [],
  filteredReservas: [],
  loading: false,
  error: null,
  filters: {
    status: "all",
    dateRange: null,
  },
  sortBy: "fecha",
  sortOrder: "asc",
};

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
          state.sortOrder,
        ),
        loading: false,
        error: null,
      };

    case reservaActions.ADD_RESERVA: {
      const newReservas = [...state.reservas, action.payload];
      return {
        ...state,
        loading: false,
        reservas: newReservas,
        filteredReservas: applyFiltersAndSort(
          newReservas,
          state.filters,
          state.sortBy,
          state.sortOrder,
        ),
      };
    }

    case reservaActions.UPDATE_RESERVA: {
      const updatedReservas = state.reservas.map((r) =>
        r._id === action.payload._id ? action.payload : r,
      );
      return {
        ...state,
        loading: false,
        reservas: updatedReservas,
        filteredReservas: applyFiltersAndSort(
          updatedReservas,
          state.filters,
          state.sortBy,
          state.sortOrder,
        ),
      };
    }

    case reservaActions.DELETE_RESERVA: {
      const remainingReservas = state.reservas.filter(
        (r) => r._id !== action.payload,
      );
      return {
        ...state,
        loading: false,
        reservas: remainingReservas,
        filteredReservas: applyFiltersAndSort(
          remainingReservas,
          state.filters,
          state.sortBy,
          state.sortOrder,
        ),
      };
    }

    case reservaActions.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case reservaActions.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case reservaActions.FILTER_BY_STATUS: {
      const newFilters = {
        ...state.filters,
        status: action.payload,
      };
      return {
        ...state,
        loading: false,
        filters: newFilters,
        filteredReservas: applyFiltersAndSort(
          state.reservas,
          newFilters,
          state.sortBy,
          state.sortOrder,
        ),
      };
    }

    case reservaActions.FILTER_BY_DATE: {
      const dateFilters = {
        ...state.filters,
        dateRange: action.payload,
      };
      return {
        ...state,
        loading: false,
        filters: dateFilters,
        filteredReservas: applyFiltersAndSort(
          state.reservas,
          dateFilters,
          state.sortBy,
          state.sortOrder,
        ),
      };
    }

    case reservaActions.SORT_RESERVAS:
      return {
        ...state,
        loading: false,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder,
        filteredReservas: applyFiltersAndSort(
          state.reservas,
          state.filters,
          action.payload.sortBy,
          action.payload.sortOrder,
        ),
      };

    case reservaActions.RESET_FILTERS:
      return {
        ...state,
        loading: false,
        filters: initialReservaState.filters,
        sortBy: initialReservaState.sortBy,
        sortOrder: initialReservaState.sortOrder,
        filteredReservas: state.reservas,
      };

    default:
      return state;
  }
};

const applyFiltersAndSort = (reservas, filters, sortBy, sortOrder) => {
  let filtered = [...reservas];

  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((r) => r.estado === filters.status);
  }

  if (filters.dateRange) {
    const { start, end } = filters.dateRange;
    filtered = filtered.filter((r) => {
      const fecha = new Date(r.fecha);
      return fecha >= start && fecha <= end;
    });
  }

  filtered.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === "fecha") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return filtered;
};
