import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { JWTInput } from 'google-auth-library';
import { google } from 'googleapis';

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {
  private readonly driveApi: any;
  private readonly authToken$: Observable<string>;

  constructor(private readonly http: HttpClient) {
    this.driveApi = google.drive({ version: 'v3' });
    this.authToken$ = from(this.authorize());
  }

  private async authorize(): Promise<string> {
    const credentials: JWTInput = {
      client_id: '1038145498649-eqe5nhfbeifob9noaf5dspa5kd8uss2j.apps.googleusercontent.com',
      client_secret: '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',
      refresh_token: '1//04qkGjdNw4xWTCgYIARAAGAQSNwF-L9IrbAHVcX-4DLAvSfPGe7OV1YmfqqZ_zvCOssVEauLE4SawqLdM-EmEYJs2YRwTMF4cWtU',
    };
    const client = await google.auth.getClient({ credentials });
    const { token } = await client.getAccessToken();
    return token;
  }

  public getFileContent(fileId: string): Observable<any> {
    return this.authToken$.pipe(
      switchMap((authToken) => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
        const params = { fileId, mimeType: 'text/csv' };
        return this.http.get(`${this.driveApi.files.export}`, { headers, params });
      })
    );
  }
}