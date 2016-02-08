import mocha from "mocha";

import graph from "./graph.js";
import node  from "./node.js";
import edge  from "./edge.js";
import path  from"./path.js";

mocha.setup("bdd");

graph();
node();
edge();
path();

mocha.run();