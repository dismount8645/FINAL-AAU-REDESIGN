#!/usr/bin/env node

/**
 * En simpel Node.js script, der tjekker om Git er tilgængeligt
 * og viser den aktuelle commit hash samt status for repository.
 *
 * Kør med:
 *   node src/scripts/checkGit.js
 *
 * Denne fil er kun til test og kan fjernes eller flyttes senere.
 */

const { execSync } = require('child_process');

function runCommand(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8' }).trim();
  } catch (err) {
    return null;
  }
}

const gitAvailable = runCommand('git --version');
if (!gitAvailable) {
  console.error('Git ser ikke ud til at være installeret eller tilgængeligt i PATH.');
  process.exit(1);
}

console.log(`Git version: ${gitAvailable}`);

const commitHash = runCommand('git rev-parse --short HEAD');
if (commitHash) {
  console.log(`Aktuel commit: ${commitHash}`);
} else {
  console.log('Kunne ikke hente commit hash.');
}

const status = runCommand('git status --short');
if (status !== null) {
  console.log('Repository status:');
  console.log(status || 'Ingen ændringer.');
} else {
  console.log('Kunne ikke hente repository status.');
}
