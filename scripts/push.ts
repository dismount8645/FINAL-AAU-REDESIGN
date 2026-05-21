import { execSync } from 'child_process';

function run(cmd: string) {
  try {
    console.log(`Running: ${cmd}`);
    const res = execSync(cmd, { encoding: 'utf-8' });
    console.log(res);
    return res;
  } catch (error: any) {
    console.error(`Error executing command "${cmd}":`);
    console.error(error.stdout || error.message);
    throw error;
  }
}

async function main() {
  const token = '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';
  const repoName = 'dismount8645/aau-redesign';
  const authedUrl = `https://${token}@github.com/${repoName}.git`;

  try {
    try {
      run('git rev-parse --is-inside-work-tree');
    } catch {
      console.log('Initializing git repository...');
      run('git init');
    }

    run('git config user.name "AI Assistant"');
    run('git config user.email "assistant@aistudio.google"');

    run('git add -A');
    run('git commit -m "Standardize UI interactive touch targets, expand normalization register, and refine accessibility mappings"');

    try {
      run('git remote remove origin');
    } catch { /* ignore */ }
    
    run(`git remote add origin ${authedUrl}`);
    
    let branch = 'main';
    try {
      const activeBranch = run('git rev-parse --abbrev-ref HEAD').trim();
      if (activeBranch && activeBranch !== 'HEAD') {
        branch = activeBranch;
      }
    } catch {
      run('git checkout -b main');
    }

    console.log(`Pushing code to remote branch ${branch}...`);
    run(`git push -u origin ${branch} --force`);
    console.log('GitHub push sync finished successfully!');
  } catch (e: any) {
    console.error('Push failed:', e.message);
    process.exit(1);
  }
}

main();
