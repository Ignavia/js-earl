SystemJS.config({
    paths: {
        "@ignavia/earl/": "src/"
    },
    devConfig: {
        "map": {
            "babel-plugin-transform-export-extensions": "npm:babel-plugin-transform-export-extensions@6.8.0",
            "plugin-babel": "npm:systemjs-plugin-babel@0.0.8"
        },
        "packages": {
            "npm:babel-plugin-transform-export-extensions@6.8.0": {
                "map": {
                    "babel-plugin-syntax-export-extensions": "npm:babel-plugin-syntax-export-extensions@6.8.0",
                    "babel-runtime": "npm:babel-runtime@6.9.2"
                }
            },
            "npm:babel-runtime@6.9.2": {
                "map": {
                    "core-js": "npm:core-js@2.4.0",
                    "regenerator-runtime": "npm:regenerator-runtime@0.9.5"
                }
            },
            "npm:babel-plugin-syntax-export-extensions@6.8.0": {
                "map": {
                    "babel-runtime": "npm:babel-runtime@6.9.2"
                }
            }
        }
    },
    transpiler: "plugin-babel",
    packages: {
        "@ignavia/earl": {
            "main": "index.js",
            "format": "esm",
            "meta": {
                "*js": {
                    "babelOptions": {
                        "plugins": [
                            "babel-plugin-transform-export-extensions"
                        ]
                    }
                }
            }
        }
    }
});

SystemJS.config({
    packageConfigPaths: [
        "npm:@*/*.json",
        "npm:*.json",
        "github:*/*.json"
    ],
    map: {
        "@ignavia/ella": "npm:@ignavia/ella@1.0.15",
        "@ignavia/util": "npm:@ignavia/util@1.3.3",
        "assert": "github:jspm/nodelibs-assert@0.2.0-alpha",
        "buffer": "github:jspm/nodelibs-buffer@0.2.0-alpha",
        "core-js": "npm:core-js@1.2.6",
        "events": "github:jspm/nodelibs-events@0.2.0-alpha",
        "fs": "github:jspm/nodelibs-fs@0.2.0-alpha",
        "lodash": "npm:lodash@4.13.1",
        "net": "github:jspm/nodelibs-net@0.2.0-alpha",
        "os": "github:jspm/nodelibs-os@0.2.0-alpha",
        "path": "github:jspm/nodelibs-path@0.2.0-alpha",
        "process": "github:jspm/nodelibs-process@0.2.0-alpha",
        "stream": "github:jspm/nodelibs-stream@0.2.0-alpha",
        "tty": "github:jspm/nodelibs-tty@0.2.0-alpha",
        "util": "github:jspm/nodelibs-util@0.2.0-alpha",
        "vm": "github:jspm/nodelibs-vm@0.2.0-alpha"
    },
    packages: {
        "github:jspm/nodelibs-buffer@0.2.0-alpha": {
            "map": {
                "buffer-browserify": "npm:buffer@4.6.0"
            }
        },
        "github:jspm/nodelibs-os@0.2.0-alpha": {
            "map": {
                "os-browserify": "npm:os-browserify@0.2.1"
            }
        },
        "github:jspm/nodelibs-stream@0.2.0-alpha": {
            "map": {
                "stream-browserify": "npm:stream-browserify@2.0.1"
            }
        },
        "npm:@ignavia/util@1.3.3": {
            "map": {
                "lodash": "npm:lodash@4.13.1"
            }
        },
        "npm:stream-browserify@2.0.1": {
            "map": {
                "inherits": "npm:inherits@2.0.1",
                "readable-stream": "npm:readable-stream@2.1.4"
            }
        },
        "npm:readable-stream@2.1.4": {
            "map": {
                "inherits": "npm:inherits@2.0.1",
                "buffer-shims": "npm:buffer-shims@1.0.0",
                "core-util-is": "npm:core-util-is@1.0.2",
                "process-nextick-args": "npm:process-nextick-args@1.0.7",
                "string_decoder": "npm:string_decoder@0.10.31",
                "util-deprecate": "npm:util-deprecate@1.0.2",
                "isarray": "npm:isarray@1.0.0"
            }
        },
        "npm:buffer@4.6.0": {
            "map": {
                "isarray": "npm:isarray@1.0.0",
                "base64-js": "npm:base64-js@1.1.2",
                "ieee754": "npm:ieee754@1.1.6"
            }
        }
    }
});