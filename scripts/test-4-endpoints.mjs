const BASE = "https://api-playground-delta-nine.vercel.app";

const calls = [
  {
    method: "GET",
    url: `${BASE}/api/todos/1`,
    body: null,
  },
  {
    method: "PUT",
    url: `${BASE}/api/todos/1`,
    body: { title: "Updated Todo" },
  },
  {
    method: "PATCH",
    url: `${BASE}/api/todos/1`,
    body: { completed: true },
  },
  {
    method: "PUT",
    url: `${BASE}/api/animals/1`,
    body: { name: "Lion Updated" },
  },
];

for (const call of calls) {
  const options = {
    method: call.method,
    headers: { "Content-Type": "application/json" },
  };
  if (call.body) {
    options.body = JSON.stringify(call.body);
  }

  let status;
  let responseBody;
  try {
    const res = await fetch(call.url, options);
    status = res.status;
    const text = await res.text();
    try {
      responseBody = JSON.parse(text);
    } catch {
      responseBody = text;
    }
  } catch (err) {
    status = "ERROR";
    responseBody = err.message;
  }

  console.log("─".repeat(60));
  console.log(`Method : ${call.method}`);
  console.log(`URL    : ${call.url}`);
  console.log(`Status : ${status}`);
  console.log(`Body   : ${JSON.stringify(responseBody, null, 2)}`);
}
console.log("─".repeat(60));
