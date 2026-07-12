import test from "node:test";
import assert from "node:assert/strict";
import { validationResult } from "express-validator";
import { registerValidator } from "../src/validators/auth.validator.js";

test("registerValidator acepta una contraseña que cumple la regla", async () => {
  const req = {
    body: {
      name: "Usuario Prueba",
      email: "valid.password.test@example.com",
      password: "Abcd1234@",
    },
  };

  for (const validator of registerValidator) {
    await validator.run(req);
  }

  const result = validationResult(req);

  assert.equal(result.isEmpty(), true);
  assert.deepEqual(result.array(), []);
});