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
		const canvas = Array.from(allNodesKML);
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
		let radiusAddition = 0;
		parsedNodes.forEach((node, idx) => {
			if (node.id && node.id.includes('_entrypoint') || node.id && node.id.includes('-entrypoint')) {
				//newRadius += nodeSize * nodes.length;
				//newRadius += radiusChange;
				radiusAddition = nodeSize / 2;
				//	newRadius += (2 * (idx / nodes.length));//7;
			}

			//radiusChange = (idx / nodes.length);
			radiusChange = nodes.length * (idx / nodes.length);
			newRadius = 3 * nodeSize + radiusAddition + radiusChange;
			if (node.id && node.id.includes('_exitpoint') || node.id && node.id.includes('-exitpoint')) {
				newRadius -= radiusAddition / 2;
            }
			//newRadius = 3 * nodeSize + radiusChange;

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


			if (node.id && node.id.includes('_exitpoint') || node.id && node.id.includes('-exitpoint')) {
				radiusAddition = 0;
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
			if (node.exitNodes) {
				//if (node.exitNodes.length > 1) {
				const limitComponent = nodeSize / 10;
				let theAddedX = -1;
				let theAddedY = -1;
				const exitsCount = node.exitNodes.length;
				const shouldChangeDirection = (value, minimum, maximum) => value < minimum || value > maximum;
				const minX = x - limitComponent;
				const maxX = x + limitComponent;
				const minY = y - limitComponent;
				const maxY = y + limitComponent;
				let theXvalue = x + limitComponent/20;
				let theYvalue = y;
				node.exitNodes.forEach((exit, index) => {
					//"type": "anexit",
					//"name": `${node.id}_${exit.text}`,
					////Could also be below
					////"name": `[${node.id}]_exit${idx}`,
					//"id": `[${node.id}]_exit${idx}`,
					//"isValid": node.isValid
					graph.addNode(exit.id,
						{
							label: exit.name,
							//var x = 210 + 210 * Math.cos(2 * Math.PI * i / quantity);
							//var y = 210 + 210 * Math.sin(2 * Math.PI * i / quantity);
							x: theXvalue,
							y: theYvalue,
							//x: x + index / exitsCount,
							//y: y + index / exitsCount,
							//x: x * Math.cos(2 * Math.PI * index / exitsCount),
							//y: y * Math.cos(2 * Math.PI * index / exitsCount),
							//x: x + x * Math.cos(2 * Math.PI * index / exitsCount),
							//y: y + y * Math.cos(2 * Math.PI * index / exitsCount),
							color: exit.isValid ? green : red,
							size: nodeSize / 5
						})
					if (shouldChangeDirection((x + theAddedX), minX, maxX)) {
						theAddedX = theAddedX * -1;
						//theAddedY = 0;
						//}
						if (shouldChangeDirection((y + theAddedY), minY, maxY)) {
							theAddedY = (theAddedY>0) ? -1 : 1;
						}
						theYvalue += theAddedY * Math.cos(2 * Math.PI + (index / limitComponent));
					}
					theXvalue += (theAddedX * Math.cos(2 * Math.PI + (index / limitComponent))) / 10;
					theYvalue += (theAddedY * Math.cos(2 * Math.PI + (index / limitComponent))) / 10;
				//	theXvalue += theAddedX;
				//	theYvalue += theAddedY;
				});
				//} else {
				//	console.
				//	graph.addNode(node.exitNodes[0].id,
				//		{
				//			label: node.exitNodes[0].name,
				//			x,
				//			y,
				//			color: node.exitNodes[0].isValid ? green : red,
				//			size: 1
				//		});

    //            }
			}
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