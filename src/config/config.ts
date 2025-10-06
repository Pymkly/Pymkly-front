import {isProd} from "../../etat.ts";
import {configLocal} from "../../config.local.ts";
import {configProd} from "../../config.prod.ts";

const configModule = isProd ? configProd : configLocal
export const config = configModule