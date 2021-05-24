Object.defineProperty(exports, '__esModule', { value: true });

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var cors__default = /*#__PURE__*/_interopDefaultLegacy(cors);

const webhook = (hooks, PORT = 3010, debug = false) => {
    const log = (...arg) => {
        if (debug) {
            console.log("WEBHOOK 👉", ...arg);
        }
    };
    const app = express__default['default']();
    app.use(cors__default['default']());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    hooks.forEach((hook) => {
        const action = (req, res) => {
            log("EVENT", hook.path, hook.type ? hook.type : "GET");
            Promise.all([
                hook.action(req.body, req.params, req.query),
            ])
                .then(([response]) => {
                res.setHeader("X-Powered-By", "VOS Webhook");
                res.send(response);
            })
                .catch((err) => {
                console.error(err);
                res.setHeader("X-Powered-By", "VOS Webhook");
                res.send({
                    status: false,
                    msg: "hook failed",
                });
            });
        };
        switch (hook.type) {
            case undefined:
            case "GET":
                app.get(hook.path, action);
                break;
            default:
                app.post(hook.path, action);
                break;
        }
    });
    app.use((req, res) => {
        log("NOT FOUND", req.path);
        res.setHeader("X-Powered-By", "VOS Webhook");
        res.status(404).send({
            status: false,
            msg: "hook not found",
        });
    });
    app.listen(PORT, () => {
        log("Server started at", PORT);
    });
};

exports.default = webhook;
//# sourceMappingURL=index.js.map
