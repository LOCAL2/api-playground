const BASE = "https://api-playground-delta-nine.vercel.app";

let passed = 0;
let failed = 0;
const failures = [];

async function call(method, path, body) {
  const url = `${BASE}${path}`;
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) opts.body = JSON.stringify(body);

  try {
    const res = await fetch(url, opts);
    const status = res.status;
    let data;
    try { data = await res.json(); } catch { data = null; }

    const ok = status >= 200 && status < 300;
    if (ok) {
      console.log(`✅ ${method.padEnd(6)} ${path} → ${status}`);
      passed++;
    } else {
      const errMsg = data?.error || data?.message || JSON.stringify(data);
      console.log(`❌ ${method.padEnd(6)} ${path} → ${status} | ${errMsg}`);
      failed++;
      failures.push({ method, path, status, error: errMsg });
    }
    return { status, data };
  } catch (err) {
    console.log(`❌ ${method.padEnd(6)} ${path} → NETWORK ERROR | ${err.message}`);
    failed++;
    failures.push({ method, path, status: "ERR", error: err.message });
    return { status: 0, data: null };
  }
}

console.log("=".repeat(60));
console.log("  API TEST — " + BASE);
console.log("=".repeat(60));

// ─── USERS ────────────────────────────────────────────────────
console.log("\n📁 USERS");
await call("GET",    "/api/users");
await call("GET",    "/api/users/1");
const postUser = await call("POST", "/api/users", {
  name: "TestUser",
  email: "testuser9999@test.com",
  password: "pass1234",
});
const newUserId = postUser?.data?.id ?? postUser?.data?.user?.id ?? 999;
await call("PUT",    "/api/users/1",       { name: "Alice Johnson", email: "alice.johnson@example.com" });
await call("PATCH",  "/api/users/1",       { bio: "updated bio" });
await call("DELETE", `/api/users/${newUserId}`);

// ─── POSTS ────────────────────────────────────────────────────
console.log("\n📁 POSTS");
await call("GET",    "/api/posts");
await call("GET",    "/api/posts/1");
await call("POST",   "/api/posts",  { title: "Test Post", content: "Test content here" });
await call("PUT",    "/api/posts/1",{ title: "Updated Post", content: "Updated content" });
await call("PATCH",  "/api/posts/1",{ title: "Patched Post" });
await call("DELETE", "/api/posts/999");

// ─── PRODUCTS ─────────────────────────────────────────────────
console.log("\n📁 PRODUCTS");
await call("GET",    "/api/products");
await call("GET",    "/api/products/1");
await call("POST",   "/api/products",  { name: "Test Product", price: 100 });
await call("PUT",    "/api/products/1",{ name: "Updated Product", price: 200 });
await call("PATCH",  "/api/products/1",{ stock: 99 });
await call("DELETE", "/api/products/999");

// ─── STUDENTS ─────────────────────────────────────────────────
console.log("\n📁 STUDENTS");
await call("GET",    "/api/students");
await call("GET",    "/api/students/1");
await call("POST",   "/api/students",  { name: "นายทดสอบ ระบบ" });
await call("PUT",    "/api/students/1",{ name: "นายอัปเดต ระบบ" });
await call("PATCH",  "/api/students/1",{ gender: "ชาย" });
await call("DELETE", "/api/students/999");

// ─── MOVIES ───────────────────────────────────────────────────
console.log("\n📁 MOVIES");
await call("GET",    "/api/movies");
await call("GET",    "/api/movies/1");
await call("POST",   "/api/movies",  { title: "Test Movie" });
await call("PUT",    "/api/movies/1",{ title: "Updated Movie" });
await call("PATCH",  "/api/movies/1",{ rating: 9.5 });
await call("DELETE", "/api/movies/999");

// ─── BOOKS ────────────────────────────────────────────────────
console.log("\n📁 BOOKS");
await call("GET",    "/api/books");
await call("GET",    "/api/books/9780132350884");
await call("POST",   "/api/books",  { title: "Test Book", author: "Test Author", isbn: "9789999999999" });
await call("PUT",    "/api/books/9780132350884",{ title: "Clean Code Updated", author: "Robert C. Martin" });
await call("PATCH",  "/api/books/9780132350884",{ rating: 4.9 });
await call("DELETE", "/api/books/9789999999999");

// ─── COUNTRIES ────────────────────────────────────────────────
console.log("\n📁 COUNTRIES");
await call("GET",    "/api/countries");
await call("GET",    "/api/countries/TH");
await call("POST",   "/api/countries",   { name: "TestLand", code: "ZZ" });
await call("PUT",    "/api/countries/TH",{ name: "Thailand" });
await call("PATCH",  "/api/countries/TH",{ capital: "Bangkok" });
await call("DELETE", "/api/countries/ZZ");

// ─── RECIPES ──────────────────────────────────────────────────
console.log("\n📁 RECIPES");
await call("GET",    "/api/recipes");
await call("GET",    "/api/recipes/1");
await call("POST",   "/api/recipes",  { title: "Test Recipe" });
await call("PUT",    "/api/recipes/1",{ title: "Updated Recipe" });
await call("PATCH",  "/api/recipes/1",{ calories: 300 });
await call("DELETE", "/api/recipes/999");

// ─── ANIMALS ──────────────────────────────────────────────────
console.log("\n📁 ANIMALS");
await call("GET",    "/api/animals");
await call("GET",    "/api/animals/1");
await call("POST",   "/api/animals",  { name: "Test Animal" });
await call("PUT",    "/api/animals/1",{ name: "Lion" });
await call("PATCH",  "/api/animals/1",{ lifespan: 20 });
await call("DELETE", "/api/animals/999");

// ─── TODOS ────────────────────────────────────────────────────
console.log("\n📁 TODOS");
await call("GET",    "/api/todos");
await call("GET",    "/api/todos/1");
await call("POST",   "/api/todos",       { title: "Test Todo" });
await call("PUT",    "/api/todos/1",     { title: "Updated Todo" });
await call("PATCH",  "/api/todos/1",     { completed: true });
await call("PATCH",  "/api/todos/1/toggle");
await call("DELETE", "/api/todos/999");

// ─── SUMMARY ──────────────────────────────────────────────────
const total = passed + failed;
console.log("\n" + "=".repeat(60));
console.log(`  SUMMARY: ${passed}/${total} passed | ${failed} failed`);
console.log("=".repeat(60));

if (failures.length > 0) {
  console.log("\n❌ FAILED ENDPOINTS:");
  for (const f of failures) {
    console.log(`   ${f.method.padEnd(6)} ${f.path} → ${f.status} | ${f.error}`);
  }
}
