const fs = require('fs');
const path = require('path');

const SRC_ROOT = path.resolve(__dirname, '..'); // backend/src
const REPORT_PATH = path.resolve(__dirname, '..', 'dead_code_report.md');
const CLEANUP_DIR = path.resolve(__dirname, '..', '..', 'cleanup_unused');

function getAllJsFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllJsFiles(filePath));
    } else if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
      results.push(filePath);
    }
  });
  return results;
}

function parseImports(fileContent) {
  const importRegex = /import\s+[^;]*?\s+from\s+['"]([^'"]+)['"]/g;
  const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
  const imports = [];
  let match;
  while ((match = importRegex.exec(fileContent)) !== null) {
    imports.push(match[1]);
  }
  while ((match = requireRegex.exec(fileContent)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

function resolveImport(importPath, fromFile) {
  if (importPath.startsWith('.')) {
    const resolved = path.resolve(path.dirname(fromFile), importPath);
    // try adding .js/.mjs if no extension
    if (fs.existsSync(resolved)) return resolved;
    if (fs.existsSync(resolved + '.js')) return resolved + '.js';
    if (fs.existsSync(resolved + '.mjs')) return resolved + '.mjs';
    if (fs.existsSync(resolved + '/index.js')) return resolved + '/index.js';
    if (fs.existsSync(resolved + '/index.mjs')) return resolved + '/index.mjs';
    return null;
  }
  // ignore node_modules or absolute imports
  return null;
}

function main() {
  const allFiles = getAllJsFiles(SRC_ROOT);
  const referenced = new Set();
  const missing = [];
  allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const imports = parseImports(content);
    imports.forEach(imp => {
      const target = resolveImport(imp, file);
      if (target) {
        referenced.add(target);
      } else if (imp.startsWith('.')) {
        // relative import that could not be resolved -> missing file
        const attempted = path.resolve(path.dirname(file), imp);
        missing.push({ from: file, import: imp, attemptedPath: attempted });
      }
    });
  });

  const unused = allFiles.filter(f => !referenced.has(f) && !f.endsWith('app.js'));

  // Ensure cleanup directory exists
  if (!fs.existsSync(CLEANUP_DIR)) fs.mkdirSync(CLEANUP_DIR, { recursive: true });

  const reportLines = [];
  reportLines.push('# Dead Code Report');
  reportLines.push('');
  reportLines.push('## Missing Files (referenced but not found)');
  if (missing.length === 0) {
    reportLines.push('_None_');
  } else {
    missing.forEach(m => {
      reportLines.push(`- From **${path.relative(SRC_ROOT, m.from)}** import **${m.import}** (expected at **${path.relative(SRC_ROOT, m.attemptedPath)}**)`);
    });
  }
  reportLines.push('');
  reportLines.push('## Unused Files (no imports)');
  if (unused.length === 0) {
    reportLines.push('_None_');
  } else {
    unused.forEach(u => {
      const rel = path.relative(SRC_ROOT, u);
      reportLines.push(`- ${rel}`);
      // move file to cleanup directory preserving folder structure
      const dest = path.join(CLEANUP_DIR, rel);
      const destDir = path.dirname(dest);
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      fs.renameSync(u, dest);
    });
  }

  fs.writeFileSync(REPORT_PATH, reportLines.join('\n'), 'utf8');
  console.log('Report generated at', REPORT_PATH);
}

main();
