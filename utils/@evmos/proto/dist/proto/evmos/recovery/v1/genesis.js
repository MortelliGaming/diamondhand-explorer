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
exports.evmos = void 0;
const dependency_2 = __importStar(require("./../../../google/protobuf/duration"));
const pb_1 = __importStar(require("google-protobuf"));
var evmos;
(function (evmos) {
    var recovery;
    (function (recovery) {
        var v1;
        (function (v1) {
            class GenesisState extends pb_1.Message {
                constructor(data) {
                    super();
                    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], []);
                    if (!Array.isArray(data) && typeof data == "object") {
                        if ("params" in data && data.params != undefined) {
                            this.params = data.params;
                        }
                    }
                }
                get params() {
                    return pb_1.Message.getWrapperField(this, Params, 1);
                }
                set params(value) {
                    pb_1.Message.setWrapperField(this, 1, value);
                }
                static fromObject(data) {
                    const message = new GenesisState({});
                    if (data.params != null) {
                        message.params = Params.fromObject(data.params);
                    }
                    return message;
                }
                toObject() {
                    const data = {};
                    if (this.params != null) {
                        data.params = this.params.toObject();
                    }
                    return data;
                }
                serialize(w) {
                    const writer = w || new pb_1.BinaryWriter();
                    if (this.params !== undefined)
                        writer.writeMessage(1, this.params, () => this.params.serialize(writer));
                    if (!w)
                        return writer.getResultBuffer();
                }
                static deserialize(bytes) {
                    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new GenesisState();
                    while (reader.nextField()) {
                        if (reader.isEndGroup())
                            break;
                        switch (reader.getFieldNumber()) {
                            case 1:
                                reader.readMessage(message.params, () => message.params = Params.deserialize(reader));
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
                    return GenesisState.deserialize(bytes);
                }
            }
            v1.GenesisState = GenesisState;
            class Params extends pb_1.Message {
                constructor(data) {
                    super();
                    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], []);
                    if (!Array.isArray(data) && typeof data == "object") {
                        if ("enable_recovery" in data && data.enable_recovery != undefined) {
                            this.enable_recovery = data.enable_recovery;
                        }
                        if ("packet_timeout_duration" in data && data.packet_timeout_duration != undefined) {
                            this.packet_timeout_duration = data.packet_timeout_duration;
                        }
                    }
                }
                get enable_recovery() {
                    return pb_1.Message.getField(this, 1);
                }
                set enable_recovery(value) {
                    pb_1.Message.setField(this, 1, value);
                }
                get packet_timeout_duration() {
                    return pb_1.Message.getWrapperField(this, dependency_2.google.protobuf.Duration, 2);
                }
                set packet_timeout_duration(value) {
                    pb_1.Message.setWrapperField(this, 2, value);
                }
                static fromObject(data) {
                    const message = new Params({});
                    if (data.enable_recovery != null) {
                        message.enable_recovery = data.enable_recovery;
                    }
                    if (data.packet_timeout_duration != null) {
                        message.packet_timeout_duration = dependency_2.google.protobuf.Duration.fromObject(data.packet_timeout_duration);
                    }
                    return message;
                }
                toObject() {
                    const data = {};
                    if (this.enable_recovery != null) {
                        data.enable_recovery = this.enable_recovery;
                    }
                    if (this.packet_timeout_duration != null) {
                        data.packet_timeout_duration = this.packet_timeout_duration.toObject();
                    }
                    return data;
                }
                serialize(w) {
                    const writer = w || new pb_1.BinaryWriter();
                    if (this.enable_recovery !== undefined)
                        writer.writeBool(1, this.enable_recovery);
                    if (this.packet_timeout_duration !== undefined)
                        writer.writeMessage(2, this.packet_timeout_duration, () => this.packet_timeout_duration.serialize(writer));
                    if (!w)
                        return writer.getResultBuffer();
                }
                static deserialize(bytes) {
                    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Params();
                    while (reader.nextField()) {
                        if (reader.isEndGroup())
                            break;
                        switch (reader.getFieldNumber()) {
                            case 1:
                                message.enable_recovery = reader.readBool();
                                break;
                            case 2:
                                reader.readMessage(message.packet_timeout_duration, () => message.packet_timeout_duration = dependency_2.google.protobuf.Duration.deserialize(reader));
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
                    return Params.deserialize(bytes);
                }
            }
            v1.Params = Params;
        })(v1 = recovery.v1 || (recovery.v1 = {}));
    })(recovery = evmos.recovery || (evmos.recovery = {}));
})(evmos = exports.evmos || (exports.evmos = {}));
//# sourceMappingURL=genesis.js.map