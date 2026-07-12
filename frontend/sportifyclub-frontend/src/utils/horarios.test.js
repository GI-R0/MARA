import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeHorariosDisponibles } from './horarios.js';

test('normalizeHorariosDisponibles convierte strings y arrays a una lista válida', () => {
  assert.deepEqual(normalizeHorariosDisponibles('09:00, 10:00, 11:00'), [
    '09:00',
    '10:00',
    '11:00',
  ]);

  assert.deepEqual(normalizeHorariosDisponibles(['09:00', ' 10:00 ', '']), [
    '09:00',
    '10:00',
  ]);

  assert.deepEqual(normalizeHorariosDisponibles(undefined), []);
});
