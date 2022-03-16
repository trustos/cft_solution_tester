import React, { ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import MyCustomGraph from "./Graph";
// import { useSigma } from "react-sigma-v2/src/index";
import {useSigma, SigmaContainer} from "react-sigma-v2";
// import { SigmaContainer} from "react-sigma-v2/lib/esm/SigmaContainer";
import './App.css';
import "react-sigma-v2/lib/react-sigma-v2.css";

function App() {
	// const MyCustomGraph = () => {
	// 	const sigma = useSigma();
	// 	const graph = sigma.getGraph();
	// 	// const graph = erdosRenyi(UndirectedGraph, { order: 100, probability: 0.2 });

	// 	// console.log(graph.nodes().filter(node => node === 'asd').length);

	// 	useEffect(() => {

	// 		graph.addNode("Jessica", { label: "Jessica2", x: 1, y: 1, color: "#FF0", size: 10 });
	// 		graph.addNode("Truman", { label: "Truman", x: 0, y: 0, color: "#00F", size: 5 });
	// 		graph.addEdge("Jessica", "Truman", { color: "#CCC", size: 1 });

	// 		// graph.addNode(
	// 		// 	'asd',
	// 		// 	{
	
	// 		// 		nodeType: "company",
	// 		// 		label: 'Jessica',
	// 		// 		// size: data.edges.reduce((prev, curr) => {
	// 		// 		// if (curr.from === node.id) {
	// 		// 		// 	return prev + 3;
	// 		// 		// }
	// 		// 		// return prev;
	// 		// 		// }, 15),
	// 		// 		x: 1,
	// 		// 		y: 1,
	// 		// 		size: 1,
	// 		// 		color: "#335996"
	// 		// 	}
	// 		// );
	// 	}, [graph])

	// 	// if (!graph.nodes().filter(node => node === 'asd').length) {
	// 	// 	graph.addNode(
	// 	// 		'asd',
	// 	// 		{
	
	// 	// 			nodeType: "company",
	// 	// 			label: 'Jessica',
	// 	// 			// size: data.edges.reduce((prev, curr) => {
	// 	// 			// if (curr.from === node.id) {
	// 	// 			// 	return prev + 3;
	// 	// 			// }
	// 	// 			// return prev;
	// 	// 			// }, 15),
	// 	// 			x: 1,
	// 	// 			y: 1,
	// 	// 			size: 1,
	// 	// 			color: "#335996"
	// 	// 		}
	// 	// 	);
	// 	// }

	// 	// graph.addNode(
	// 	// 	'asd',
	// 	// 	{

	// 	// 		nodeType: "company",
	// 	// 		label: 'Jessica',
	// 	// 		// size: data.edges.reduce((prev, curr) => {
	// 	// 		// if (curr.from === node.id) {
	// 	// 		// 	return prev + 3;
	// 	// 		// }
	// 	// 		// return prev;
	// 	// 		// }, 15),
	// 	// 		size: 1,
	// 	// 		color: "#335996"
	// 	// 	}
	// 	// );

	// 	// graph.addNode("Jessica", { label: "Jessica2", x: 1, y: 1, color: "#FF0", size: 10 });
	// 	// graph.addNode("Truman", { label: "Truman", x: 0, y: 0, color: "#00F", size: 5 });
	// 	// graph.addEdge("Jessica", "Truman", { color: "#CCC", size: 1 });

	// 	return <></>;
	//   };
	  
	  // Put your component as a child of `SigmaContainer`
	//   ReactDOM.render(
	// 	<React.StrictMode>
	// 	  <SigmaContainer style={{ height: "500px", width: "500px" }}>
	// 		<MyCustomGraph />
	// 	  </SigmaContainer>
	// 	</React.StrictMode>,
	// 	document.getElementById("root"),
	//   );

  return (
	<div id="app">
		<SigmaContainer style={{ height: "100vh", width: "100%" }}>
			<MyCustomGraph />
		  </SigmaContainer>
	</div>
  );
}

export default App;
