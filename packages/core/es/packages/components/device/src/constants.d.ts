import type { Regexes } from './types';
export declare const LIBVERSION = "0.7.31", EMPTY = "", UNKNOWN = "?", FUNC_TYPE = "function", UNDEF_TYPE = "undefined", OBJ_TYPE = "object", STR_TYPE = "string", MAJOR = "major", MODEL = "model", NAME = "name", TYPE = "type", VENDOR = "vendor", VERSION = "version", ARCHITECTURE = "architecture", CONSOLE = "console", MOBILE = "mobile", TABLET = "tablet", SMARTTV = "smarttv", WEARABLE = "wearable", EMBEDDED = "embedded", UA_MAX_LENGTH = 275;
export declare const AMAZON = "Amazon", APPLE = "Apple", ASUS = "ASUS", BLACKBERRY = "BlackBerry", BROWSER = "Browser", CHROME = "Chrome", EDGE = "Edge", FIREFOX = "Firefox", GOOGLE = "Google", HUAWEI = "Huawei", LG = "LG", MICROSOFT = "Microsoft", MOTOROLA = "Motorola", OPERA = "Opera", SAMSUNG = "Samsung", SONY = "Sony", XIAOMI = "Xiaomi", ZEBRA = "Zebra", FACEBOOK = "Facebook";
export declare const oldSafariMap: {
    '1.0': string;
    1.2: string;
    1.3: string;
    '2.0': string;
    '2.0.2': string;
    '2.0.3': string;
    '2.0.4': string;
    '?': string;
};
export declare const windowsVersionMap: {
    ME: string;
    'NT 3.11': string;
    'NT 4.0': string;
    2000: string;
    XP: string[];
    Vista: string;
    7: string;
    8: string;
    8.1: string;
    10: string[];
    RT: string;
};
export declare const regexes: Regexes;
