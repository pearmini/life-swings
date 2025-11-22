import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function fixImportsInFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Pattern to match imports: import ... from "./path" or import ... from "../path"
    // But exclude paths that already have extensions or are JSON
    const lines = content.split('\n');
    const fixedLines = lines.map(line => {
      // Match import statements
      const importMatch = line.match(/^(\s*import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\*\s+as\s+\w+|\w+))*\s+from\s+)?['"])(\.\.?\/[^'"]+)(['"])/);
      
      if (importMatch) {
        const [, prefix, importPath, suffix] = importMatch;
        
        // Skip if already has extension or is JSON
        if (!importPath.match(/\.(js|json|css|png|jpg|gif|svg|mp3|wav)$/)) {
          modified = true;
          return line.replace(importPath, importPath + '.js');
        }
      }
      
      return line;
    });
    
    if (modified) {
      writeFileSync(filePath, fixedLines.join('\n'), 'utf8');
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dir) {
  const files = readdirSync(dir, { withFileTypes: true });
  let count = 0;
  
  for (const file of files) {
    const fullPath = join(dir, file.name);
    
    if (file.isDirectory()) {
      count += processDirectory(fullPath);
    } else if (file.isFile() && extname(file.name) === '.js') {
      if (fixImportsInFile(fullPath)) {
        count++;
      }
    }
  }
  
  return count;
}

// Process js directory
console.log('Fixing imports...');
const count = processDirectory(join(__dirname, 'js'));
console.log(`Done! Fixed ${count} files.`);

