import { City, DevexService, Employee, State } from './../../../core/services/devex/devex.service';
import { Component, OnInit } from '@angular/core';
import { createStore } from 'devextreme-aspnet-data-nojquery';

@Component({
  selector: 'app-dev-ex',
  templateUrl: './dev-ex.component.html',
  styleUrls: ['./dev-ex.component.css']
})
export class DevExComponent implements OnInit { 
  dataSource: Employee[];
  states: State[];
  cities: City[];
  remoteDataSource: any;
  constructor(private service: DevexService) {

    const serviceUrl: String = 'https://localhost:44348/api/employee';
    this.remoteDataSource = createStore({
        key: 'id',
        loadUrl: serviceUrl + '',
        insertUrl: serviceUrl + '',
        updateUrl: serviceUrl + '',
        deleteUrl: serviceUrl + ''
    });
      service.getEmployees().subscribe(x=>{
        this.dataSource = x;
      });
      this.states = service.getStates();
      this.cities = service.getCities();

      this.getFilteredCities = this.getFilteredCities.bind(this);
      
  }

  getFilteredCities(options) {
      return {
          store: this.cities,
          filter: options.data ? ["StateID", "=", options.data.stateID] : null
      };
  }

  onEditorPreparing(e) {
      
      if(e.parentType === "dataRow" && e.dataField === "CityID") {
          e.editorOptions.disabled = (typeof e.row.data.StateID !== "number");
      }
  }

  setStateValue(rowData: any, value: any): void {
      rowData.cityID = null;
      (<any>this).defaultSetCellValue(rowData, value);
  }
  ngOnInit(): void {
  }

}
