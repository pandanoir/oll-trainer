/*
 * Generated type guards for "CsTimerSessionData.ts".
 * WARNING: Do not manually change this file.
 */
import { CsTimerSessionData } from "./CsTimerSessionData";

export function isCsTimerSessionData(obj: any, _argumentName?: string): obj is CsTimerSessionData {
    return (
        (obj !== null &&
            typeof obj === "object" ||
            typeof obj === "function") &&
        (typeof obj.name === "string" ||
            typeof obj.name === "number") &&
        typeof obj.rank === "number" &&
        (typeof obj.date === "undefined" ||
            typeof obj.date === "object") &&
        (obj.opt !== null &&
            typeof obj.opt === "object" ||
            typeof obj.opt === "function") &&
        (typeof obj.opt.scrType === "undefined" ||
            typeof obj.opt.scrType === "string")
    )
}
