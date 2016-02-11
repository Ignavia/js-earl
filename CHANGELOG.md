# Changelog

## 1.2.0 (2016-02-11)

Changed the interface of methods that took a single parameter or an iterable object. Those methods use rest parameters now. For example, the old way to add multiple nodes at once to a graph was `addNodes([n0, n1])`. Now you need to write `addNodes(n0, n1)` instead. In order to add nodes from an array or another iterable object you can use the spread operator: `addNodes(...[n0, n1])`.