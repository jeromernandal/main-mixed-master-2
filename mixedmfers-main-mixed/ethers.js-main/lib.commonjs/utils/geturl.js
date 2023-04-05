"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrl = void 0;
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const zlib_1 = require("zlib");
const errors_js_1 = require("./errors.js");
const data_js_1 = require("./data.js");
/**
 *  @_ignore:
 */
async function getUrl(req, signal) {
    const protocol = req.url.split(":")[0].toLowerCase();
    (0, errors_js_1.assert)(protocol === "http" || protocol === "https", `unsupported protocol ${protocol}`, "UNSUPPORTED_OPERATION", {
        info: { protocol },
        operation: "request"
    });
    (0, errors_js_1.assert)(protocol === "https" || !req.credentials || req.allowInsecureAuthentication, "insecure authorized connections unsupported", "UNSUPPORTED_OPERATION", {
        operation: "request"
    });
    const method = req.method;
    const headers = Object.assign({}, req.headers);
    const options = { method, headers };
    const request = ((protocol === "http") ? http_1.default : https_1.default).request(req.url, options);
    request.setTimeout(req.timeout);
    const body = req.body;
    if (body) {
        request.write(Buffer.from(body));
    }
    request.end();
    return new Promise((resolve, reject) => {
        // @TODO: Node 15 added AbortSignal; once we drop support for
        // Node14, we can add that in here too
        request.once("response", (resp) => {
            const statusCode = resp.statusCode || 0;
            const statusMessage = resp.statusMessage || "";
            const headers = Object.keys(resp.headers || {}).reduce((accum, name) => {
                let value = resp.headers[name] || "";
                if (Array.isArray(value)) {
                    value = value.join(", ");
                }
                accum[name] = value;
                return accum;
            }, {});
            let body = null;
            //resp.setEncoding("utf8");
            resp.on("data", (chunk) => {
                if (signal) {
                    try {
                        signal.checkSignal();
                    }
                    catch (error) {
                        return reject(error);
                    }
                }
                if (body == null) {
                    body = chunk;
                }
                else {
                    const newBody = new Uint8Array(body.length + chunk.length);
                    newBody.set(body, 0);
                    newBody.set(chunk, body.length);
                    body = newBody;
                }
            });
            resp.on("end", () => {
                if (headers["content-encoding"] === "gzip" && body) {
                    body = (0, data_js_1.getBytes)((0, zlib_1.gunzipSync)(body));
                }
                resolve({ statusCode, statusMessage, headers, body });
            });
            resp.on("error", (error) => {
                //@TODO: Should this just return nornal response with a server error?
                error.response = { statusCode, statusMessage, headers, body };
                reject(error);
            });
        });
        request.on("error", (error) => { reject(error); });
    });
}
exports.getUrl = getUrl;
//# sourceMappingURL=geturl.js.map