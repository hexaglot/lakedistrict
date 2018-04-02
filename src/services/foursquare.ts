import * as $ from "jquery";

const CLIENT_ID = "XYQDCGDJQGGFXE1U0Y1BDOYDSLRFLRCWYLNSYM1EIJVKPZGO";
const CLIENT_SECRET = "HBZCOOVNKKFASCVIJUTB23ZYJZYEJDIPWXAIUVMUCZLDHMHT";
const v = "20170801";
const BASE_URL = "https://api.foursquare.com/v2/";

export function foursquare_details(foursquareId: string): Promise<any> {
    const url = `${BASE_URL}venues/${foursquareId}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${v}`;
    return  Promise.resolve($.getJSON(url));
}
