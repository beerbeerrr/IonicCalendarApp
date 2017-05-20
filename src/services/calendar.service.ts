import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb';
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';

@Injectable()
export class CalendarService {  
    private _db;
    private _calendars;

    initDB() {
        PouchDB.plugin(cordovaSqlitePlugin);
        this._db = new PouchDB('calendar.db', { adapter: 'cordova-sqlite' });
    }

    add(calendar) {  
        return this._db.post(calendar);
    }

    update(calendar) {  
        return this._db.put(calendar);
    }

    delete(calendar) {  
        return this._db.remove(calendar);
    }

    getAll() {  
        
        if (!this._calendars) {
            return this._db.allDocs({ include_docs: true})
                .then(docs => {

                    // Each row has a .doc object and we just want to send an 
                    // array of birthday objects back to the calling controller,
                    // so let's map the array to contain just the .doc objects.

                    this._calendars = docs.rows.map(row => {
                        // Dates are not automatically converted from a string.
                        row.doc.Date = new Date(row.doc.Date);
                        return row.doc;
                    });

                    // Listen for changes on the database.
                    this._db.changes({ live: true, since: 'now', include_docs: true})
                        .on('change', this.onDatabaseChange);

                    return this._calendars;
                });
        } else {
            // Return cached data as a promise
            return Promise.resolve(this._calendars);
        }
    }

    private onDatabaseChange = (change) => {  
        var index = this.findIndex(this._calendars, change.id);
        var birthday = this._calendars[index];

        if (change.deleted) {
            if (birthday) {
                this._calendars.splice(index, 1); // delete
            }
        } else {
            change.doc.Date = new Date(change.doc.Date);
            if (birthday && birthday._id === change.id) {
                this._calendars[index] = change.doc; // update
            } else {
                this._calendars.splice(index, 0, change.doc) // insert
            }
        }
    }

    // Binary search, the array is by default sorted by _id.
    private findIndex(array, id) {  
        var low = 0, high = array.length, mid;
        while (low < high) {
        mid = (low + high) >>> 1;
        array[mid]._id < id ? low = mid + 1 : high = mid
        }
        return low;
    }

}