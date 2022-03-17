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
import * as allNodesKML from './mock_data/allNodesKML.json';

function MyCustomGraph () {
	const sigma = useSigma();
	//const isStartNode = (node, connectors) => connectors.filter(connector => connector.target === node.id).length === 0;
	const isStartNode = (node) => node.id === 'rootnode';

	useEffect(() => {
		const graph = sigma.getGraph();
		const canvas = Array.from(demo);
		const parser = new Parser(canvas);
		const {nodes, connectors} = parser.parse();
		const parsedNodes = nodes.map(node => node);

		graph.addNode('terminate', {
			label: 'TERMINATE',
			x: 0, 
			y: 0,
			color: '#eb2e63',
			size: 30
		})

		//Default node size
		let nodeSize = 15;
		//let newRadius = 360 / nodes.length;//90;
		let newRadius = 0;
		let radiusChange = 0;
		parsedNodes.forEach((node, idx) => {
			//radiusChange = (idx / nodes.length);
			radiusChange = nodes.length * (idx / nodes.length);
			newRadius = 3 * nodeSize + radiusChange;
			//newRadius = 3 * nodeSize + radiusChange;

			if (node.id && node.id.includes('_entrypoint')) {
				//newRadius += nodeSize * nodes.length;
				//newRadius += radiusChange;
				newRadius += nodeSize/2;
			//	newRadius += (2 * (idx / nodes.length));//7;
			}

			//const x = newRadius * Math.cos(Math.PI * 2 * (360 / nodes.length) )+idx;
			//const y = newRadius * Math.sin(Math.PI * 2 * (360 / nodes.length) )+idx;
			const x = newRadius * Math.cos(Math.PI * 2 * (idx / nodes.length) - radiusChange/360);
			const y = newRadius * Math.sin(Math.PI * 2 * (idx / nodes.length) - radiusChange/360);
			//const x = newRadius * Math.cos(Math.PI * 2 * (idx / nodes.length)) - radiusChange/360;
			//const y = newRadius * Math.sin(Math.PI * 2 * (idx / nodes.length)) - radiusChange/360;
			//const x = newRadius * Math.cos(Math.PI * 2 * (idx / nodes.length)) + idx;
			//const y = newRadius * Math.sin(Math.PI * 2 * (idx / nodes.length)) + idx;
			//const x = newRadius * Math.cos(Math.PI * 2 * (idx / nodes.length)) + idx / nodes.length;
			//const y = newRadius * Math.sin(Math.PI * 2 * (idx / nodes.length)) + idx / nodes.length;
			//const x = newRadius * Math.cos(Math.PI * 1.6 * idx / nodes.length );
			//const y = newRadius * Math.sin(Math.PI * 1.6 * idx / nodes.length );


			if (node.id && node.id.includes('_exitpoint')) {
				newRadius -= nodeSize / 2;
				//newRadius -= radiusChange;
				//	newRadius -= (2 * (idx / nodes.length));//7;
			}

			const green = '#378805';
			const red = '#FF0000';
			const queeDefaultEnd = '#1e4620';

			graph.addNode((node.id) ? node.id : "strangeNode" + idx,
				{
					label: `[${node.type}] ${node.name}`,
					x, 
					y,
					color: node.isValid ? (node.type == 'entertainer_end' ? queeDefaultEnd : green) : red,
					size: (isStartNode(node)) ? (2 * nodeSize) : nodeSize
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