import { NgModule } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatSidenavModule } from '@angular/material/sidenav'; 
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle'; 
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon'; 
import { MatAutocompleteModule } from '@angular/material/autocomplete'; 
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  exports:[
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatInputModule,
    MatExpansionModule,
    MatSelectModule,
    MatIconModule,
    MatAutocompleteModule,
    MatRippleModule
  ]
})
export class MaterialModule { }
