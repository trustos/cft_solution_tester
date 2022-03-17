import { useEffect } from "react";
import {useSigma} from "react-sigma-v2";
import Parser from "./lib/parser";

import * as all from './mock_data/all_modules_demo.json';
import * as tiny from './mock_data/tiny_edited.json';
import * as jysk from './mock_data/average_31726_JyskNordic_CSC_DK.json';
import * as grj from './mock_data/average_60051_Great_Rail_Journeys.json';
import * as ikea from './mock_data/small_11954_Ikea_DK.json';
import * as latest_latest from './mock_data/latest_latest_mock.json';

function MyCustomGraph () {
	const sigma = useSigma();
	const isStartNode = (node, connectors) => connectors.filter(connector => connector.target === node.id).length === 0;

	useEffect(() => {
		const graph = sigma.getGraph();
		const canvas = Array.from(latest_latest);
		const parser = new Parser(canvas);
		const {nodes, connectors} = parser.parse();

		graph.addNode('terminate', {
			label: 'TERMINATE',
			x: 0, 
			y: 0,
			color: '#eb2e63',
			size: 30
		})

		let newRadius = 50;
		nodes.forEach((node, idx) => {

			console.log(node);

			if (node.id.includes('_entrypoint')) {
				newRadius += 5;
			}

			if (node.id.includes('_exitpoint')) {
				newRadius -= 5;
			}

			const x = newRadius * Math.cos(Math.PI * 2 * idx / nodes.length );
			const y = newRadius * Math.sin(Math.PI * 2 * idx / nodes.length );

			//Default node size
			let size = 15;

			if (isStartNode(node, connectors)) {
				size = 30;
			}

			const green = '#378805';
			const red = '#FF0000';

			graph.addNode(node.id, 
				{
					label: `[${node.type}] ${node.name}`,
					x, 
					y,
					color: node.isValid ? green : red,
					size
				}
			);
		});
		
		connectors.forEach((connector, idx) => {

			//If target || source === point ? color = something else
			let color = connector.target === 'terminate' ? '#eb2e63' : '#808080';
			let type = 'arrow';

			if (connector.type === 'level-to-level') {
				color = '#FFA500';
				type = 'line';
			}

			graph.addEdge(connector.source, connector.target, { color, size: 5, label: connector.type, type });
		});
	}, []);
	
	return <></>;
  };

  export default MyCustomGraph;