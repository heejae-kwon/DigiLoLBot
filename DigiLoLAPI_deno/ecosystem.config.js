module.exports = {
  apps: [
    {
      name: "deno",
      script: "./index.ts",
      interpreter: "deno",
      interpreterArgs: "run --reload --allow-net",
    },
  ],
};

