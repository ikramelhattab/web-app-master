import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AfterViewInit, ViewChild } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { Observable, View } from 'ol';
import ImageLayer from 'ol/layer/Image';
import Map from 'ol/Map';
import Static from 'ol/source/ImageStatic';
import Projection from 'ol/proj/Projection';
import { getCenter, containsXY } from 'ol/extent';
import { Style } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Overlay from 'ol/Overlay';
import Icon from 'ol/style/Icon';
import Point from 'ol/geom/Point';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActionDialogComponent } from './action-dialog/action-dialog.component';
import { UserInfoService } from 'src/app/services/user-info.service';
import { MatTabGroup } from '@angular/material/tabs';
//import { BackendService } from '../../services/backend.service';
import { FullScreen, defaults as defaultControls } from 'ol/control';
import { Leak } from '../../../services/Leak';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { ToolbarTitleService } from 'src/app/services/toolbar-title.service';
import { forkJoin, Subject } from 'rxjs';
import { Booking } from 'src/app/services/Booking';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-booking-details',
  templateUrl: './reservation-details.component.html',
  styleUrls: ['./reservation-details.component.scss']
})
export class ReservationDetailsComponent implements OnInit {

  fromStr = '';
  toStr = '';
  createdOnStr = '';
  currentUid: string = '';
  isAdmin = false;

  loadingEvents = false;

  leaksList: Array<any> = [];
  refresh = new Subject<void>();


  public changeStatut: any;

  bookingId = '';



  bookings: Array<any> = [];
  booking?: Booking;
  markerData: any = {};

  @ViewChild('mapContainer', { static: false }) mapContainer: any;
  @ViewChild('mapPopup', { static: false }) mapPopup: any;

  @ViewChild('mapPopupHis', { static: false }) mapPopupHis: any;
  @ViewChild('mapPopupPoint', { static: false }) mapPopupPoint: any;

  @ViewChild('closePopup', { static: false }) closePopup: any;

  @ViewChild('closePopupPoint', { static: false }) closePopupPoint: any;

  @ViewChild('popupContent', { static: false }) popupContent: any;
  @ViewChild('popupContentHis', { static: false }) popupContentHis: any;

  @ViewChild('popupoverlayPoint', { static: false }) popupoverlayPoint: any;

  @ViewChild('popupReset', { static: false }) popupResetBtn: any;
  @ViewChild('folderInput', { static: false }) folderInput: any;
  @ViewChild('matTabGroup', { static: false }) matTabGroup: MatTabGroup | undefined;



  selectedHistoryIndex: number = -1;
  public leaksHistory: Array<any> = [];
  public leaks: Array<any> = [];
  public leak: any;


  public leakCoordList: Array<any> = [];
  public leakCoordFinalList: Array<any> = [];
  // Array to store csv data
  csvRowsArray: Array<any> = [];

  // Perimeters
  choosenPlan = '';
  plansList: Array<any> = [];
  planUrl = '';

  selectedRowIndex: number = -1;

  // Map object
  map: Map | undefined;

  loadingBookingDetails = true;
  // Extent of the map
  extent = [0, 0, 3409, 2380];

  // Projection of the map
  projection = new Projection({
    code: 'xkcd-image',
    units: 'pixels',
    extent: this.extent,
  });

  // Image layer for the plan
  imageLayer = new ImageLayer({
    source: new Static({
      attributions: '© <a href="https://xkcd.com/license.html">xkcd</a>',
      url: this.planUrl,
      projection: this.projection,
      imageExtent: this.extent
    })
  });



  // Vector layers for the leaks locations
  markerVectorLayer = new VectorLayer({
    source: new VectorSource,
    style: new Style({
      image: new Icon({
        anchor: [0.5, 0.9],
        scale: 0.7,
        src: 'assets/invalid-pin.png'
      })
    })
  });



  // Popup overlay for the new missions
  overlay: Overlay | undefined


  uploadingMissionFolder = false;
  public actRealization = false;
  public cloture = false;

  // For pagination
  page: number = 1;
  total: number = 0;
  size: number = 10;

  public periCode: any;
  public statut: any;
  public typeMission: any;
  public createdBy: any;
  public userId: any;
  public equipFacteur: any;
  public num_reservation: any;

  public facteur = 0;
  public costLeak = 0;
  public costAction = 0;
  public totalGain = 0;
  public totalGainCo2 = 0;

  isMapCollapsed = true;
  selectedTabIndex = 1;


  /**
   * Parse date and return date string with the fomat dd/mm/yyyy hh:mm
   */
  toDate = this.backendService.toDate;


  /**
   * Parse date and return day string with the format dd/mm/yyyy
   * @param date 
   * @returns 
   */
  toDateOnlyDay = (date: number | Date) => {
    const fullDate = this.backendService.toDateCsv(date);
    return fullDate.split(' ')[0];
  }


  constructor(
    private dialogModel: MatDialog,
    public formBuilder: FormBuilder,
    private backendService: BackendService,
    private userInfoService: UserInfoService,
    private titleService: ToolbarTitleService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.titleService.changeTitle('Tarsio - Reservations / Missions');

    // Get bookingID and selectedTabIndex
    this.route.queryParams.subscribe(params => {
      if (params.id) {
        this.bookingId = params.id;
      } else {
        this.router.navigate(['/bookings']);
      }
      if (params.index) {
        this.selectedTabIndex = params.index;
      } else {
        this.selectedTabIndex = 0;
      }
      if (this.selectedTabIndex == 0) {
        this.isMapCollapsed = true;
      } else {
        this.isMapCollapsed = false;
      }
    });
  }



  ngOnInit(): void {
    // Get current user ID and isAdmin
    this.userInfoService.currentUser.subscribe((user: any) => {
      this.currentUid = user._id;
      this.isAdmin = user.isAdmin;
    });
  }



  ngAfterViewInit(): void {
    
    this.getBooking().then(() => {
      this.initMap();
      this.loadingBookingDetails = false;
      this.calculateGain();
    }).catch(err => {
      console.error('error on getting booking details');
      this.backendService.showErrorDialog('Une erreur inattendue s\'est produite', '');
      this.router.navigate(['/bookings']);
      console.error(err);
    });
  }



  /**
   * Get the booking/reservation details from the backend
   * @returns Promise
   */
  getBooking() {
    return new Promise((resolve, reject) => {
      try {
        this.backendService.getOneReservations(this.bookingId).subscribe((booking: any) => {
          this.booking = booking;
          this.typeMission = booking?.typeMissionId;
          this.periCode = booking?.perimeterId.code;
          this.choosenPlan = booking?.perimeterId._id;
          this.planUrl = booking?.perimeterId.photoUrl;
          this.createdBy = booking?.createdBy;
          this.userId = booking?.userId;
          this.equipFacteur = booking?.equipId;
          this.statut = booking?.statut;
          try {
            this.titleService.changeTitle('Tarsio - Reservations / Missions - ' + booking.num_reservation);
          } catch (e) {
            reject(e);
          }
          // Get map extent
          this.getMapExtent(this.planUrl).then((ext: any) => {
            this.extent = ext;
            // Get leaks list
            this.backendService.getLeaksOfSpecificBooking(booking._id).subscribe((leaks: any) => {
              leaks.forEach((l: any) => {
                let row = [];
                row[0] = l.leakName;
                row[1] = this.backendService.toDateCsv(l.leakDate);
                row[2] = l.leakGain;
                row[3] = l.leakDbRms;
                row[4] = l.leakK;
                row[5] = l.leakFlow;
                row[6] = l.leakCost;
                row[7] = l.leakCurrency;
                row[8] = l.leakImgUrl;
                row[9] = undefined;
                row[10] = false;
                row[11] = l.leakCoord;
                row[12] = this.periCode;
                row[13] = l.actionPilote;
                row[14] = l.actionDelai ? this.backendService.toDateCsv(l.actionDelai) : undefined;
                row[15] = l.actionDesc;
                row[16] = l.actionCost;
                row[17] = l.actionStatut;
                row[18] = l.leakCoord[0] == null ? false : true;
                row[19] = l._id;
                this.csvRowsArray.push(row);
              });
              // Get facteur to calculate gain
              try {
                this.backendService.getFacteur(booking?.equipId._id, booking?.createdOn).subscribe((f: any) => {
                  this.facteur = f;
                  resolve('');
                }, err => {
                  console.error('error getting facteur');
                  console.error(err);
                  resolve('');
                });
              } catch (e) {
                console.error(e);
                resolve('');
              }
            }, (err: any) => {
              reject(err);
            });
          }).catch(err => {
            reject(err);
          });
        }, (err: any) => {
          console.error(err);
          reject(err);
        });
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  }



  /**
   * Get map extent from planUrl
   * @param url url of the perimetre image
   */
  getMapExtent(url: string) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        let ext: number[] = [0, 0, w, h];
        resolve(ext);
      }
      img.onerror = () => reject();
      img.src = url;
    });
  }







  /**
   * find pagination
   */
  getPaginationLeaks() {
    this.backendService.getPaginatedPermissionUsage(this.page)
      .subscribe((response: any) => {
        this.total = response.total;
      });
  }



  /**
   * On pagination change
   * @param event 
   */
  pageChangeEvent(event: number) {
    this.page = event;
    this.getPaginationLeaks();
  }

  /**
   * Table size change
   * @param event 
   */
  onTableSizeChange(event: any): void {
    this.size = event.target.value;
    this.page = 1;
    this.getPaginationLeaks();
  }





  /**
   * When the user select a row of the uploaded csv table
   * to place leak location
   * @param selectedIndex 
   */
  onSelectCard(selectedIndex: number) {
    if (this.csvRowsArray[selectedIndex][18]) {
      // Do not select the row when it's already have a location on the map
      return;
    }
    this.csvRowsArray[selectedIndex][10] = !this.csvRowsArray[selectedIndex][10];
    if (this.csvRowsArray[selectedIndex][10]) {
      this.selectedRowIndex = selectedIndex;
    }
    else {
      this.selectedRowIndex = -1;
    }
    // Unselect all others row
    for (let i = 0; i < this.csvRowsArray.length; i++) {
      if (i !== selectedIndex) {
        this.csvRowsArray[i][10] = false;
      }
    }
  }







  /**
   * Load missions folder (input file) (uploadFiles leaks images)
   * @param files 
   */
  async filesPicked(files: any) {

    if (files.length === 0) {
      return;
    }

    if (files.length > 0) {
      this.uploadingMissionFolder = true;
    }

    if (this.csvRowsArray.length > 0) {
      // Delete all leaks if there's already uploaded leaks
      const deleteSubscriptions: Array<any> = [];
      this.csvRowsArray.forEach(row => {
        deleteSubscriptions.push(this.backendService.deleteLeak(row[19]));
      });
      forkJoin(deleteSubscriptions).subscribe(([...leaksDeleted]) => {
      }, err => {
        // TODO: show error toast
        console.error(err);
      });
    }

    // Re-Init
    this.csvRowsArray = [];
    this.markerVectorLayer.getSource()?.forEachFeatureInExtent(this.extent, feature => {
      this.markerVectorLayer.getSource()?.removeFeature(feature);
    });


    // This objects contains pairs like {'imgName': 'imgBase64Url'}
    const imgNameToUrl: any = {};
    // This objects contains pairs like {'imgName': File}
    const imgNameToFile: any = {};
    // This arrays contains images names array
    const imgNameArray: Array<any> = [];

    // First, fill object imgNameToUrl by finding the base64 url
    await Promise.all(Array.from(files).map(async (imgFile: any) => {
      if (imgFile.name.endsWith('png')) {
        try {
          imgNameArray.push(imgFile.name);
          const imgBase64Url = await this.getBase46(imgFile);
          imgNameToUrl[imgFile.name] = imgBase64Url;
          imgNameToFile[imgFile.name] = imgFile;
        } catch (e) {
          console.error(e);
          imgNameToUrl[imgFile.name] = undefined;
          imgNameToFile[imgFile.name] = imgFile;
        }
      }
    }));

    // Second, parse the csv file
    let isThereCsv = false;
    for (let i = 0; i < files.length; i++) {
      if (files[i].name.endsWith('csv')) {
        isThereCsv = true;
        let csvFile: any = files[i];
        // File reader method
        let reader: FileReader = new FileReader();
        reader.readAsText(csvFile);
        reader.onload = async (e) => {
          let csv: any = reader.result;
          let csvRows = [];
          csvRows = csv.split(/\r|\n|\r/);
          // Table Rows
          let nbRows = csvRows.length;
          let rows = [];
          for (let i = 1; i < nbRows; i++) {
            const splittedCsvRow = csvRows[i].split(';');
            // Some rows are empty, hence this condition
            if (splittedCsvRow[0] && splittedCsvRow.length > 2) {
              // Find imageName from a row
              let fullImageName = '';
              const fuiteName = splittedCsvRow[0];
              fullImageName = fuiteName ? (fuiteName) : '';
              let fuiteDate = splittedCsvRow[1];
              fuiteDate = fuiteDate.replace(/ /g, '-');
              fuiteDate = fuiteDate.replace(/:/g, '-');
              fuiteDate = fuiteDate.replace(/\//g, '-');
              fullImageName += fuiteDate ? ('-' + fuiteDate) : '';
              const fuiteGain = splittedCsvRow[2];
              fullImageName += fuiteGain ? ('-' + fuiteGain + 'dB') : '';
              const fuiteDb = splittedCsvRow[3];
              fullImageName += fuiteDb ? ('-' + fuiteDb + 'dB') : '';
              const fuiteK = splittedCsvRow[4];
              fullImageName += fuiteK ? ('-' + fuiteK) : '';
              const fuiteFlow = splittedCsvRow[5];
              fullImageName += fuiteFlow ? ('-' + fuiteFlow) : '';
              const fuiteCost = splittedCsvRow[6];
              fullImageName += fuiteCost ? ('-' + fuiteCost) : '';
              const fuiteCurrency = splittedCsvRow[7];
              fullImageName += fuiteCurrency ? ('-' + fuiteCurrency + '.png') : '.png';
              splittedCsvRow[8] = imgNameToUrl[fullImageName]; // splittedCsvRow[8] contains the base64 url of the image
              splittedCsvRow[9] = imgNameToFile[fullImageName]; // splittedCsvRow[9] contains the file image
              splittedCsvRow[10] = false;  // splittedCsvRow[10] contains selected or not
              splittedCsvRow[17] = 'En cours';
              splittedCsvRow[18] = false;  // splittedCsvRow[18] contains 'pointeur' displayed or not
              rows.push(splittedCsvRow);

            }
          }

          // Upload leaks simultaneously
          await Promise.all(rows.map(async row => {
            await new Promise((resolve, reject) => {
              this.backendService.uploadLeak(row, this.booking?._id).subscribe((savedLeak: any) => {
                let csvRow = row;
                csvRow[19] = savedLeak._id;
                this.csvRowsArray.push(csvRow);
                resolve(savedLeak);
              }, (err: any) => {
                reject(err);
              });
            });
          })).then(() => {
            // Update booking statut
            this.statut = 'Mission terrain';
            this.backendService.updateBookingStatut(this.bookingId, 'Mission terrain').subscribe((res: any) => {
              // TODO: show success toast
            }, (err: any) => {
              // TODO: show error toast
            });
            this.calculateGain();
          }).catch(err => {
            this.backendService.showErrorDialog('Une erreur inattendue c\'est produite',
              'veuillez réessayer l\'upload des fuites plus tard');
            console.error(err);
          }).finally(() => {
            this.uploadingMissionFolder = false;
            this.toastr.clear();
          });

        }
      }
    }

    if (files.length != 0 && !isThereCsv) {
      this.backendService.showErrorDialog('Pas de fichier CSV trouvé dans ce dossier', '');
      this.uploadingMissionFolder = false;
    }
  }







  /**
   * Read image file and return Promise of the base64 string
   * @param imgFile Blob | File
   * @returns Promise
   */
  getBase46(imgFile: any) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(imgFile);
      fileReader.onload = (event) => {
        const imgBase64Url = event.target?.result;
        resolve(imgBase64Url);
      };
      fileReader.onerror = reject;
    });
  }






  /**
   * When the user change Tab between 'charger données' & 'Ajouter actions'
   * @param index 
   */
  onChangeTab(index: any) {
    // TODO: Handle show/hide map here
  }



  /**
   * Open dialog to edit leaks details
   * @param event 
   * @param rowClicked 
   * @param indexClicked 
   */
  openEditLeakDialog(event: Event, rowClicked: any, indexClicked: any) {
    event.stopPropagation();
    const editDialog = this.dialogModel.open(EditDialogComponent, {
      width: '500px',
      data: rowClicked,
      disableClose: true
    });
    editDialog.afterClosed().subscribe((editedRow: Array<any>) => {
      if (editedRow) {
        rowClicked[0] = editedRow[0];
        rowClicked[1] = editedRow[1];
        rowClicked[2] = editedRow[2];
        rowClicked[3] = editedRow[3];
        rowClicked[4] = editedRow[4];
        rowClicked[5] = editedRow[5];
        rowClicked[6] = editedRow[6];
        rowClicked[7] = editedRow[7];
        this.csvRowsArray[indexClicked] = rowClicked;
        this.calculateGain();

        // Update leak on the DB
        this.backendService.updateLeak(rowClicked).subscribe((res) => {
          // TODO: show success toast
        }, err => {
          // TODO: show error toast
          console.error('error updating leak');
          console.error(err);
        });
      }
    });
  }





  /**
   * Open dialog to add/edit action
   * @param event click event
   * @param rowClicked the clicked CSV Row
   * @param indexClicked the clicked CSV Row index
   */

  openActionDialog(event: Event, rowClicked: any, indexClicked: any) {
    event.stopPropagation();
    const actionsDialog = this.dialogModel.open(ActionDialogComponent, {
      width: '500px',
      data: rowClicked,

    });

    actionsDialog.afterClosed().subscribe((actionData: any) => {
      if (actionData) {
        // update rowClicked with the value from the action dialog
        rowClicked[13] = actionData.pilote;
        rowClicked[14] = actionData.delais;
        rowClicked[15] = actionData.description;
        rowClicked[16] = actionData.cout;
        rowClicked[17] = actionData.statut;
        this.csvRowsArray[indexClicked] = rowClicked;
        this.calculateGain();

        this.backendService.updateLeak(rowClicked).subscribe((res) => {
          // TODO: show success toast

          // See if all actions properties are filled
          // Or all clotured to updated booking statut accrodingly
          let allActionsFilled = true;
          let allActionsClotured = true;
          for (let row of this.csvRowsArray) {
            if (!row[13] || !row[14] || !row[15] || !row[16] || !row[17]) {
              allActionsFilled = false;
            }
            if (row[17] != 'Clôturé') {
              allActionsClotured = false;
            }
          }
          if (allActionsClotured) {
            // Update mission statut to 'Clôturé'
            this.statut = 'Clôturé';
            this.backendService.updateBookingStatut(this.bookingId, this.statut).subscribe(() => {
              // TODO: show success toast
            }, err => {
              // TODO: show error toast
              console.error(err);
            });
          } else if (allActionsFilled) {
            this.statut = 'Réalisation actions';
            this.backendService.updateBookingStatut(this.bookingId, this.statut).subscribe(() => {
              // TODO: show success toast
            }, err => {
              // TODO: show error toast
              console.error(err);
            });
          } else {
            this.statut = 'Identification actions';
            this.backendService.updateBookingStatut(this.bookingId, this.statut).subscribe(() => {
              // TODO: show success toast
            }, err => {
              // TODO: show error toast
              console.error(err);
            });
          }

        }, err => {
          // TODO: show error toast
          console.error('Error updating leak');
          console.error(err);
        });
      }

    });
  }



  /**
   * Delete a row
   * @param event 
   * @param rowIndex 
   */
  deleteRow(event: Event, rowIndex: number) {
    event.stopPropagation();
    if (confirm(`Êtes-vous sur de supprimer la fuite ${this.csvRowsArray[rowIndex][0]} ?`)) {

      // Remove leak from firebase
      this.backendService.deleteLeak(this.csvRowsArray[rowIndex][19]).subscribe((deletedLeak) => {
        // TODO: show success toast
      }, err => {
        console.error(err);
        // TODO: show error toast
      });

      // Remove marker from map
      this.markerVectorLayer.getSource()?.forEachFeatureInExtent(this.extent, feature => {
        if (feature.get('row')[19] === this.csvRowsArray[rowIndex][19]) {
          // remove marker
          this.markerVectorLayer.getSource()?.removeFeature(feature);
          // Hide opoup
          this.overlay?.setPosition(undefined);
          this.closePopup.nativeElement.blur();
          this.selectedRowIndex = -1;
        }
      });

      // Remove row from csv array
      this.csvRowsArray.splice(rowIndex, 1);
      this.calculateGain();
      if (this.selectedRowIndex === rowIndex) {
        this.selectedRowIndex = -1;
      }
    }
  }




  /**
   * Triggered when user clicks on 'pointeur' marker to reveal leak location
   * and show popup
   * @param csvRow 
   * @param selectPointeur 
   * @param event 
   */
  onSelectPointeur(csvRow: any, selectPointeur: number, event: Event) {
    event.stopPropagation();
    this.popupContent.nativeElement.innerHTML = `
            <div>
              <img src=${csvRow[8]} width="300">
            </div>
            <div>
              Fuite: ${csvRow[0]}
            </div>
            <div>
              Date: ${csvRow[1]}
            </div>
            <div>
              Cout: ${csvRow[6] ? csvRow[6] + ' ' + csvRow[7] : 'N.A'}
            </div>`;
    this.overlay?.set('row', csvRow);
    this.overlay?.setPosition(this.csvRowsArray[selectPointeur][11]);
    this.overlay?.setOffset([0, -20]);
  }



  /**
   * Tab change event between 'Charger donner' && 'Ajout action'
   * @param index 
   */
  onTabChange(index: number) {
    this.selectedTabIndex = index;
    if (index === 0) {
      this.isMapCollapsed = true;
      setTimeout(() => {
        this.map?.updateSize();
      }, 200);
    }
    if (index === 1) {
      this.isMapCollapsed = false;
      setTimeout(() => {
        this.map?.updateSize();
      }, 200);
    }
  }


  /**
   * Collappse/Uncollapse the map
   */
  onCollapseBarClicked() {
    this.isMapCollapsed = !this.isMapCollapsed;
    setTimeout(() => {
      this.map?.updateSize();
    }, 200);
  }




  /**
   * Calculate leak cost, actions cost, gain, co2 gain
   */
  calculateGain() {
    this.costLeak = 0;
    this.costAction = 0;
    this.totalGain = 0;
    this.totalGainCo2 = 0;
    for (let row of this.csvRowsArray) {
      try {
        this.costLeak += isNaN(+row[6]) ? 0 : +row[6]
      } catch (e) {
        console.error(e);
      }

      try {
        this.costAction += isNaN(+row[16]) ? 0 : +row[16];
      } catch (e) {
        console.error(e);
      }
    }
    this.totalGain = this.costLeak - this.costAction;
    this.totalGainCo2 = this.facteur * this.totalGain;
  }





  /**
   * 
   * -------------------------
   * All map stuffs goes here
   * -------------------------
   */
  initMap() {

    this.projection = new Projection({
      code: 'xkcd-image',
      units: 'pixels',
      extent: this.extent
    });


    // Init the map
    this.map = new Map({
      controls: defaultControls().extend([new FullScreen()]),
      target: this.mapContainer.nativeElement,
      view: new View({
        projection: this.projection,
        center: getCenter(this.extent),
        resolution: 1
      })
    });

    this.imageLayer = new ImageLayer({
      source: new Static({
        attributions: '© <a href="https://xkcd.com/license.html">xkcd</a>',
        url: this.planUrl,
        projection: this.projection,
        imageExtent: this.extent
      })
    });

    // Add image plan layer
    this.map.addLayer(this.imageLayer);
    // Add leaks locations layers
    this.map.addLayer(this.markerVectorLayer);
    // Add Popup overlay
    this.overlay = new Overlay({
      element: this.mapPopup.nativeElement,
      autoPan: {
        animation: {
          duration: 250
        }
      }
    });
    this.map.addOverlay(this.overlay);
    this.map.changed();


    // ----
    // Init already assigned locations of the leaks on the map
    // ----
    for (let row of this.csvRowsArray) {
      if (row[11] != null && row[11][0] != null && row[11][1] != null) {
        const markerFeature = new Feature({
          geometry: new Point(row[11]),
          type: 'leak-marker',
          row: row
        });
        this.markerVectorLayer.getSource()?.addFeature(markerFeature);
        this.markerVectorLayer.changed();
        this.map?.changed();
      }
    }

    // ----
    // Close popupclick
    // ----
    this.closePopup.nativeElement.onclick = () => {
      this.overlay?.setPosition(undefined);
      this.closePopup.nativeElement.blur();
      return false;
    }


    // ----
    // Reset btn click
    // ----
    this.popupResetBtn.nativeElement.onclick = () => {
      const clickedPopupRow = this.overlay?.get('row');
      this.markerVectorLayer.getSource()?.forEachFeatureInExtent(this.extent, feature => {
        if (feature.get('row') === clickedPopupRow) {
          // Remove marker
          this.markerVectorLayer.getSource()?.removeFeature(feature);
          // Remove row from rowsReadyArray
          const indexRowToRemove = this.csvRowsArray.indexOf(clickedPopupRow);
          this.selectedRowIndex = indexRowToRemove;
          this.csvRowsArray[this.selectedRowIndex][18] = false;
          this.csvRowsArray[this.selectedRowIndex][10] = false;
          this.csvRowsArray[this.selectedRowIndex][11] = [null, null];

          // Update leak
          this.backendService.updateLeak(this.csvRowsArray[this.selectedRowIndex]).subscribe((res) => {
            // TODO: show success toast
          }, (err) => {
            // TODO: show error toast
            console.error(err);
          });

          // Update back the statut to 'Mission terrain'
          this.statut = 'Mission terrain';
          this.backendService.updateBookingStatut(this.bookingId, 'Mission terrain').subscribe((res: any) => {
            // TODO: show success toast
          }, (err: any) => {
            // TODO: show error toast
            console.error('Error updating statut')
            console.error(err);
          });

          for (let i = 1; i < this.csvRowsArray.length; i++) {
            this.csvRowsArray[i][10] = false;
          }

          // Hide popup
          this.overlay?.setPosition(undefined);
          this.closePopup.nativeElement.blur();
          this.selectedRowIndex = -1;
        }
      });

    }

    // ----------------
    // Map click event
    // ----------------
    this.map.on('click', (event: any) => {
      // Find out if a new mession marker was clicked
      const markerFeatureClicked = this.map?.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
        if (feature.get('type') == 'leak-marker') {
          return feature;
        }
        return null;
      });

      if (markerFeatureClicked) {
        // Marker icon clicked --> show popup
        const markerRow = markerFeatureClicked.get('row');
        this.popupContent.nativeElement.innerHTML = `
            <div>
              <img src=${markerRow[8]} width="300">
            </div>
            <div>
              Fuite: ${markerRow[0]}
            </div>
            <div>
              Date: ${markerRow[1]}
            </div>
            <div>
              Cout: ${markerRow[6] ? markerRow[6] + ' ' + markerRow[7] : 'N.A'}
            </div>`;

        const clickedMarkerExtent: any = markerFeatureClicked.getGeometry()?.getExtent();
        this.overlay?.set('row', markerFeatureClicked.get('row'));
        this.overlay?.setPosition([clickedMarkerExtent[0], clickedMarkerExtent[1]]);
        this.overlay?.setOffset([0, -20]);
      } else {
        // Somewhere else in the map was clicked
        // Hide popup
        this.overlay?.setPosition(undefined);
        this.closePopup.nativeElement.blur();

        if (this.selectedRowIndex > -1) {

          // Add marker only if a user are selecting csv row
          const x = event.coordinate[0];
          const y = event.coordinate[1];

          if (containsXY(this.extent, x, y)) {
            // Add marker only if the user clicked within the plan
            const rowToSave = this.csvRowsArray[this.selectedRowIndex];
            rowToSave[11] = [x, y]; // Coordinate
            rowToSave[12] = this.choosenPlan; // Choosen plan
            rowToSave[18] = true; // Display 'pointeur' image on the table
            const markerFeature = new Feature({
              geometry: new Point([x, y]),
              type: 'leak-marker',
              row: rowToSave
            });
            this.markerVectorLayer.getSource()?.addFeature(markerFeature);
            this.markerVectorLayer.changed();
            this.map?.changed();

            this.csvRowsArray[this.selectedRowIndex] = rowToSave;

            // Update leak with the new data
            this.backendService.updateLeak(rowToSave).subscribe(res => {
              // TODO: show success toast
            }, err => {
              // TODO: show error toasts
              console.error(err);
            });

            // See if all rows have rowToSave not null to update booking statut to "Mapping"
            let allMapped = true;
            for (let row of this.csvRowsArray) {
              if (row[11] == null) {
                allMapped = false;
              } else {
                if (row[11][0] == null || row[11][1] == null) {
                  allMapped = false;
                }
              }
            }
            if (allMapped) {
              this.statut = 'Mapping';
              this.backendService.updateBookingStatut(this.bookingId, 'Mapping').subscribe(
                (res: any) => {
                  // TODO: Show success toast
                }, (err: any) => {
                  // TODO: Show error toast
                });
            }
            this.selectedRowIndex = -1;
          }
        }
      }
    });


    // Map hover event (show cursor pointer when hovering over marker)
    this.map.on('pointermove', e => {
      const markerFeatureHit = this.map?.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
        if (feature.get('type') == 'leak-marker') {
          return feature;
        }
        return null;
      });

      if (markerFeatureHit) {
        if (this.map) {
          this.map.getTargetElement().style.cursor = 'pointer';
        }
      } else {
        if (this.map) {
          this.map.getTargetElement().style.cursor = '';
        }
      }
    });
  }







}