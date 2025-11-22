// Vite plugin to inject THREE.js as a global variable
export default function threeGlobalPlugin() {
  return {
    name: 'three-global',
    transform(code, id) {
      // Only process JS files in the js directory (handle both src/js/ and /js/ paths)
      if ((!id.includes('src/js/') && !id.includes('/js/')) || !id.endsWith('.js')) {
        return code;
      }
      
      // Skip three.js itself and adapter files
      if (id.includes('three.js') || 
          id.includes('weapp-adapter.js') ||
          id.includes('three-global.js')) {
        return code;
      }
      
      // Check if file uses THREE (but not already declared)
      const usesTHREE = /THREE\.|new THREE|THREE\[/.test(code);
      const hasTHREEDeclaration = /const THREE|let THREE|var THREE|window\.THREE/.test(code);
      
      if (usesTHREE && !hasTHREEDeclaration) {
        const lines = code.split('\n');
        let insertIndex = 0;
        
        // Find where to insert (after all imports and after any existing const/let/var declarations)
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('import ')) {
            insertIndex = i + 1;
          } else if (line && !line.startsWith('//') && !line.startsWith('/*') && insertIndex > 0) {
            // Stop at first non-comment, non-import line
            break;
          }
        }
        
        // Insert const THREE = window.THREE; after imports
        lines.splice(insertIndex, 0, 'const THREE = window.THREE;');
        return lines.join('\n');
      }
      
      return code;
    }
  };
}

