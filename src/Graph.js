import { useEffect } from "react";
import {useSigma, useLoadGraph} from "react-sigma-v2";
import Parser from "./lib/parser";
import {MultiGraph, UndirectedGraph} from 'graphology';

// import erdosRenyi from "graphology-generators/random/erdos-renyi";
import * as tiny from './mock_data/tiny_edited.json';

function MyCustomGraph () {
	const sigma = useSigma();
	const isStartNode = (node, connectors) => connectors.filter(connector => connector.target === node.id).length === 0;
	const getNodeById = (nodes, nodeId) => nodes.filter(node => node.id === nodeId);
	// const getChildren = () => 

	const addNodePositions = (nodes, connectors) => {
		let parsedNodes = nodes.map(node => node);
		const terminate = { type: 'terminate', name: 'TERMINATE', id: 'terminate', isValid: true, color: '#FFA500', x: 0, y: 300 };

		parsedNodes.unshift(terminate);

		console.log(parsedNodes);

		parsedNodes.forEach(node => {

			//Check if is starting node
			if (isStartNode(node, connectors)) {
				node.x = 0;
				node.y = 0;
			} else {
				const pointingLink = connectors.filter(connector => connector.target === node.id)[0];
				// console.log(pointingLink);
				const parent = getNodeById(parsedNodes, pointingLink.source);
				
				const parentX = parent[0].hasOwnProperty('x') ? parent[0].x : 1;
				const parentY = parent[0].hasOwnProperty('y') ? parent[0].y : 1;

				console.log(node.id);

				if (node.id.includes('_entrypoint') ) {
					node.x = parentX + 50;
				} else {
					node.x = node.x !== undefined ? node.x : parentX + 5;
				}
				node.y = node.y !== undefined ? node.y : (node.y % 2 ? parentY - 15 : parentY + 15);

				console.log(node);
			}
		});

		return parsedNodes;
	};

	const loadGraph = useLoadGraph();


	// const settings = {multi: true};
	// const graph = new MultiGraph();

	console.log(sigma);

	// console.log(tiny);

	// tiny.forEach(arr => console.log(arr));

	// console.log(tiny);
	// const canvas = Array.from(tiny);
	// const parser = new Parser(canvas);
	// const data = parser.parse();


	useEffect(() => {
		const graph = sigma.getGraph();
		// const graph = new MultiGraph();
		// const graph = erdosRenyi(MultiGraph, { order: 100, probability: 0.2 });
		const canvas = Array.from(tiny);
		const parser = new Parser(canvas);
		const {nodes, connectors} = parser.parse();
		// console.log(addNodePositions(nodes));
		const parsedNodes = addNodePositions(nodes, connectors);
		
		//If contains modulename_EntryPoint_something - start new circle based on current modules coordinates
		//Until id contains modulename_ExitPoint_something

		// graph.addNode('terminate', {
		// 	label: 'TERMINATE',
		// 	x: 20, 
		// 	y: 20,
		// 	color: '#eb2e63',
		// 	size: 30
		// });

		// const getParent = () => {};

		const numberOfConnections = nodeId => connectors.filter(connector => connector.target === nodeId).length;

		console.log(parsedNodes);
		
		parsedNodes.forEach((node, idx) => {
			// const x = node.x || (10 * Math.cos(Math.PI * 2 * idx / nodes.length ));
			// const y = node.y || (10 * Math.sin(Math.PI * 2 * idx / nodes.length ));

			const x = node.x;
			const y = node.y;
			// const x = node.x !== undefined ? node.x : 1;
			// const y = node.y !== undefined ? node.x : 1;

			const color = node => {
				console.log(node.color || node.isValid ? '#00FF00' : '#FF0000');
				return node.color || (node.isValid ? '#00FF00' : '#FF0000');
			};

			graph.addNode(node.id, 
				{
					label: node.name,
					x, 
					y,
					color: color(node),
					size: 10 * (numberOfConnections(node.id) || 1)
				}
			);
		}, []);

		// graph('terminate', {})

		
		connectors.forEach((connector, idx) => {

			//If target || source === point ? color = something else
			const color = connector.target === 'terminate' ? '#eb2e63' : '#808080';

			graph.addEdge(connector.source, connector.target, { color, size: 5, label: connector.type, type: 'arrow' });
		})
		// console.log(graph);
		// loadGraph(graph);

		// graph.addNode("Jessica", { label: "Jessica2", x: -1, y: -1, color: "#FF0", size: 100 });
		// graph.addNode("Truman", { label: "Truman", x: 0, y: 0, color: "#00F", size: 50 });
		// graph.addNode("Washington", { label: "Washington", x: 2, y: 2, color: "#00F", size: 50 });
		// graph.addEdge("Jessica", "Truman", { color: "#0f0f0f", size: 25, label: 'Connection', type: 'arrow' });
	});

	// return <></>;
	return <></>;
  };

  export default MyCustomGraph;