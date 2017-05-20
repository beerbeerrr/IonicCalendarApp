import { Component, NgZone } from "@angular/core";
import { ModalController, NavController, Platform } from 'ionic-angular';  
import { CalendarService } from '../../services/calendar.service';  
import { DetailsPage } from '../details/details';  


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    public calendars = [];
    viewTitle;
    noEventsLabel:string = 'No Events';
    showEventDetail:boolean = false;
    isToday: boolean;
    calendar = {
        mode: 'month',
        currentDate: new Date()
    }; // these are the variable used by the calendar.
    constructor(private calendarService: CalendarService,
        private navCtrl: NavController,
        private platform: Platform,
        private zone: NgZone,
        private modalCtrl: ModalController) {
    }
    ionViewDidLoad() {
        this.platform.ready().then(() => {
            this.calendarService.initDB();

            this.calendarService.getAll()
                .then(data => {
                    this.zone.run(() => {
                        this.calendars = data;
                    });
                })
                .catch(console.error.bind(console));
        });
    }
    showDetail(calendar) {
        let modal = this.modalCtrl.create(DetailsPage, { calendar: calendar });
        modal.present();
    }
    onViewTitleChanged(title) {
        this.viewTitle = title;
    }
    onEventSelected(event) {
        console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
    }
    changeMode(mode) {
        this.calendar.mode = mode;
    }
    today() {
        this.calendar.currentDate = new Date();
    }
    onTimeSelected(ev) {
        console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
            (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
        this.calendar.currentDate = ev.selectedTime;
    }
    onCurrentDateChanged(event:Date) {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        event.setHours(0, 0, 0, 0);
        this.isToday = today.getTime() === event.getTime();
    }
    onRangeChanged(ev) {
        console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
    }
    markDisabled = (date:Date) => {
        var current = new Date();
        current.setHours(0, 0, 0);
        return date < current;
    };
}