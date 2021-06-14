var fs = require('fs');
var highland = require('highland');
var streams3 = require('../streams4/streams3');
var streams5 = require('./streams5');

var excludeFolderMap = streams3.excludeFolderMap;
var getFilePath = streams5.getFilePath;

function createProjectWorkspace(coreDetails, moduleDetails) {

};

function getAttributeXML(component) {
	var attributeXML = [];

	for (key in component) {
		if (key == 'content') {
			continue;
		}

		attributeXML.push(' ');
		attributeXML.push(key);
		attributeXML.push('="');
		attributeXML.push(component[key].replace(/"/g, '&quot;'))
		attributeXML.push('"');
	}

	return attributeXML.join('');
}

function getComponentXML(component) {
	return '<component' + getAttributeXML(component) + '>\n' + component.content + '\n</component>';
};

function getFacetManagerXML(module) {
	var facetManagerXML = [];

	return facetManagerXML.join('\n');
};

function getIndent(indent) {
	return new Array(indent + 1).join('  ');
};

function getIntellijXML(fileData) {
	var xmlContent = [
		'<?xml version="1.0"?>',
		'',
		'<module type="JAVA_MODULE" version="4">'
	];

	fileData.components
		.map(
			// TODO: create or use a function that will convert each component
			// into an XML representation
		)
		.filter(
			// TODO: create or use a function that will check that the XML
			// is not empty.
		)
		.forEach(
			// TODO: create or use a function that will convert append each XML
			// representation to our XML content array.
		);

	xmlContent.push('</module>');

	return {
		name: fileData.fileName,
		content: xmlContent.join('\n')
	};
};

function getModuleIMLPath(module) {
	return getFilePath(module.modulePath, module.moduleName + '.iml');
};

function getModuleXML(module) {
	return {
		fileName: getModuleIMLPath(module),
		components: [
			{
				name: 'NewModuleRootManager',
				content: getNewModuleRootManagerXML(module)
			},
			{
				name: 'FacetManager',
				content: getFacetManagerXML(module)
			}
		]
	};
};

function getNewModuleRootManagerXML(module) {
	var newModuleRootManagerXML = getOutputURLElements(module);

	// Additional logic here

	return newModuleRootManagerXML.join('\n');
};

function getOutputURLElements(module) {
	var outputFolder = 'classes';

	if (module.excludeFolders.indexOf('docroot/WEB-INF/classes') != -1) {
		outputFolder = 'docroot/WEB-INF/classes';
	}

	var outputURLElements = ['<output url="file://$MODULE_DIR$/' + outputFolder + '" />'];

	if (module.testSourceFolders.length > 0) {
		outputURLElements.push('<output-test url="file://$MODULE_DIR$/test-classes" />');
	}

	return outputURLElements;
};

function saveContent(file) {
	var indent = 0;
	var splitContent = file.content.split('\n')
		.filter(highland.compose(highland.not, highland.not));

	for (var i = 0; i < splitContent.length; i++) {
		var line = splitContent[i].trim();
		splitContent[i] = getIndent(indent) + line;

		if (line.indexOf('<?') == 0) {
			continue;
		}

		if (line.indexOf('<') == -1) {
			splitContent[i] = getIndent(++indent) + line;
			continue;
		}

		if (line.indexOf('/>') != -1) {
			continue;
		}

		if (line.indexOf('<') == line.indexOf('</')) {
			splitContent[i] = getIndent(--indent) + line;
		}

		if (line.indexOf('</') == -1) {
			++indent;
		}
	}

	fs.writeFileSync(file.name, splitContent.join('\n'));
};

exports.createProjectWorkspace = createProjectWorkspace;
exports.getOutputURLElements = getOutputURLElements;