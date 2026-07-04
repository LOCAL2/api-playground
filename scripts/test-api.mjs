const BASE = "https://api-playground-delta-nine.vercel.app";

async function call(method, path, body) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) opts.body = JSON.stringify(body);

  let status, text, json;
  try {
    const res = await fetch(`${BASE}${path}`, opts);
    status = res.status;
    text = await res.text();
    try { json = JSON.parse(text); } catch { json = null; }
  } catch (e) {
    status = "ERR";
    text = e.message;
    json = null;
  }

  const ok = typeof status === "number" && status < 400;
  const marker = ok ? "✅" : "❌";
  console.log(`${marker} ${method.padEnd(6)} ${path}`);
  console.log(`   Status: ${status}`);
  if (!ok) console.log(`   Body:   ${text.slice(0, 300)}`);
  return { method, path, status, ok };
}

const results = [];
function r(m, p, b) { return call(m, p, b).then(v => results.push(v)); }

// ── Users ──────────────────────────────────────────────────────────────────
console.log("\n=== USERS ===");
await r("GET",    "/api/users");
await r("GET",    "/api/users/1");
const newUser = await call("POST", "/api/users", { name: "Test", email: "test999@test.com", password: "pass1234" });
results.push(newUser);
const newUserId = newUser.ok ? null : null; // server returns created id — we use /51 per instructions
await r("PUT",    "/api/users/1",  { name: "Alice Updated", email: "alice.johnson@example.com" });
await r("PATCH",  "/api/users/1",  { bio: "updated" });
await r("DELETE", "/api/users/51");

// ── Posts ──────────────────────────────────────────────────────────────────
console.log("\n=== POSTS ===");
await r("GET",    "/api/posts");
await r("GET",    "/api/posts/1");
await r("POST",   "/api/posts",   { title: "Test", content: "Test content" });
await r("PUT",    "/api/posts/1",  { title: "Updated", content: "Updated content" });
await r("PATCH",  "/api/posts/1",  { title: "Patched" });
await r("DELETE", "/api/posts/201");

// ── Products ───────────────────────────────────────────────────────────────
console.log("\n=== PRODUCTS ===");
await r("GET",    "/api/products");
await r("GET",    "/api/products/1");
await r("POST",   "/api/products", { name: "Test Product", price: 100 });
await r("PUT",    "/api/products/1", { name: "Updated Product", price: 200 });
await r("PATCH",  "/api/products/1", { stock: 99 });
await r("DELETE", "/api/products/251");

// ── Students ───────────────────────────────────────────────────────────────
console.log("\n=== STUDENTS ===");
await r("GET",    "/api/students");
await r("GET",    "/api/students/1");
await r("POST",   "/api/students", { name: "นายทดสอบ" });
await r("PUT",    "/api/students/1", { name: "อัปเดต" });
await r("PATCH",  "/api/students/1", { gender: "ชาย" });
await r("DELETE", "/api/students/31");

// ── Movies ─────────────────────────────────────────────────────────────────
console.log("\n=== MOVIES ===");
await r("GET",    "/api/movies");
await r("GET",    "/api/movies/1");
await r("POST",   "/api/movies", { title: "Test Movie" });
await r("PUT",    "/api/movies/1", { title: "Updated Movie" });
await r("PATCH",  "/api/movies/1", { rating: 9 });
await r("DELETE", "/api/movies/251");

// ── Books ──────────────────────────────────────────────────────────────────
console.log("\n=== BOOKS ===");
await r("GET",    "/api/books");
await r("GET",    "/api/books/9780132350884");
await r("POST",   "/api/books", { title: "Test Book", author: "Test Author", isbn: "9781111111111" });
await r("PUT",    "/api/books/9780132350884", { title: "Updated Book", author: "Robert C. Martin" });
await r("PATCH",  "/api/books/9780132350884", { rating: 4.9 });
await r("DELETE", "/api/books/9781111111111");

// ── Countries ──────────────────────────────────────────────────────────────
console.log("\n=== COUNTRIES ===");
await r("GET",    "/api/countries");
await r("GET",    "/api/countries/TH");
await r("POST",   "/api/countries", { name: "TestLand", code: "XX" });
await r("PUT",    "/api/countries/TH", { name: "Thailand Updated" });
await r("PATCH",  "/api/countries/TH", { capital: "Bangkok" });
await r("DELETE", "/api/countries/XX");

// ── Todos ──────────────────────────────────────────────────────────────────
console.log("\n=== TODOS ===");
await r("GET",    "/api/todos");
await r("GET",    "/api/todos/1");
await r("POST",   "/api/todos", { title: "Test Todo" });
await r("PUT",    "/api/todos/1", { title: "Updated Todo" });
await r("PATCH",  "/api/todos/1", { completed: true });
await r("PATCH",  "/api/todos/1/toggle");
await r("DELETE", "/api/todos/11");

// ── Recipes ────────────────────────────────────────────────────────────────
console.log("\n=== RECIPES ===");
await r("GET",    "/api/recipes");
await r("GET",    "/api/recipes/1");
await r("POST",   "/api/recipes", { title: "Test Recipe" });
await r("PUT",    "/api/recipes/1", { title: "Updated Recipe" });
await r("PATCH",  "/api/recipes/1", { calories: 300 });
await r("DELETE", "/api/recipes/101");

// ── Animals ────────────────────────────────────────────────────────────────
console.log("\n=== ANIMALS ===");
await r("GET",    "/api/animals");
await r("GET",    "/api/animals/1");
await r("POST",   "/api/animals", { name: "Test Animal" });
await r("PUT",    "/api/animals/1", { name: "Updated Animal" });
await r("PATCH",  "/api/animals/1", { lifespan: 20 });
await r("DELETE", "/api/animals/101");

// ── Summary ────────────────────────────────────────────────────────────────
console.log("\n========== SUMMARY ==========");
const failed = results.filter(r => !r.ok);
if (failed.length === 0) {
  console.log("✅ All endpoints passed!");
} else {
  console.log(`❌ ${failed.length} endpoint(s) FAILED:\n`);
  for (const f of failed) {
    console.log(`   ${f.method.padEnd(6)} ${f.path}  →  ${f.status}`);
  }
}
console.log(`\nTotal: ${results.length} calls, ${results.filter(r=>r.ok).length} passed, ${failed.length} failed`);
