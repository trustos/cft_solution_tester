import { useEffect } from "react";
import {useSigma} from "react-sigma-v2";
import Parser from "./lib/parser";

import * as all from './mock_data/all_modules_demo.json';
import * as tiny from './mock_data/tiny_edited.json';
import * as jysk from './mock_data/average_31726_JyskNordic_CSC_DK.json';
import * as grj from './mock_data/average_60051_Great_Rail_Journeys.json';
import * as ikea from './mock_data/small_11954_Ikea_DK.json';
import * as latest from './mock_data/latest_mock.json';
import * as demo from './mock_data/demo_callflow.json';
import * as latest_latest from './mock_data/latest_latest_mock.json';

function MyCustomGraph () {
	const sigma = useSigma();
	//const isStartNode = (node, connectors) => connectors.filter(connector => connector.target === node.id).length === 0;
	const isStartNode = (node) => node.id === 'rootnode';

	useEffect(() => {
		const graph = sigma.getGraph();
		const canvas = Array.from(demo);
		const parser = new Parser(canvas);
		const {nodes, connectors} = parser.parse();

		const entertainers = {
			'queue': {
				"type": "queue_entertainer_end",
				"name": "queue_entertainer_end",
				"id": "queue_entertainer_end",
				"isValid": true
			}, 
			'queue1': {
				"type": "queue1_entertainer_end",
				"name": "queue1_entertainer_end",
				"id": "queue1_entertainer_end",
				"isValid": true
			}
		};

		const parsedNodes = nodes.map(node => node);
		parsedNodes.forEach((node, idx) => {

			if (node.type === 'queue-exitpoint') {
				const queueName = node.id.split('_')[0];
				if (!parsedNodes.filter(node => node.id === entertainers[queueName].id).length) {
					parsedNodes.splice(idx - 1, 0, entertainers[queueName]);
				}
			}
		});

		graph.addNode('terminate', {
			label: 'TERMINATE',
			x: 0, 
			y: 0,
			color: '#eb2e63',
			size: 30
		})

		let newRadius = 60;
		parsedNodes.forEach((node, idx) => {

			if (node.id.includes('_entrypoint')) {
				newRadius += 5;
			}

			if (node.id.includes('_exitpoint')) {
				newRadius -= 5;
			}

			const x = newRadius * Math.cos(Math.PI * 1.6 * idx / nodes.length );
			const y = newRadius * Math.sin(Math.PI * 1.6 * idx / nodes.length );

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