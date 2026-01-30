import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const eventDirs = [
    'src/data/events/combat',
    'src/data/events/boss',
    'src/data/events/choice',
    'src/data/events/treasure',
    'src/data/events/rest',
    'src/data/events/trap',
    'src/data/events/merchant'
];

let filesUpdated = 0;

for (const dir of eventDirs) {
    const dirPath = path.join(__dirname, dir);
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.ts') && f !== 'index.ts');

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Find icon string like: icon: 'GiIconName',
        const iconMatch = content.match(/icon:\s*'(Gi[A-Za-z]+)'/);

        if (iconMatch) {
            const iconName = iconMatch[1];

            // Check if import already exists
            if (!content.includes(`from 'react-icons/gi'`)) {
                // Add import after the first import line
                content = content.replace(
                    /(import type { DungeonEvent } from '@\/types')/,
                    `$1\nimport { ${iconName} } from 'react-icons/gi'`
                );
            }

            // Replace icon string with component reference
            content = content.replace(
                new RegExp(`icon:\\s*'${iconName}'`),
                `icon: ${iconName}`
            );

            fs.writeFileSync(filePath, content, 'utf8');
            filesUpdated++;
            console.log(`✓ ${path.relative(__dirname, filePath)} - ${iconName}`);
        }
    }
}

console.log(`\n✅ Updated ${filesUpdated} event files`);
