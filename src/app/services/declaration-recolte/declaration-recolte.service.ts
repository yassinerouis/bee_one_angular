import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeclarationRecolteService {

  url="http://localhost:9010/agridata-lga-backend/api/declatationRecolte/";

  constructor(private http:HttpClient) {
   }
   getDeclarationRecolte(){
     return this.http.get(this.url+'getDeclarationsRecolte')
   }
   addDeclarationRecolte(declaration){
      return this.http.post(this.url+"createDeclarationRecolte",declaration)
   }
}
