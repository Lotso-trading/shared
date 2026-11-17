import { build, emptyDir } from "jsr:@deno/dnt@0.44.0";

const denoJson = JSON.parse(await Deno.readTextFile("./deno.json"));
const rawVersion: string = denoJson.version || "1.0.0";
const buildNumber: string = denoJson.build || "1";

// Possibilité de forcer la version ou la branche via CLI
const args = Deno.args;
let customVersion: string | undefined;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--version" && args[i + 1]) {
    customVersion = args[i + 1];
  }
}

const refName = Deno.env.get("GITHUB_REF_NAME") || "develop";
const isMainBranch = refName === "main";

const finalVersion =
  customVersion ?? (isMainBranch ? rawVersion : `${rawVersion}-develop.${buildNumber}`);

console.log(`📦 Packaging @lotso-trading/shared v${finalVersion} (Branch: ${refName})...`);

await emptyDir("./npm");

await build({
  entryPoints: ["./src/index.ts"],
  outDir: "./npm",
  shims: {
    deno: false,
  },
  test: false,
  typeCheck: "both",
  compilerOptions: {
    lib: ["ES2022", "DOM"],
  },
  package: {
    name: "@lotso-trading/shared",
    version: finalVersion,
    description: "Shared contracts, Zod schemas and utilities for Lotso Trading",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/Lotso-trading/shared.git",
    },
    publishConfig: {
      registry: "https://npm.pkg.github.com",
    },
  },
  postBuild() {
    try {
      Deno.copyFileSync("README.md", "npm/README.md");
    } catch {
      // README optionnel
    }
  },
});

console.log("✅ Build DNT terminé avec succès.");

// Smoke-test de validation au lancement
console.log("🧪 Lancement du smoke-test sur le build émis...");
const moduleUrl = new URL("../npm/esm/index.js", import.meta.url).href;
const importedModule = await import(moduleUrl);
const exportedKeys = Object.keys(importedModule);

if (exportedKeys.length === 0) {
  throw new Error("Smoke test échoué : aucun export détecté dans le package compilé !");
}

console.log(`✅ Smoke-test validé (${exportedKeys.length} symboles exportés avec succès) :`);
console.log(`   Exemples : ${exportedKeys.slice(0, 5).join(", ")}...`);
