import "core-js"; // TODO remove once no longer needed

import mocha from "mocha";

import graph   from "./graph.js";
import node    from "./node.js";
import edge    from "./edge.js";
import path    from"./path.js";
//import plugins from "./plugins/plugins.js";

mocha.setup("bdd");

graph();
node();
edge();
path();
//plugins();

mocha.run();