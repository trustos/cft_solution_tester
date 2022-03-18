var nodes = [];
var connectors = [];
var contenTypeServiceModuleTypes = ["queue-entrypoint",
    "queue-exitpoint",
    "loop-exitpoint",
    "loop-entrypoint",
    "content-entrypoint",
    "content-exitpoint"];
var contenTypes = ["queue", "loop", "content"];

export class Parser {
	constructor(canvases = []) {
		this._canvases = canvases;
	}

    parse() {
        let rootnodeCanvas = this.getCanvasModules("rootnode");

        if (!rootnodeCanvas || !rootnodeCanvas.length) return;

        let serviceModule = rootnodeCanvas[0];

        if (this.getModuleType(serviceModule) != "service") return;

        this.parseCanvas(rootnodeCanvas);

		return {nodes, connectors};
    };

    parseCanvas(moduleList) {
        moduleList.forEach(module => {
            // node creation 
            let node = this.createNode(module);

            if (node.type === 'queue-exitpoint') {
                const queueName = node.id.split('_')[0];
                const idValue = queueName + "_entertainer_end";
                nodes.push({
                    "type": "entertainer_end",
                    "name": idValue,
                    "id": idValue,
                    "isValid": true
                });
            }

            //connectors creation 
            if (!module.exits) return;

            node.exitNodes = [];

            module.exits.forEach((exit, idx) => {
                if (!exit.next) return;

                let targetId = exit.next.targetId;

                if (targetId) {
                    //node.type = this.getModuleType(module);
                    //node.name = this.getModuleName(module);
                    //node.id = this.getModuleId(module);
                    //node.isValid = module.isValid;
                    const anExit = {
                        "type": "anexit",
                        "name": `${node.id}_${exit.text}`,
                        //Could also be below
                        //"name": `[${node.id}]_exit${idx}`,
                        "id": `[${node.id}]_exit${idx}`,
                        "isValid": node.isValid
                    };

                    let connector = this.createConnector(anExit.id, targetId, exit.exitDefaultTarget);
                        
                    connectors.push(connector);
                    node.exitNodes.push(anExit);
                }
            });

            //Should already have exits attached to it, together with conector for each exit
            nodes.push(node);

            // content type modules
            if (contenTypes.includes(node.type)) {
                let moduleList = this.getCanvasModules(node.id);
                let entrypoint = moduleList.find(module_ => this.getModuleType(module_).endsWith("entrypoint"));
                let entrypointNode = this.createNode(entrypoint);
                let connectorToEntrypoint = this.createConnector(node.id, entrypointNode.id, null);
                connectorToEntrypoint.type = "level-to-level";
                connectors.push(connectorToEntrypoint);

                let exitpoint = moduleList.find(module_ => this.getModuleType(module_).endsWith("exitpoint"));
                let exitpointNode = this.createNode(exitpoint);
                let connectorFromExitpoint = this.createConnector(exitpointNode.id, node.id, null);
                connectorFromExitpoint.type = "level-to-level";
                connectors.push(connectorFromExitpoint);

                // recursion 
                this.parseCanvas(moduleList);
            }
        });       
    }

    createConnector(nodeId, targetId, exitDefaultTarget) {
        let connector = {};

        connector.source = nodeId;
        connector.target = targetId;
        connector.type = "node-to-node";

        if (exitDefaultTarget && connector.target == exitDefaultTarget) {
            connector.type = "node-to-terminate";
        }

        return connector;
    }

    createNode(module) {
        let node = {};
           
        node.type = this.getModuleType(module);
        node.name = this.getModuleName(module);
        node.id = this.getModuleId(module);
        node.isValid = module.isValid;
        node.properties = new Map();

        module.tabs.forEach(tab => {
            if (tab.length != 2 || !tab[1].propertyValues) return;

            tab[1].propertyValues.forEach(pair => {
                if (pair.length != 2) return;

                node.properties.set(pair[0], pair[1]);
            });
        });

        if (contenTypeServiceModuleTypes.includes(node.type)) {
            node.id = node.properties.get("id");
        }

        return node;
    }

    getModuleName(object) {
        let basicTab, name, type;

        basicTab = this.getBasicTab(object);
        name = basicTab && basicTab.moduleName;
        type = this.getModuleType(object);

        if (contenTypeServiceModuleTypes.includes(type)) {
            if (type.endsWith("entrypoint")) {
                name += " EntryPoint";
            }

            if (type.endsWith("exitpoint")) {
                name += " ExitPoint";
            }
        }

        return name;
    };

    getModuleId(object) {
        let basicTab = this.getBasicTab(object);
        return basicTab && basicTab.moduleId;
    };

    getModuleType(object) {
        let basicTab = this.getBasicTab(object);
        return basicTab && basicTab.moduleType;
    };

    getBasicTab(object) {
        let basicTab;

        basicTab = object.tabs.find(tab => tab.length == 2 && tab[0] == "Basic");

        if (!basicTab) return;

        return basicTab[1];
    }

    getCanvasModules(canvasId) {
        let moduleList,
            // canvases is global variable containing all levels
            canvas = this._canvases.find(item => item.length == 2 && item[0] == canvasId);


        if (!canvas) return;

        moduleList = canvas && canvas[1];

        return moduleList;
    }
};

export default Parser;

var parser = new Parser();
parser.parse();
console.log(nodes);
console.log(connectors);