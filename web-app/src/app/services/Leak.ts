
export class Leak {
    _id!: string;
    bookingId!: string;
    leakName!: string;
    leakDate!: Date;
    leakGain!: number;
    leakDbRms!: number;
    leakK!: number;
    leakFlow!: number;
    leakCost!: number;
    leakCurrency!: string;
    leakImgUrl!: string;
    leakCoord!: Array<any>;

    // Action stuffs
    actionPilote!: string;
    actionDelai!: Date;
    actionDesc!: string;
    actionCost!: number;
    createdOn!: Date;
}