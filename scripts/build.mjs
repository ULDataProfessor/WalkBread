#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

const scriptsDir = path.resolve(new URL('.', import.meta.url).pathname);
const projectRoot = path.resolve(scriptsDir, '..');
const distDir = path.join(projectRoot, 'dist');

const directoriesToCopy = ['icons', 'js'];
const filesToCopy = ['index.html', 'manifest.json', 'sw.js', path.join('css', 'tailwind.css')];

async function removeDist() {
  await fs.rm(distDir, { recursive: true, force: true });
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function copyFile(srcRelative, destRelative) {
  const srcPath = path.join(projectRoot, srcRelative);
  const destPath = path.join(distDir, destRelative);
  await ensureDir(path.dirname(destPath));
  await fs.copyFile(srcPath, destPath);
}

async function copyDir(srcRelative) {
  const srcPath = path.join(projectRoot, srcRelative);
  const destPath = path.join(distDir, srcRelative);
  const entries = await fs.readdir(srcPath, { withFileTypes: true });
  await ensureDir(destPath);

  for (const entry of entries) {
    const srcEntry = path.join(srcRelative, entry.name);
    const destEntry = path.join(srcRelative, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcEntry);
    } else if (entry.isFile()) {
      await copyFile(srcEntry, destEntry);
    }
  }
}

async function writeStaticMeta() {
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const pkgRaw = await fs.readFile(packageJsonPath, 'utf8');
  const pkg = JSON.parse(pkgRaw);
  const meta = {
    name: pkg.name,
    version: pkg.version,
    generatedAt: new Date().toISOString(),
  };
  await fs.writeFile(path.join(distDir, 'build.json'), JSON.stringify(meta, null, 2));
}

async function build() {
  console.log('➡️  Creating distribution folder...');
  await removeDist();
  await ensureDir(distDir);

  for (const dir of directoriesToCopy) {
    console.log(`📁 Copying ${dir}/`);
    await copyDir(dir);
  }

  for (const file of filesToCopy) {
    console.log(`📄 Copying ${file}`);
    await copyFile(file, file);
  }

  await writeStaticMeta();
  console.log('✅ Build directory ready at dist/');
}

build().catch((error) => {
  console.error('❌ Build failed:', error);
  process.exitCode = 1;
});
