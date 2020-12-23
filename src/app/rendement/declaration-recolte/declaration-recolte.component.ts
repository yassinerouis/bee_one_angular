import { DeclarationRecolteService } from './../../services/declaration-recolte/declaration-recolte.service';
import { ParcelleCulturaleService } from './../../services/parcelle-culturale/parcelle-culturale.service';
import { Component, OnInit } from '@angular/core';
import { Customer, Representative } from "./customer";
import { CustomerService } from "./customerservice";
import { MessageService } from "primeng/api";
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { ExportService } from 'src/app/services/export/export.service';

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

  form=false;
  constructor(private messageService: MessageService,private customerService: CustomerService,private exportService:ExportService,
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
    console.log(declarationRecolte)
    this.declarationRecolteService.addDeclarationRecolte(declarationRecolte).subscribe(res=>{
      console.log(res)
    })

  }
declarations:any
  ngOnInit() {
    this.declarationRecolteService.getDeclarationRecolte().subscribe(res=>{
      this.declarations=res
    })
    
    //recuperer les parcelles culturales
    this.parcelleCulturaleService.getParcelleCulturale().subscribe(res=>{
      for(var i=0;i<res['length'];i++){
        this.listParcelles[i]={label:res[i].Ref,value:res[i].ID}
      }
    })
    this.customerService.getCustomersLarge().then(customers => {
      this.customers = customers;
      this.loading = false;
      this.customers.forEach(
        customer => (customer.date = new Date(customer.date))
      );
    });
    //recuperer les donnees de la table
    this.representatives = [
      { name: "Amy Elsner", image: "amyelsner.png" },
      { name: "Anna Fali", image: "annafali.png" },
      { name: "Asiya Javayant", image: "asiyajavayant.png" },
      { name: "Bernardo Dominic", image: "bernardodominic.png" },
      { name: "Elwin Sharvill", image: "elwinsharvill.png" },
      { name: "Ioni Bowcher", image: "ionibowcher.png" },
      { name: "Ivan Magalhaes", image: "ivanmagalhaes.png" },
      { name: "Onyama Limba", image: "onyamalimba.png" },
      { name: "Stephen Shaw", image: "stephenshaw.png" },
      { name: "XuXue Feng", image: "xuxuefeng.png" }
    ];

    this.statuses = [
      { label: "Unqualified", value: "unqualified" },
      { label: "Qualified", value: "qualified" },
      { label: "New", value: "new" },
      { label: "Negotiation", value: "negotiation" },
      { label: "Renewal", value: "renewal" },
      { label: "Proposal", value: "proposal" }
    ];
    //this.exportExcel()
    //this.exportPdf()
  }
  edit(id){
    console.log(id)
  }
  delete(id){
    console.log(id)
  }
  //lors du changement de la parcelle il recupère et affiche le type du produit
  onChange(e){
    this.parcelleCulturaleService.getTypeProduit(e.value).subscribe(res=>{
      if(res[0]){
        this.parcelles[this.parcelles.length-1].type=res[0].designation
      }else{
        this.parcelles[this.parcelles.length-1].type="Cette parcelle n\' a aucun type de produit"
      }
    })
  }
    // Debut exportations
  exportPdf() {
    let columns=[
      { header: 'Date de récolte', dataKey: 'DateRecolte'},
      { header: 'Parcelle', dataKey: 'Ref' },
      { header: 'Type du produit', dataKey: 'designation' },
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
      { header: 'Parcelle', dataKey: 'Ref' },
      { header: 'Type du produit', dataKey: 'designation' },
      { header: 'Récolte MO', dataKey: 'RecolteMO' },
      { header: 'Récolte hors MO', dataKey: 'RecolteHorsMO' },
      { header: 'Vente sur pieds', dataKey: 'VentePieds' },
      { header: 'Quantité totale', dataKey: 'QteTotale' }
    ]
    this.exportService.setTable(this.declarations)
    this.exportService.printPdf(columns)
  }
  exportExcel() {
    this.exportService.exportExcel('declarationsRecolte')
  }
    // Fin exportations


  calculTotal(parcelle){
    let i = this.parcelles.indexOf(parcelle)
    console.log(this.parcelles[i].RecolteMO)
    this.parcelles[i].QteTotale = this.parcelles[i].RecolteMO + this.parcelles[i].RecolteHorsMO + this.parcelles[i].VentePieds
  }
//Ajouter un nouveau element à la table si l'element courant est valide
  addItem(){
    if(this.parcelles[this.parcelles.length-1].RecolteMO||this.parcelles[this.parcelles.length-1].Solde||
      this.parcelles[this.parcelles.length-1].RecolteHorsMO||this.parcelles[this.parcelles.length-1].Solde){
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
      this.messageService.add({severity:'error', summary:'Veuillez renseigner', detail:'tous les champs obligatoires'});
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
