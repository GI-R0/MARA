import http from "http";

http
  .get("http://localhost:5173/pistas", (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      try {
        const json = JSON.parse(data);
        console.log(JSON.stringify(json, null, 2));
      } catch {
        console.error("Response not JSON:", data);
      }
      process.exit(0);
    });
  })
  .on("error", (err) => {
    console.error("Error fetching /pistas via frontend:", err.message);
    process.exit(1);
  });
