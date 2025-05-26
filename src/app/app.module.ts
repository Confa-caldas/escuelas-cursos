import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

// Imports
import { CookieService } from "ngx-cookie-service";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Interceptors
import { JwtInterceptor } from "./_helpers/jwt.interceptor";
import { ErrorInterceptor } from "./_helpers/error.interceptor";
import { NoCacheInterceptor } from './_helpers/no-cache.interceptor';

// Routes
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

// Pipes
import { IndicationEmailPipe } from "./pipes/indication-email.pipe";

// Acordeon
import { AccordionModule } from "ngx-bootstrap/accordion";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    IndicationEmailPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AccordionModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    /* { provide: HTTP_INTERCEPTORS, useClass: NoCacheInterceptor, multi: true }, */
    CookieService,
    DatePipe
  ],
  //bootstrap: [AppComponent],
})
export class AppModule {}
