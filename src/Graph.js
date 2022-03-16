import { useEffect } from "react";
import {useSigma} from "react-sigma-v2";

function MyCustomGraph () {
	const sigma = useSigma();
	const graph = sigma.getGraph();

	useEffect(() => {
		graph.addNode("Jessica", { label: "Jessica2", x: 1, y: 1, color: "#FF0", size: 100 });
		graph.addNode("Truman", { label: "Truman", x: 0, y: 0, color: "#00F", size: 50 });
		graph.addEdge("Jessica", "Truman", { color: "#0f0f0f", size: 25, label: 'Connection', type: 'arrow' });
	}, [graph]);

	// return <></>;
	return <></>;
  };

  export default MyCustomGraph;