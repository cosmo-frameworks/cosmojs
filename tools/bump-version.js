const { execSync } = require("child_process");
const readline = require("readline");
const fs = require("fs");

const pkgPath = "./package.json";
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

(async () => {
  console.log(`Versión actual: ${pkg.version}`);

  const newVersion = await ask("Nueva versión (ej. 1.0.1): ");
  rl.close();

  if (!newVersion.match(/^\d+\.\d+\.\d+$/)) {
    console.error("❌ Formato de versión inválido. Usa MAJOR.MINOR.PATCH");
    process.exit(1);
  }

  pkg.version = newVersion;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

  execSync("git add package.json", { stdio: "inherit" });
  execSync(`git commit -m "release: v${newVersion}"`, { stdio: "inherit" });
  execSync(`git tag v${newVersion}`, { stdio: "inherit" });
  execSync("git push && git push --tags", { stdio: "inherit" });

  console.log(`✅ Versión ${newVersion} preparada.`);
})();
