import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GoogleDriveService } from './services/google-drive.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  policyIds$: Observable<number[]>;
  stateCodes$: Observable<string[]>;

  constructor(private googleDriveService: GoogleDriveService) {}

  ngOnInit() {
    this.setPolicyAndStateCodes();
  }

  private setPolicyAndStateCodes() {
    const fileId = '1sU7YAP4c0HDMkYkrimJc7oi2dazz-7T5';
    const fileContent$ = this.googleDriveService.getFileContent(fileId);
    this.policyIds$ = fileContent$.pipe(
      map((data) => {
        const lines = data.split('\n');
        return lines.slice(1).map((line) => parseInt(line.split(',')[0]));
      })
    );
    this.stateCodes$ = fileContent$.pipe(
      map((data) => {
        const lines = data.split('\n');
        return lines.slice(1).map((line) => line.split(',')[1]);
      })
    );
  }

  onSubmit() {
    this.policyIds$.subscribe((policyIds) => {
      console.log(policyIds);
    });
  }
}