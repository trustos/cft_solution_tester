import { useEffect } from "react";
import {useSigma, useLoadGraph} from "react-sigma-v2";
import Parser from "./lib/parser";
import {MultiGraph, UndirectedGraph} from 'graphology';

// import erdosRenyi from "graphology-generators/random/erdos-renyi";
import * as tiny from './mock_data/tiny_edited.json';

function MyCustomGraph () {
	const sigma = useSigma();
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

		console.log(nodes, connectors);



		// console.log(data);


		graph.addNode('terminate', {
			label: 'TERMINATE',
			x: 0, 
			y: 0,
			color: '#eb2e63',
			size: 30
		})
		nodes.forEach((node, idx) => {
			const x = 10 * Math.cos(Math.PI * 2 * idx / nodes.length );
			const y = 10 * Math.sin(Math.PI * 2 * idx / nodes.length );

			graph.addNode(node.id, 
				{
					label: node.name,
					x, 
					y,
					color: node.isValid ? '#00FF00' : '#FF0000',
					size: 20
				}
			);
		});

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
	}, []);

	// return <></>;
	return <></>;
  };

  export default MyCustomGraph;