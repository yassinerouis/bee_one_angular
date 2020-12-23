import { DeclarationRecolteService } from './../../services/declaration-recolte/declaration-recolte.service';
import { ParcelleCulturaleService } from './../../services/parcelle-culturale/parcelle-culturale.service';
import { Component, OnInit } from '@angular/core';
import { Customer, Representative } from "./customer";
import { CustomerService } from "./customerservice";
import { MessageService } from "primeng/api";
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { ExportService } from 'src/app/services/export/export.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

 // Ce Component sert à la gestion de la declaration de la recolte

const doc = new jsPDF()
@Component({
  selector: 'app-declaration-recolte',
  templateUrl: './declaration-recolte.component.html',
  styleUrls: ['./declaration-recolte.component.scss'],
  providers: [MessageService]
})
export class DeclarationRecolteComponent implements OnInit {

  //declaration des variables 

  customers: Customer[];
  representatives: Representative[];
  statuses: any[];
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  currentDate = new Date()
  listParcelles=[]
  parcelles=[{
    id:1,
    ID_Parcelle_Culturale:null,
    type:null,
    Solde:null,
    RecolteMO:null,
    RecolteHorsMO:null,
    VentePieds:null,
    QteTotale:null
  }]
  msgs=[]
  declaration={date_recolte : new Date(),observations:null}
  synthetique = false
  form=false;
  constructor(public datepipe: DatePipe,private customerService: CustomerService,private exportService:ExportService,
    private declarationRecolteService:DeclarationRecolteService,private parcelleCulturaleService:ParcelleCulturaleService) {
  }

  save(){
    let declarationRecolte = {
      date_recolte:this.declaration.date_recolte,
      observations:this.declaration.observations,
      id_ferme:10002,
      createdBy:"null null",
      id_profil:1,
      parcels:this.parcelles
    }
    this.declarationRecolteService.addDeclarationRecolte(declarationRecolte).subscribe(res=>{
      if(res[0].message=="ajout reussi"){
        Swal.fire(
          'Ajout réussi',
          'La déclaration de la récolte est ajoutée avec succès',
          'success'
        )
        this.showForm()
        this.ngOnInit()
      }
    })
  }
  detailsDeclarations:any
  declarations:any
  ngOnInit() {
    this.declarationRecolteService.getDeclarationRecolte().subscribe(res=>{
      console.log(res)
      this.declarations=res
      this.loading = false;
    })
  this.declarationRecolteService.getDetailsDeclarationRecolte().subscribe(res=>{
      this.detailsDeclarations=res
      this.detailsDeclarations.forEach(element => {
        element.designation = element.designation==1?'Stockable':'Non Stockable'
        element.DateRecolte = new Date(element.DateRecolte)
      });
      this.loading = false;
    })
    //recuperer les parcelles culturales
    this.parcelleCulturaleService.getParcelleCulturale().subscribe(res=>{
      for(var i=0;i<res['length'];i++){
        this.listParcelles[i]={label:res[i].Ref,value:res[i].ID}
      }
    })
  }
  edit(id){
    console.log(id)
  }
  delete(id){
    Swal.fire({
      title: 'Valider la suppression',
      text: "Vous êtes sûrs que vous voulez supprimer cette déclaration de la récolte ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText:'Annuler',
      confirmButtonText: 'Oui'
    }).then((result) => {
      if (result.value) {
        this.declarationRecolteService.deleteDeclarationRecolte(id).subscribe(res=>{
          if(res[0].message=="ajout reussi"){
            Swal.fire(
              'Supprimée !',
              'La déclaration de la récolte est supprimée avec succès',
              'success'
            )
            this.ngOnInit()
          }
        })
      }
    })
  }
  //lors du changement de la parcelle il recupère et affiche le type du produit
  onChange(e){
    this.parcelleCulturaleService.getTypeProduit(e.value).subscribe(res=>{
      if(res[0]){
        this.parcelles[this.parcelles.length-1].type=res[0].designation?'Stockable':'Non stockable'
      }else{
        this.parcelles[this.parcelles.length-1].type="Cette parcelle n\' a aucun type de produit"
      }
    })
  }
    // Debut exportations
  exportPdf() {
    let columns=[
      { header: 'Date de récolte', dataKey: 'DateRecolte'},
      { header: 'Nombre de parcelles', dataKey: 'parcelles' },
      { header: 'Observations', dataKey: 'Observations' },
      { header: 'Récolte MO', dataKey: 'RecolteMO' },
      { header: 'Récolte hors MO', dataKey: 'RecolteHorsMO' },
      { header: 'Vente sur pieds', dataKey: 'VentePieds' },
      { header: 'Quantité totale', dataKey: 'QteTotale' }
    ]
    this.exportService.setTable(this.declarations)
    this.exportService.exportPdf(columns,'declarationsRecolte.pdf')
  }
  printPdf(){
    let columns=[
      { header: 'Date de récolte', dataKey: 'DateRecolte'},
      { header: 'Nombre de parcelles', dataKey: 'parcelles' },
      { header: 'Observations', dataKey: 'Observations' },
      { header: 'Récolte MO', dataKey: 'RecolteMO' },
      { header: 'Récolte hors MO', dataKey: 'RecolteHorsMO' },
      { header: 'Vente sur pieds', dataKey: 'VentePieds' },
      { header: 'Quantité totale', dataKey: 'QteTotale' }
    ]
    this.exportService.setTable(this.declarations)
    this.exportService.printPdf(columns)
  }
  exportExcel() {
    let table = []
    for(var i=0;i<this.declarations.length;i++){
      table[i]={
        'Date de récolte': this.datepipe.transform(this.declarations[i].DateRecolte, 'dd/MM/yyyy'),
        'Nombre de parcelles':this.declarations[i].parcelles,
        'Observations':this.declarations[i].Observations,
        'Récolte MO':this.declarations[i].RecolteMO,
        'Récolte hors MO': this.declarations[i].RecolteHorsMO,
        'Vente sur pieds': this.declarations[i].VentePieds,
        'Quantité totale': this.declarations[i].QteTotale 
      }
    }
    this.exportService.exportExcel('declarationsRecolte',table)
  }
  // Fin exportations
      // Debut exportations details
      exportDetailsPdf() {
        let columns=[
          { header: 'Date de récolte', dataKey: 'DateRecolte'},
          { header: 'Parcelle', dataKey: 'Ref' },
          { header: 'Type du produit', dataKey: 'designation' },
          { header: 'Récolte MO', dataKey: 'RecolteMO' },
          { header: 'Récolte hors MO', dataKey: 'RecolteHorsMO' },
          { header: 'Vente sur pieds', dataKey: 'VentePieds' },
          { header: 'Quantité totale', dataKey: 'QteTotale' }
        ]
        this.exportService.setTable(this.detailsDeclarations)
        this.exportService.exportPdf(columns,'detailsDeclarationsRecolte.pdf')
      }
      printDetailsPdf(){
        let columns=[
          { header: 'Date de récolte', dataKey: 'DateRecolte'},
          { header: 'Parcelle', dataKey: 'Ref' },
          { header: 'Type du produit', dataKey: 'designation' },
          { header: 'Récolte MO', dataKey: 'RecolteMO' },
          { header: 'Récolte hors MO', dataKey: 'RecolteHorsMO' },
          { header: 'Vente sur pieds', dataKey: 'VentePieds' },
          { header: 'Quantité totale', dataKey: 'QteTotale' }
        ]
        this.exportService.setTable(this.detailsDeclarations)
        this.exportService.printPdf(columns)
      }
      exportDetailsExcel() {
        let table = []
        for(var i=0;i<this.detailsDeclarations.length;i++){
          table[i]={
            'Date de récolte': this.datepipe.transform(this.detailsDeclarations[i].DateRecolte, 'dd/MM/yyyy'),
            'Parcelle': this.detailsDeclarations[i].Ref ,
            'Type du produit':this.detailsDeclarations[i].designation,
            'Récolte MO':this.detailsDeclarations[i].RecolteMO,
            'Récolte hors MO': this.detailsDeclarations[i].RecolteHorsMO,
            'Vente sur pieds': this.detailsDeclarations[i].VentePieds,
            'Quantité totale': this.detailsDeclarations[i].QteTotale 
          }
        }
        this.exportService.exportExcel('detailsDeclarationsRecolte',table)
      }
      showHideSynthetique(){
        this.synthetique=!this.synthetique
      }
  calculTotal(parcelle){
    let i = this.parcelles.indexOf(parcelle)
    console.log(this.parcelles[i].RecolteMO)
    this.parcelles[i].QteTotale = this.parcelles[i].RecolteMO + this.parcelles[i].RecolteHorsMO + this.parcelles[i].VentePieds
  }
  //Ajouter un nouveau element à la table si l'element courant est valide
  addItem(){
    if(this.parcelles[this.parcelles.length-1].RecolteMO&&this.parcelles[this.parcelles.length-1].Solde&&
      this.parcelles[this.parcelles.length-1].RecolteHorsMO&&this.parcelles[this.parcelles.length-1].Solde &&
      this.parcelles[this.parcelles.length-1].ID_Parcelle_Culturale){
      this.parcelles.push({
        id:this.parcelles.length+1,
        type:null,
        ID_Parcelle_Culturale:null,
        Solde:null,
        RecolteMO:null,
        RecolteHorsMO:null,
        VentePieds:null,
        QteTotale:null
      })
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Erreur...',
        text: 'Veuillez renseigner tous les champs obligatoires',
      }
      )
    }  
  }
  //supprimer un element de la table si il n'est pas le seul , si il est le seul on le vide
  removeItem(parcelle){
    console.log(this.parcelles.indexOf(parcelle))
    if(this.parcelles.length==1){
      this.parcelles[0]={
        id:this.parcelles.length,
        type:null,
        ID_Parcelle_Culturale:null,
        Solde:null,
        RecolteMO:null,
        RecolteHorsMO:null,
        VentePieds:null,
        QteTotale:null
      }
    }else{
      this.parcelles.splice(this.parcelles.indexOf(parcelle),1)
    }
  }

  //pour afficher et masquer le formulaire
  showForm(){
    this.form=!this.form
  }

}
