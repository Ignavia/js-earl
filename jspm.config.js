SystemJS.config({
    packageConfigPaths: [
        "npm:@*/*.json",
        "npm:*.json",
        "github:*/*.json"
    ],
    globalEvaluationScope: false,
    transpiler: "plugin-babel",

    map: {
        "@ignavia/util": "npm:@ignavia/util@1.1.5",
        "assert": "github:jspm/nodelibs-assert@0.2.0-alpha",
        "buffer": "github:jspm/nodelibs-buffer@0.2.0-alpha",
        "chai": "npm:chai@3.5.0",
        "child_process": "github:jspm/nodelibs-child_process@0.2.0-alpha",
        "clean-css": "npm:clean-css@3.4.9",
        "core-js": "npm:core-js@2.0.3",
        "events": "github:jspm/nodelibs-events@0.2.0-alpha",
        "fs": "github:jspm/nodelibs-fs@0.2.0-alpha",
        "http": "github:jspm/nodelibs-http@0.2.0-alpha",
        "https": "github:jspm/nodelibs-https@0.2.0-alpha",
        "mocha": "npm:mocha@2.4.5",
        "module": "github:jspm/nodelibs-module@0.2.0-alpha",
        "net": "github:jspm/nodelibs-net@0.2.0-alpha",
        "os": "github:jspm/nodelibs-os@0.2.0-alpha",
        "path": "github:jspm/nodelibs-path@0.2.0-alpha",
        "plugin-babel": "npm:systemjs-plugin-babel@0.0.2",
        "process": "github:jspm/nodelibs-process@0.2.0-alpha",
        "stream": "github:jspm/nodelibs-stream@0.2.0-alpha",
        "tty": "github:jspm/nodelibs-tty@0.2.0-alpha",
        "url": "github:jspm/nodelibs-url@0.2.0-alpha",
        "util": "github:jspm/nodelibs-util@0.2.0-alpha"
    },

    packages: {
        "@ignavia/earl": {
            "main": "earl.js",
            "format": "esm",
            "defaultExtension": "js"
        },
        "github:jspm/nodelibs-buffer@0.2.0-alpha": {
            "map": {
                "buffer-browserify": "npm:buffer@4.4.0"
            }
        },
        "github:jspm/nodelibs-http@0.2.0-alpha": {
            "map": {
                "http-browserify": "npm:stream-http@2.1.0"
            }
        },
        "github:jspm/nodelibs-os@0.2.0-alpha": {
            "map": {
                "os-browserify": "npm:os-browserify@0.2.0"
            }
        },
        "github:jspm/nodelibs-stream@0.2.0-alpha": {
            "map": {
                "stream-browserify": "npm:stream-browserify@2.0.1"
            }
        },
        "github:jspm/nodelibs-url@0.2.0-alpha": {
            "map": {
                "url-browserify": "npm:url@0.11.0"
            }
        },
        "npm:buffer@4.4.0": {
            "map": {
                "base64-js": "npm:base64-js@1.0.2",
                "ieee754": "npm:ieee754@1.1.6",
                "isarray": "npm:isarray@1.0.0"
            }
        },
        "npm:chai@3.5.0": {
            "map": {
                "assertion-error": "npm:assertion-error@1.0.1",
                "deep-eql": "npm:deep-eql@0.1.3",
                "type-detect": "npm:type-detect@1.0.0"
            }
        },
        "npm:clean-css@3.4.9": {
            "map": {
                "commander": "npm:commander@2.8.1",
                "source-map": "npm:source-map@0.4.4"
            }
        },
        "npm:commander@2.8.1": {
            "map": {
                "graceful-readlink": "npm:graceful-readlink@1.0.1"
            }
        },
        "npm:deep-eql@0.1.3": {
            "map": {
                "type-detect": "npm:type-detect@0.1.1"
            }
        },
        "npm:mocha@2.4.5": {
            "map": {
                "css": "github:systemjs/plugin-css@0.1.20"
            }
        },
        "npm:readable-stream@2.0.5": {
            "map": {
                "core-util-is": "npm:core-util-is@1.0.2",
                "inherits": "npm:inherits@2.0.1",
                "isarray": "npm:isarray@0.0.1",
                "process-nextick-args": "npm:process-nextick-args@1.0.6",
                "string_decoder": "npm:string_decoder@0.10.31",
                "util-deprecate": "npm:util-deprecate@1.0.2"
            }
        },
        "npm:source-map@0.4.4": {
            "map": {
                "amdefine": "npm:amdefine@1.0.0"
            }
        },
        "npm:stream-browserify@2.0.1": {
            "map": {
                "inherits": "npm:inherits@2.0.1",
                "readable-stream": "npm:readable-stream@2.0.5"
            }
        },
        "npm:stream-http@2.1.0": {
            "map": {
                "builtin-status-codes": "npm:builtin-status-codes@1.0.0",
                "inherits": "npm:inherits@2.0.1",
                "to-arraybuffer": "npm:to-arraybuffer@1.0.1",
                "xtend": "npm:xtend@4.0.1"
            }
        },
        "npm:url@0.11.0": {
            "map": {
                "punycode": "npm:punycode@1.3.2",
                "querystring": "npm:querystring@0.2.0"
            }
        }
    }
});