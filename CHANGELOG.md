# Changelog

## 1.2.2 (2016-02-15)

Observers of addNodes, addEdges, removeNodes and removeEdges events are now only notified when calls to the corresponding methods actually changed the graph. The call `addNodes()` without any arguments does no longer fire an event, for example.

## 1.2.1 (2016-02-11)

Now using the extended mixins of Extensible and Observable to an easier interface for clients. Refer to [@ignavia/util](https://github.com/Ignavia/js-util/blob/master/CHANGELOG.md#117-2016-02-11) for more information.

## 1.2.0 (2016-02-11)

Changed the interface of methods that took a single parameter or an iterable object. Those methods use rest parameters now. For example, the old way to add multiple nodes at once to a graph was `addNodes([n0, n1])`. Now you need to write `addNodes(n0, n1)` instead. In order to add nodes from an array or another iterable object you can use the spread operator: `addNodes(...[n0, n1])`.