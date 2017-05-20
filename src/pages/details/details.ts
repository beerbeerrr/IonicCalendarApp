import { Component } from '@angular/core';  
import { NavParams, ViewController } from 'ionic-angular';  
import { CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
export class DetailsPage {  
    public calendar: any = {};
    public isNew = true;
    public action = 'Add';
    public isoDate = '';
    public nowdate;

    constructor(private viewCtrl: ViewController, private navParams: NavParams, private calendarService: CalendarService) {
        this.nowdate = this.navParams.get('now');
    }

    ionViewDidLoad() {
        let editCalendar = this.navParams.get('calendar');

        if (editCalendar) {
            this.calendar = editCalendar;
            this.isNew = false;
            this.action = 'Edit';
            this.isoDate = this.calendar.Date.toISOString().slice(0, 10);
        }
    }

    save() {
        this.calendar.Date = new Date(this.isoDate);

        if (this.isNew) {
            this.calendarService.add(this.calendar)
                .catch(console.error.bind(console));
        } else {
            this.calendarService.update(this.calendar)
                .catch(console.error.bind(console));
        }

        this.dismiss();
    }

    delete() {
        this.calendarService.delete(this.calendar)
            .catch(console.error.bind(console));

        this.dismiss();
    }

    dismiss() {
        this.viewCtrl.dismiss(this.calendar);
    }
}