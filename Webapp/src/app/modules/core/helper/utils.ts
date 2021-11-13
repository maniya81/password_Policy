import { HttpErrorResponse } from "@angular/common/http";

export class Utils {
    public static formatError(error: HttpErrorResponse): string {
        console.log(error);
        if (error.error instanceof ErrorEvent) {
            return 'Error: ' + error.error.message;
        } else {
            let msg = "Oops! Something went wrong, please try again!";
            if (error.error && typeof error.error === 'string') {
                msg = <string>error.error;
            }
            else if (error && error.error && error.error.message) {
                msg = error.error.message;
            }
            return msg;
        }
    }

    public static formatString(str: string, ...val: string[]) {        
        if (str) {
            for (let index = 0; index < val.length; index++) {
                str = str.replace(`{${index}}`, val[index]);
            }
        }
        else {
            //str = "Oops! Something went wrong, please try again!";
        }
        return str;
    }
    
    public static formatArrayString(str: string, val: string[]) {
        if (str) {
            for (let index = 0; index < val.length; index++) {
                str = str.replace(`{${index}}`, val[index]);
            }
        }
        else {
            //str = "Oops! Something went wrong, please try again!";
        }
        return str;
    }
}
