import { createContext, useReducer, useCallback, useContext } from "react";
import {
  reservaReducer,
  initialReservaState,
  reservaActions,
} from "../reducers/reservaReducer";
import API from "../api/axiosConfig";

export const ReservaContext = createContext();

export const ReservaProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reservaReducer, initialReservaState);

  const fetchReservas = useCallback(async () => {
    dispatch({ type: reservaActions.SET_LOADING, payload: true });
    try {
      const res = await API.get("/reservas/mis-reservas");
      dispatch({ type: reservaActions.SET_RESERVAS, payload: res.data });
    } catch (error) {
      dispatch({
        type: reservaActions.SET_ERROR,
        payload: error.response?.data?.message || "Error al cargar reservas",
      });
    }
  }, []);

  const createReserva = useCallback(async (reservaData) => {
    dispatch({ type: reservaActions.SET_LOADING, payload: true });
    try {
      const res = await API.post("/reservas", reservaData);
      dispatch({ type: reservaActions.ADD_RESERVA, payload: res.data });
      return { success: true, data: res.data };
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Error al crear reserva";
      dispatch({ type: reservaActions.SET_ERROR, payload: errorMsg });
      return { success: false, error: errorMsg };
    }
  }, []);

  const updateReserva = useCallback(async (id, reservaData) => {
    dispatch({ type: reservaActions.SET_LOADING, payload: true });
    try {
      const res = await API.put(`/reservas/${id}`, reservaData);
      dispatch({ type: reservaActions.UPDATE_RESERVA, payload: res.data });
      return { success: true, data: res.data };
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Error al actualizar reserva";
      dispatch({ type: reservaActions.SET_ERROR, payload: errorMsg });
      return { success: false, error: errorMsg };
    }
  }, []);

  const deleteReserva = useCallback(async (id) => {
    dispatch({ type: reservaActions.SET_LOADING, payload: true });
    try {
      await API.delete(`/reservas/${id}`);
      dispatch({ type: reservaActions.DELETE_RESERVA, payload: id });
      return { success: true };
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Error al eliminar reserva";
      dispatch({ type: reservaActions.SET_ERROR, payload: errorMsg });
      return { success: false, error: errorMsg };
    }
  }, []);

  const filterByStatus = useCallback((status) => {
    dispatch({ type: reservaActions.FILTER_BY_STATUS, payload: status });
  }, []);

  const filterByDateRange = useCallback((startDate, endDate) => {
    dispatch({
      type: reservaActions.FILTER_BY_DATE,
      payload: { start: new Date(startDate), end: new Date(endDate) },
    });
  }, []);

  const sortReservas = useCallback((sortBy, sortOrder = "asc") => {
    dispatch({
      type: reservaActions.SORT_RESERVAS,
      payload: { sortBy, sortOrder },
    });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: reservaActions.RESET_FILTERS });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: reservaActions.CLEAR_ERROR });
  }, []);

  const value = {
    reservas: state.filteredReservas,
    allReservas: state.reservas,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    fetchReservas,
    createReserva,
    updateReserva,
    deleteReserva,
    filterByStatus,
    filterByDateRange,
    sortReservas,
    resetFilters,
    clearError,
  };

  return (
    <ReservaContext.Provider value={value}>{children}</ReservaContext.Provider>
  );
};

export const useReservas = () => {
  const context = useContext(ReservaContext);
  if (!context) {
    throw new Error("useReservas debe usarse dentro de ReservaProvider");
  }
  return context;
};
