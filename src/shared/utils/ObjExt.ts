
import * as _ from "lodash";

const ObjExt = {
    IsNullOrUndefined: (object: unknown) => {
        return object === undefined || object === null;
    },
    IsFuncAndDefined: (object: any) => {
        return !ObjExt.IsNullOrUndefined(object) && typeof object === 'function';
    },
    IsString: (object: unknown) => {
        return typeof object === 'string';
    },
    IsNotStringOrEmpty: (object: any) => {
        return typeof object !== 'string' || object === '';
    },
    IsFunc: (object: unknown) => {
        return typeof object === 'function';
    },
    IsDefinedFunc: (object: unknown) => {
        return !ObjExt.IsNullOrUndefined(object) && typeof object === 'function';
    },
    IsArray: (object: unknown) => {
        return Array.isArray(object);
    },
    IsNotArrayOrEmpty: (object: unknown) => {
        return ObjExt.IsNullOrUndefined(object) || !Array.isArray(object) || object.length === 0;
    },
    IsStringEmpty: (str: unknown) => {
        return (typeof str === 'string' || str instanceof String) && str.trim() === '';
    },
    ContainsById: (arrayObj: any[], id: any) => {
        if (ObjExt.IsNullOrUndefined(arrayObj) || ObjExt.IsNotArrayOrEmpty(arrayObj)) {
            return false;
        }
        const index = arrayObj.findIndex((obj: any) => {
            return obj.id === id
        })

        return index !== -1;
    },
    RemoveById: (arrayObj: any[], id: any) => {
        if (ObjExt.IsNullOrUndefined(arrayObj) || ObjExt.IsNotArrayOrEmpty(arrayObj)) {
            return arrayObj;
        }
        const newArrayObj = arrayObj.slice();
        _.remove(newArrayObj, q => q.id === id);
        return newArrayObj;
    },
    HtmlToText: (html: string) => {
        html = html.replace(/<style([\s\S]*?)<\/style>/gi, '');
        html = html.replace(/<script([\s\S]*?)<\/script>/gi, '');
        html = html.replace(/<\/div>/ig, '\n');
        html = html.replace(/<\/li>/ig, '\n');
        html = html.replace(/<li>/ig, '  *  ');
        html = html.replace(/<\/ul>/ig, '\n');
        html = html.replace(/<\/p>/ig, '\n');
        html = html.replace(/<br\s*[/]?>/gi, "\n");
        html = html.replace(/<[^>]+>/ig, '');
        return html;
    },
    SubString: (str: string, max: number) => {
        if (ObjExt.IsNullOrUndefined(str)) return '';
        if (str.length <= max) return str;
        return str.slice(0, max);
    },
    IsOnline: () => {
        return navigator.onLine;
    },
    StableSort: (array: any[], cmp: (arg0: any, arg1: any) => any) => {
        const stabilizedThis = array.map((el: any, index: any) => [el, index]);
        stabilizedThis.sort((a: number[], b: number[]) => {
            const order = cmp(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el: any[]) => el[0]);
    },
    GetSorting: (order: string, orderBy: any) => {
        return order === 'desc' ? (a: any, b: any) => ObjExt.Desc(a, b, orderBy) : (a: any, b: any) => -ObjExt.Desc(a, b, orderBy);
    },
    Desc: (a: { [x: string]: number; }, b: { [x: string]: number; }, orderBy: string | number) => {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    },
    EvaluateExpresion : (textToEval: string, objectEval: any, delimiterBefor: string, delimiterAfter: string) => {
        let _delimiterBfr = delimiterBefor || '[';
        let _delimiterAft = delimiterAfter || '[';
        if(ObjExt.IsNullOrUndefined(textToEval))
            return '';
        if(ObjExt.IsNullOrUndefined(objectEval))
            return textToEval;

        let resultTest = '';
        textToEval.split(_delimiterBfr).forEach((text: string) => {
            let temp = text.split(_delimiterAft);
            let prop = (temp[0]).charAt(0).toLowerCase() + (temp[0]).slice(1);
            if(temp.length >= 1 && prop in objectEval){
                resultTest += objectEval[prop];
                temp.shift();
            }
            resultTest += temp.join(_delimiterAft);
        });

        return resultTest;
    }
}
export default ObjExt;
export const ObjExtUtils = ObjExt;