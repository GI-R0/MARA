import test from "node:test";
import assert from "node:assert/strict";
import User from "../src/models/User.js";

test("comparePassword accepts legacy plain text passwords", async () => {
  const user = new User({
    name: "Legacy User",
    email: "legacy@example.com",
    password: "PlainText123!",
  });

  const isMatch = await user.comparePassword("PlainText123!");
  assert.equal(isMatch, true);
});
