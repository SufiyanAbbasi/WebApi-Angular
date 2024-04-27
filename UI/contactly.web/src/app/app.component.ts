import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AsyncPipe, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  http = inject(HttpClient)
  //constructor(private http: HttpClient) {}
  contact$ = this.getContacts();

  contactsForm = new FormGroup({
    name: new FormControl<string>(''),
    email: new FormControl<string | null>(null),
    phone: new FormControl<string>(''),
    favorite: new FormControl<boolean>(false)
  })

  onFormSubmit() {
    const addContactsRequest = {
      name: this.contactsForm.value.name,
      email: this.contactsForm.value.email,
      phone: this.contactsForm.value.phone,
      favorite: this.contactsForm.value.favorite,
    }

    this.http.post('https://localhost:7252/api/Contacts', addContactsRequest).subscribe({
      next: (value) => {
        console.log(value);
        this.contact$ = this.getContacts();
        this.contactsForm.reset();
      }
    })
  }

  onDelete(id:string){
   this.http.delete(`https://localhost:7252/api/Contacts/${id}`).subscribe({
    next : (value) => {
      alert('Item Deleted')
      this.contact$ = this.getContacts();
    }
   })
  }
  private getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>('https://localhost:7252/api/Contacts')
  }
}
