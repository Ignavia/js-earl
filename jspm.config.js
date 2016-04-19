SystemJS.config({
    transpiler: "plugin-babel",
    packages: {
        "@ignavia/earl": {
            "main": "earl.js",
            "format": "esm",
            "defaultExtension": "js",
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
        "@ignavia/util": "npm:@ignavia/util@1.3.2",
        "assert": "github:jspm/nodelibs-assert@0.2.0-alpha",
        "babel-plugin-transform-export-extensions": "npm:babel-plugin-transform-export-extensions@6.5.0",
        "babel-regenerator-runtime": "npm:babel-regenerator-runtime@6.5.0",
        "buffer": "github:jspm/nodelibs-buffer@0.2.0-alpha",
        "core-js": "npm:core-js@1.2.6",
        "events": "github:jspm/nodelibs-events@0.2.0-alpha",
        "fs": "github:jspm/nodelibs-fs@0.2.0-alpha",
        "net": "github:jspm/nodelibs-net@0.2.0-alpha",
        "os": "github:jspm/nodelibs-os@0.2.0-alpha",
        "path": "github:jspm/nodelibs-path@0.2.0-alpha",
        "plugin-babel": "npm:systemjs-plugin-babel@0.0.2",
        "process": "github:jspm/nodelibs-process@0.2.0-alpha",
        "stream": "github:jspm/nodelibs-stream@0.2.0-alpha",
        "tty": "github:jspm/nodelibs-tty@0.2.0-alpha",
        "util": "github:jspm/nodelibs-util@0.2.0-alpha",
        "vm": "github:jspm/nodelibs-vm@0.2.0-alpha"
    },
    packages: {
        "github:jspm/nodelibs-buffer@0.2.0-alpha": {
            "map": {
                "buffer-browserify": "npm:buffer@4.5.1"
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
        "npm:@ignavia/util@1.3.2": {
            "map": {
                "lodash": "npm:lodash@4.11.1"
            }
        },
        "npm:babel-plugin-syntax-export-extensions@6.5.0": {
            "map": {
                "babel-runtime": "npm:babel-runtime@5.8.38"
            }
        },
        "npm:babel-plugin-transform-export-extensions@6.5.0": {
            "map": {
                "babel-plugin-syntax-export-extensions": "npm:babel-plugin-syntax-export-extensions@6.5.0",
                "babel-runtime": "npm:babel-runtime@5.8.38"
            }
        },
        "npm:babel-runtime@5.8.38": {
            "map": {
                "core-js": "npm:core-js@1.2.6"
            }
        },
        "npm:buffer@4.5.1": {
            "map": {
                "base64-js": "npm:base64-js@1.1.2",
                "ieee754": "npm:ieee754@1.1.6",
                "isarray": "npm:isarray@1.0.0"
            }
        },
        "npm:falafel@1.2.0": {
            "map": {
                "acorn": "npm:acorn@1.2.2",
                "foreach": "npm:foreach@2.0.5",
                "isarray": "npm:isarray@0.0.1",
                "object-keys": "npm:object-keys@1.0.9"
            }
        },
        "npm:inline-process-browser@2.0.1": {
            "map": {
                "falafel": "npm:falafel@1.2.0",
                "through2": "npm:through2@0.6.5"
            }
        },
        "npm:readable-stream@1.0.34": {
            "map": {
                "core-util-is": "npm:core-util-is@1.0.2",
                "inherits": "npm:inherits@2.0.1",
                "isarray": "npm:isarray@0.0.1",
                "stream-browserify": "npm:stream-browserify@1.0.0",
                "string_decoder": "npm:string_decoder@0.10.31"
            }
        },
        "npm:readable-stream@2.1.0": {
            "map": {
                "core-util-is": "npm:core-util-is@1.0.2",
                "inherits": "npm:inherits@2.0.1",
                "inline-process-browser": "npm:inline-process-browser@2.0.1",
                "isarray": "npm:isarray@1.0.0",
                "process-nextick-args": "npm:process-nextick-args@1.0.6",
                "string_decoder": "npm:string_decoder@0.10.31",
                "unreachable-branch-transform": "npm:unreachable-branch-transform@0.5.1",
                "util-deprecate": "npm:util-deprecate@1.0.2"
            }
        },
        "npm:recast@0.11.5": {
            "map": {
                "ast-types": "npm:ast-types@0.8.16",
                "esprima": "npm:esprima@2.7.2",
                "private": "npm:private@0.1.6",
                "source-map": "npm:source-map@0.5.3"
            }
        },
        "npm:stream-browserify@1.0.0": {
            "map": {
                "inherits": "npm:inherits@2.0.1",
                "readable-stream": "npm:readable-stream@1.0.34"
            }
        },
        "npm:stream-browserify@2.0.1": {
            "map": {
                "inherits": "npm:inherits@2.0.1",
                "readable-stream": "npm:readable-stream@2.1.0"
            }
        },
        "npm:through2@0.6.5": {
            "map": {
                "readable-stream": "npm:readable-stream@1.0.34",
                "xtend": "npm:xtend@4.0.1"
            }
        },
        "npm:unreachable-branch-transform@0.5.1": {
            "map": {
                "esmangle-evaluator": "npm:esmangle-evaluator@1.0.0",
                "recast": "npm:recast@0.11.5"
            }
        }
    }
});