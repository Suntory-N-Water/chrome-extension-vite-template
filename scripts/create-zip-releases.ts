import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * changeset tagで作成されたタグからZIPを作成してGitHub Releaseを作成
 */
async function createZipReleases() {
  // 最新のgitタグを取得（changeset tagが作成したタグ）
  let tags: string[];
  try {
    tags = execSync('git tag --points-at HEAD', { encoding: 'utf-8' })
      .trim()
      .split('\n')
      .filter((tag) => tag.includes('@')); // example-extension@0.0.2 形式のみ
  } catch (error) {
    console.log('ℹ No git tags found at HEAD.');
    return;
  }

  if (tags.length === 0) {
    console.log('ℹ No tags found at HEAD. Skipping release creation.');
    return;
  }

  for (const tag of tags) {
    console.log(`\n📦 Processing tag: ${tag}`);

    const [packageName, version] = tag.split('@');
    const packageDir = join('packages', packageName);
    const distDir = join(packageDir, 'dist');

    if (!existsSync(distDir)) {
      console.log(`⚠ Skipping ${packageName}: no dist/ directory`);
      continue;
    }

    // ZIPファイルを作成
    const zipFile = `${packageName}.zip`;
    const zipPath = join(packageDir, zipFile);

    console.log(`  Creating ${zipFile}...`);
    execSync(`cd ${distDir} && zip -r ../${zipFile} .`, { stdio: 'inherit' });
    console.log(`  ✓ Created ${zipFile}`);

    // GitHub Releaseが既に存在するか確認
    try {
      execSync(`gh release view ${tag}`, { stdio: 'ignore' });
      console.log(`  ⚠ Release ${tag} already exists, skipping...`);
      continue;
    } catch {
      // リリースが存在しない場合は作成
    }

    // GitHub Releaseを作成
    const releaseNotes = [
      `Release of ${packageName} version ${version}`,
      '',
      '## Installation',
      '',
      `1. Download \`${packageName}.zip\``,
      '2. Extract the archive',
      '3. Open Chrome and navigate to `chrome://extensions/`',
      '4. Enable "Developer mode"',
      '5. Click "Load unpacked" and select the extracted folder',
      '',
      'Or upload to Chrome Web Store manually.',
    ].join('\n');

    console.log(`  Creating GitHub Release...`);
    execSync(
      `gh release create "${tag}" "${zipPath}" --title "${tag}" --notes "${releaseNotes}"`,
      { stdio: 'inherit' }
    );

    console.log(`  ✓ Created release: ${tag}`);
  }
}

createZipReleases().catch((error) => {
  console.error('Error creating releases:', error);
  process.exit(1);
});
