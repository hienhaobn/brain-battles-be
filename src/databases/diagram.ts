import { writeFileSync } from 'fs';
import datasource from './data-source';

async function generateMermaidERD() {
	try {
		await datasource.initialize();
		const entities = datasource.entityMetadatas;

		let mermaidCode = 'erDiagram\n';

		entities.forEach(entity => {
			// Add entities
			entity.relations.forEach(relation => {
				const relationshipType = relation.isOneToOne
					? '||--||'
					: relation.isOneToMany
						? '||--|{'
						: relation.isManyToOne
							? '}|--|{'
							: '}|--|{';

				mermaidCode += `    ${entity.name} ${relationshipType} ${relation.inverseEntityMetadata.name} : "${relation.propertyName}"\n`;
			});
		});

		writeFileSync('diagram.mmd', mermaidCode);
		console.log('Mermaid diagram generated: diagram.mmd');
		await datasource.destroy();
	} catch (error) {
		console.error('Error:', error);
		process.exit(1);
	}
}

generateMermaidERD();
