import * as $ from 'jquery';

const client_id = 'XYQDCGDJQGGFXE1U0Y1BDOYDSLRFLRCWYLNSYM1EIJVKPZGO';
const client_secret = 'HBZCOOVNKKFASCVIJUTB23ZYJZYEJDIPWXAIUVMUCZLDHMHT';
const v = '20170801';
const base_url = 'https://api.foursquare.com/v2/';

export function foursquare_details(foursquare_id: string): Promise<any> {
    const url = `${base_url}venues/${foursquare_id}?client_id=${client_id}&client_secret=${client_secret}&v=${v}`;
    return  Promise.resolve($.getJSON(url));
}
