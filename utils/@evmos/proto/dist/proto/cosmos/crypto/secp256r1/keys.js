"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cosmos = void 0;
const pb_1 = __importStar(require("google-protobuf"));
var cosmos;
(function (cosmos) {
    var crypto;
    (function (crypto) {
        var secp256r1;
        (function (secp256r1) {
            class PubKey extends pb_1.Message {
                constructor(data) {
                    super();
                    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], []);
                    if (!Array.isArray(data) && typeof data == "object") {
                        if ("key" in data && data.key != undefined) {
                            this.key = data.key;
                        }
                    }
                }
                get key() {
                    return pb_1.Message.getField(this, 1);
                }
                set key(value) {
                    pb_1.Message.setField(this, 1, value);
                }
                static fromObject(data) {
                    const message = new PubKey({});
                    if (data.key != null) {
                        message.key = data.key;
                    }
                    return message;
                }
                toObject() {
                    const data = {};
                    if (this.key != null) {
                        data.key = this.key;
                    }
                    return data;
                }
                serialize(w) {
                    const writer = w || new pb_1.BinaryWriter();
                    if (this.key !== undefined)
                        writer.writeBytes(1, this.key);
                    if (!w)
                        return writer.getResultBuffer();
                }
                static deserialize(bytes) {
                    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new PubKey();
                    while (reader.nextField()) {
                        if (reader.isEndGroup())
                            break;
                        switch (reader.getFieldNumber()) {
                            case 1:
                                message.key = reader.readBytes();
                                break;
                            default: reader.skipField();
                        }
                    }
                    return message;
                }
                serializeBinary() {
                    return this.serialize();
                }
                static deserializeBinary(bytes) {
                    return PubKey.deserialize(bytes);
                }
            }
            secp256r1.PubKey = PubKey;
            class PrivKey extends pb_1.Message {
                constructor(data) {
                    super();
                    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], []);
                    if (!Array.isArray(data) && typeof data == "object") {
                        if ("secret" in data && data.secret != undefined) {
                            this.secret = data.secret;
                        }
                    }
                }
                get secret() {
                    return pb_1.Message.getField(this, 1);
                }
                set secret(value) {
                    pb_1.Message.setField(this, 1, value);
                }
                static fromObject(data) {
                    const message = new PrivKey({});
                    if (data.secret != null) {
                        message.secret = data.secret;
                    }
                    return message;
                }
                toObject() {
                    const data = {};
                    if (this.secret != null) {
                        data.secret = this.secret;
                    }
                    return data;
                }
                serialize(w) {
                    const writer = w || new pb_1.BinaryWriter();
                    if (this.secret !== undefined)
                        writer.writeBytes(1, this.secret);
                    if (!w)
                        return writer.getResultBuffer();
                }
                static deserialize(bytes) {
                    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new PrivKey();
                    while (reader.nextField()) {
                        if (reader.isEndGroup())
                            break;
                        switch (reader.getFieldNumber()) {
                            case 1:
                                message.secret = reader.readBytes();
                                break;
                            default: reader.skipField();
                        }
                    }
                    return message;
                }
                serializeBinary() {
                    return this.serialize();
                }
                static deserializeBinary(bytes) {
                    return PrivKey.deserialize(bytes);
                }
            }
            secp256r1.PrivKey = PrivKey;
        })(secp256r1 = crypto.secp256r1 || (crypto.secp256r1 = {}));
    })(crypto = cosmos.crypto || (cosmos.crypto = {}));
})(cosmos = exports.cosmos || (exports.cosmos = {}));
//# sourceMappingURL=keys.js.map