/*
 * Generated type guards for "HiTimerDataJSON.ts".
 * WARNING: Do not manually change this file.
 */
import { HiTimerDataJSON } from "./HiTimerDataJSON";

export function isHiTimerDataJSON(obj: any, _argumentName?: string): obj is HiTimerDataJSON {
    return (
        (obj !== null &&
            typeof obj === "object" ||
            typeof obj === "function") &&
        Array.isArray(obj.sessions) &&
        obj.sessions.every((e: any) =>
            (e !== null &&
                typeof e === "object" ||
                typeof e === "function") &&
            Array.isArray(e.sessions) &&
            e.sessions.every((e: any) =>
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                Array.isArray(e.times) &&
                e.times.every((e: any) =>
                    (e !== null &&
                        typeof e === "object" ||
                        typeof e === "function") &&
                    typeof e.time === "number" &&
                    (typeof e.penalty === "undefined" ||
                        e.penalty === false ||
                        e.penalty === true) &&
                    (typeof e.isDNF === "undefined" ||
                        e.isDNF === false ||
                        e.isDNF === true) &&
                    typeof e.scramble === "string" &&
                    typeof e.date === "number"
                ) &&
                typeof e.name === "string"
            ) &&
            typeof e.selectedSessionIndex === "number" &&
            (e.variation !== null &&
                typeof e.variation === "object" ||
                typeof e.variation === "function") &&
            typeof e.variation.name === "string" &&
            e.variation.scramble === "3x3"
        ) &&
        (obj.settings !== null &&
            typeof obj.settings === "object" ||
            typeof obj.settings === "function") &&
        typeof obj.settings.variation === "string" &&
        Array.isArray(obj.settings.userDefinedVariation) &&
        obj.settings.userDefinedVariation.every((e: any) =>
            (e !== null &&
                typeof e === "object" ||
                typeof e === "function") &&
            typeof e.name === "string" &&
            e.scramble === "3x3"
        )
    )
}
