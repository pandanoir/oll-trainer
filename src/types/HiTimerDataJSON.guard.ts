/*
 * Generated type guards for "HiTimerDataJSON.ts".
 * WARNING: Do not manually change this file.
 */
import { isSessionCollection } from "../features/timer/data/timeData.guard";
import { HiTimerDataJSON } from "./HiTimerDataJSON";

export function isHiTimerDataJSON(obj: any, _argumentName?: string): obj is HiTimerDataJSON {
    return (
        (obj !== null &&
            typeof obj === "object" ||
            typeof obj === "function") &&
        isSessionCollection(obj.sessions) as boolean &&
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
            (e.scramble === "3x3" ||
                e.scramble === "2x2" ||
                e.scramble === "4x4")
        )
    )
}
