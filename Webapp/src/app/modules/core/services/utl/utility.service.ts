import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  private dlist: any = [];
  private messageSource = new BehaviorSubject(this.dlist);
  currentMessage = this.messageSource.asObservable();

  private responseSource = new BehaviorSubject(this.dlist);
  passMessage = this.responseSource.asObservable();

  // contra entry
  private contraList: any = [];
  private contraSet = new BehaviorSubject(this.contraList);
  contraListSet = this.contraSet.asObservable();

  private contraGet = new BehaviorSubject(this.contraList);
  contraListGet = this.contraGet.asObservable();

 

  constructor(
    private storageService: StorageService,
    private httpClient: HttpClient,
    // private alertService: AlertService
  ) {}

 

  getFomatteDate(dateValue: any): any {
    if (dateValue == undefined) {
      return new Date();
    }
    var serverdateformat = 'MM/dd/yyyy';
    if (serverdateformat == 'MM/dd/yyyy') {
      if (
        isNaN(Date.parse(dateValue)) ||
        dateValue.length <= 10 ||
        dateValue.length >= 8
      ) {
        return dateValue.replace(/^(\d{1,2}\/)(\d{1,2}\/)(\d{4})$/, '$2$1$3');
      } else
        return (
          dateValue.getMonth() +
          1 +
          '/' +
          dateValue.getDate() +
          '/' +
          dateValue.getFullYear()
        );
    } else {
      if (
        isNaN(Date.parse(dateValue)) ||
        dateValue.length <= 10 ||
        dateValue.length >= 8
      ) {
        return dateValue.replace(/^(\d{1,2}\/)(\d{1,2}\/)(\d{4})$/, '$2$1$3');
      } else
        return (
          dateValue.getDate() +
          '/' +
          (dateValue.getMonth() + 1) +
          '/' +
          dateValue.getFullYear()
        );
    }
  }


  handleKeyDown(event: any, func1: any, func2: any): boolean {
    var key = event.charCode
      ? event.charCode
      : event.keyCode
      ? event.keyCode
      : 0;
    if (key == 45) {
      func1();
      return true;
    } else if (key == 46) {
      func2();
      return true;
    }
    return false;
  }

  getFirstDateOfCurrentMonth(): any {
    var d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }

  getFirstDateOfCurrentFinancial(): any {
    var d = new Date();
    var startYear;
    if (d.getMonth() + 1 <= 3) {
      startYear = d.getFullYear() - 1;
    } else {
      startYear = d.getFullYear();
    }
    return new Date(startYear, 3, 1);
  }

  getLastDateOfCurrentFinancial(): any {
    var d = new Date();
    var endYear;
    if (d.getMonth() + 1 <= 3) {
      endYear = d.getFullYear();
    } else {
      endYear = d.getFullYear() + 1;
    }
    return new Date(endYear, 2, 31);
  }

  getCurrentFinancialYear(): any {
    var d = new Date();
    var startYear;
    if (d.getMonth() + 1 <= 3) {
      startYear = d.getFullYear() - 1;
    } else {
      startYear = d.getFullYear();
    }
    let currentyear = startYear + ' - ' + (parseInt(startYear) + 1);
    return currentyear;
  }

  getCurrentFinancialMonths(): any {
    var d = new Date();
    var startYear;
    if (d.getMonth() + 1 <= 3) {
      startYear = d.getFullYear() - 1;
    } else {
      startYear = d.getFullYear();
    }
    startYear = parseInt(startYear.toString().slice(-2));
    let nextYear = startYear + 1;
    let list = [];
    list.push({ month: 'April - ' + startYear });
    list.push({ month: 'May - ' + startYear });
    list.push({ month: 'June - ' + startYear });
    list.push({ month: 'July - ' + startYear });
    list.push({ month: 'August - ' + startYear });
    list.push({ month: 'September - ' + startYear });
    list.push({ month: 'October - ' + startYear });
    list.push({ month: 'November - ' + startYear });
    list.push({ month: 'December - ' + startYear });
    list.push({ month: 'January - ' + nextYear });
    list.push({ month: 'February - ' + nextYear });
    list.push({ month: 'March - ' + nextYear });

    return list;
  }
  getDateByTerms(day: number) {
    if (day == 0 || day == undefined) return new Date();
    let currdate = new Date();
    return new Date(currdate.setDate(currdate.getDate() + day));
  }

  getDateByMonth(month: number) {
    let currDate = new Date();
    if (month == 0 || month == undefined || month == null) return currDate;
    var d = currDate.getDate();
    currDate.setMonth(currDate.getMonth() + +month);
    if (currDate.getDate() != d) {
      currDate.setDate(0);
    }
    return currDate;
  }

  getFinacialYearStratDate() {
    let currMonth = new Date().getMonth() + 1;
    let currYear;

    if (currMonth >= 4) {
      currYear = new Date().getFullYear();
    } else {
      currYear = new Date().getFullYear() - 1;
    }

    return new Date('04-01-' + currYear);
  }

  getFinacialYearEndDate() {
    let currMonth = new Date().getMonth() + 1;
    let currYear;

    if (currMonth >= 4) {
      currYear = new Date().getFullYear() + 1;
    } else {
      currYear = new Date().getFullYear();
    }

    return new Date('03-31-' + currYear);
  }
  numberWithCommas(x: Number) {
    if (x)
      return this.decimalRounding(x, 2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    else return '0.00';
    // const rx =  /(\d+)(\d{3})/;
    // return String(x).replace(/^\d+/, function (w) {
    //     var res = w;
    //     while (rx.test(res)) {
    //         res = res.replace(rx, '$1٬$2');
    //     }
    //     return res;
    // });
  }

  decimalRounding(value, digits) {
    if (digits == null) {
      digits = 2;
    }
    value = value * Math.pow(10, digits);
    value = Math.round(value);
    value = value / Math.pow(10, digits);
    return value.toFixed(digits);
  }

  getLastDateOfCurrentMonth(): any {
    var d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
  }
}
