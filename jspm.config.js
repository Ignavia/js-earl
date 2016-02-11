SystemJS.config({
          "packageConfigPaths": [
                    "npm:@*/*.json",
                    "npm:*.json",
                    "github:*/*.json"
          ],
          "globalEvaluationScope": false,
          "transpiler": "plugin-babel",
          "map": {
                    "@ignavia/util": "npm:@ignavia/util@1.1.5",
                    "babel-regenerator-runtime": "npm:babel-regenerator-runtime@6.5.0",
                    fs: "github:jspm/nodelibs-fs@0.2.0-alpha",
                    path: "github:jspm/nodelibs-path@0.2.0-alpha",
                    "plugin-babel": "npm:systemjs-plugin-babel@0.0.2",
                    process: "github:jspm/nodelibs-process@0.2.0-alpha"
          },
          "packages": {
                    "@ignavia/earl": {
                              "main": "earl.js",
                              "format": "esm",
                              "defaultExtension": "js"
                    }
          }
});