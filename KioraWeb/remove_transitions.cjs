const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    let list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        let stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.css')) {
                results.push(file);
            }
        }
    });
    return results;
}

const targetDir = 'c:/Room/ItsMe/KioraIniciative/KioraWeb/src/modules/dashboard/components/cards';
const cssFiles = walk(targetDir);

cssFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Match and remove all properties starting with "transition"
    // like transition:, transition-delay:, etc.
    content = content.replace(/^[ \t]*transition[a-z-]*:\s*[^;{}]*;?[ \t]*(?:\n|\r\n)?/gmi, '');
    
    // Remove specific animations but preserve "spin" or loading animations
    content = content.replace(/^[ \t]*animation:\s*(?!spin)[^;{}]*;?[ \t]*(?:\n|\r\n)?/gmi, '');
    
    fs.writeFileSync(file, content, 'utf8');
});

console.log('Removed transitions and animations from ' + cssFiles.length + ' files.');
