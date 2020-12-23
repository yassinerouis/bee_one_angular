import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ParcelleCulturaleService {
  url="http://agridata.hopto.org:9010/agridata-lga-backend/api";
  constructor(private http:HttpClient) {
  }
   getParcelleCulturale(){
     return this.http.get(this.url+'/get_parcelle_cultural')
   }
   getTypeProduit(id_parcelle){
      return this.http.get('http://localhost:9010/agridata-lga-backend/api/list_produit_rendement/getProductForParcelle/'+id_parcelle)
   }
}
