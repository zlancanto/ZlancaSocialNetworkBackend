import {escapeRegex} from "../utils/regex.utils";
import {SPECIAL_CHARS} from "./char.variable";

export const REGEX_PASSWORD = new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[${escapeRegex(SPECIAL_CHARS)}])[A-Za-z\\d${escapeRegex(SPECIAL_CHARS)}]{12,}$`)