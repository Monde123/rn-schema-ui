import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function pack(pkgDir) {
  const out = execSync('npm pack --dry-run --json --ignore-scripts', {
    cwd: path.join(root, pkgDir),
    encoding: 'utf8',
  });
  // npm may print warnings before JSON array
  const start = out.indexOf('[');
  const end = out.lastIndexOf(']');
  if (start < 0 || end < 0) throw new Error(`No JSON from npm pack in ${pkgDir}:\n${out.slice(0, 500)}`);
  const data = JSON.parse(out.slice(start, end + 1));
  const info = Array.isArray(data) ? data[0] : data;
  return {
    name: info.name,
    version: info.version,
    filename: info.filename,
    sizeBytes: info.size,
    unpackedSize: info.unpackedSize,
    fileCount: info.entryCount ?? info.files?.length,
  };
}

execSync('npm run build', { cwd: root, stdio: 'inherit' });
const cli = pack('packages/cli');
const runtime = pack('packages/runtime');
console.log(JSON.stringify({ cli, runtime }, null, 2));
