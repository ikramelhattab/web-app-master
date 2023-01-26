import { OnInit, NgZone, Sanitizer, SecurityContext } from '@angular/core';
import { AfterViewInit, Component, ViewChild } from '@angular/core';

import { Router, ActivatedRoute, Data } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { BackendService } from '../../services/backend.service';

import { ToolbarTitleService } from 'src/app/services/toolbar-title.service';


@Component({
  selector: 'app-perimeters',
  templateUrl: './frequenceContr.component.html',
  styleUrls: ['./frequenceContr.component.scss']
})

export class FreqContrComponent {

  isAdmin = false;
  horizon = null;
  freq0_100 = null;
  freq100_500 = null;
  freq500_1500 = null;
  freq1500 = null;
  id = '';

  constructor(
    private backendService: BackendService,
    private titleService: ToolbarTitleService,
  ) {
    this.titleService.changeTitle('Tarsio - Paramétres -Fréquence de Controle');
  }


  ngOnInit(): void {
    this.backendService.GetAllFreqContr().subscribe((res: any) => {
      this.horizon = res['horizon'];
      this.freq0_100 = res['_0_100euro'];
      this.freq100_500 = res['_100_500euro'];
      this.freq500_1500 = res['_500_1500euro'];
      this.freq1500 = res['_1500euro'];
      this.id = res['_id'];
    });
  }

  onHorizonChange(event: any) {
    this.backendService.updateFreqContr(this.id, this.freq0_100, this.freq100_500, this.freq500_1500, this.freq1500,
      this.horizon)
      .subscribe((updatedFreqCntr: any) => {
        if (updatedFreqCntr) {
          // Update successfully saved
        }
      }, (err) => {
        console.error(err);
        this.backendService.showErrorDialog('Une erreur inattendue est survenue', 'Veuillez réessayer ultérieurement.');
      });
  }

  on0To100Change(event: any) {
    this.backendService.updateFreqContr(this.id, this.freq0_100, this.freq100_500, this.freq500_1500, this.freq1500,
      this.horizon)
      .subscribe((updatedFreqCntr: any) => {
        if (updatedFreqCntr) {
          // Update successfully saved
        }
      }, (err) => {
        console.error(err);
        this.backendService.showErrorDialog('Une erreur inattendue est survenue', 'Veuillez réessayer ultérieurement.');
      });
  }

  on100To500Change(event: any) {
    this.backendService.updateFreqContr(this.id, this.freq0_100, this.freq100_500, this.freq500_1500, this.freq1500,
      this.horizon)
      .subscribe((updatedFreqCntr: any) => {
        if (updatedFreqCntr) {
          // Update successfully saved
        }
      }, (err) => {
        console.error(err);
        this.backendService.showErrorDialog('Une erreur inattendue est survenue', 'Veuillez réessayer ultérieurement.');
      });
  }

  on500To1500Change(event: any) {
    this.backendService.updateFreqContr(this.id, this.freq0_100, this.freq100_500, this.freq500_1500, this.freq1500,
      this.horizon)
      .subscribe((updatedFreqCntr: any) => {
        if (updatedFreqCntr) {
          // Update successfully saved
        }
      }, (err) => {
        console.error(err);
        this.backendService.showErrorDialog('Une erreur inattendue est survenue', 'Veuillez réessayer ultérieurement.');
      });
  }

  onSup1500Change(event: any) {
    this.backendService.updateFreqContr(this.id, this.freq0_100, this.freq100_500, this.freq500_1500, this.freq1500,
      this.horizon)
      .subscribe((updatedFreqCntr: any) => {
        if (updatedFreqCntr) {
          // Update successfully saved
        }
      }, (err) => {
        console.error(err);
        this.backendService.showErrorDialog('Une erreur inattendue est survenue', 'Veuillez réessayer ultérieurement.');
      });
  }

}
