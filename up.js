// for package maintenance: commit and push
// usage: node up.js

import { promisify } from 'util';
import { promises } from 'fs';
import child_process from 'child_process';
const exec = promisify(child_process.exec);

async function run() {
  try {
    await exec("robocopy build docs /xf .git /mir", {});
  }
  catch (e) {
    if (e.code !== 2) {
      console.error("robocopy error", e.code);
      return;
    }
  }
  await promises.writeFile("docs/.nojekyll", "");

  await exec("git add -A", { cwd: "docs" });
  await exec("git commit -a -m \"Update doc\"", { cwd: "docs" });
  await exec("git push", { cwd: "docs" });
  await exec("git commit docs -m \"- Update doc\"", {});
  await exec("git push", {});
  console.info("OK!");
}

run();
