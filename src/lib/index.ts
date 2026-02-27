// place files you want to import through the `$lib` alias in this folder.

import { decompressRTF } from "@kenjiuno/decompressrtf";
import { MsgReader, type FieldsData } from "@kenjiuno/msgreader-web-ng";

export function parseMsg(file: File, ansiEncoding: string, includeRawProps: boolean): Promise<FieldsData> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("load", (e) => {
            const arrayBuffer = e && e.target && e.target.result; // as ArrayBuffer
            if (arrayBuffer instanceof ArrayBuffer) {
                try {
                    const testMsg = new MsgReader(arrayBuffer);
                    testMsg.parserConfig = {
                        ansiEncoding: ansiEncoding,
                        includeRawProps: includeRawProps,
                    };
                    const testMsgInfo = testMsg.getFileData();
                    const testMsgInfoRtfDecoded = recoverCompressedRtf(testMsgInfo);
                    resolve(testMsgInfoRtfDecoded);
                } catch (e) {
                    reject(e);
                }
            }
        });
        reader.readAsArrayBuffer(file);
    });
}

function recoverCompressedRtf(msg: FieldsData): FieldsData {
    const attachments = msg.attachments ? msg.attachments.map(
        sub => {
            const newSub = Object.assign({}, sub);
            const { innerMsgContentFields } = newSub;
            if (innerMsgContentFields) {
                newSub.innerMsgContentFields = recoverCompressedRtf(innerMsgContentFields);
            }
            return newSub;
        }
    ) : undefined;

    const newMsg = Object.assign({}, msg);
    if (newMsg.compressedRtf !== undefined) {
        Object.defineProperty(newMsg, "rtf", {
            value: new TextDecoder("latin1").decode(
                new Uint8Array(
                    decompressRTF(Array.from(newMsg.compressedRtf))
                )
            ),
        });
        delete newMsg.compressedRtf;
    }
    if (attachments !== undefined) {
        newMsg.attachments = attachments;
    }
    return newMsg;
}