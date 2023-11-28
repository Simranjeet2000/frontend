import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { createClient } from '@supabase/supabase-js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  supabase = createClient(
    'https://htffpaaageouvcjsjpna.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZmZwYWFhZ2VvdXZjanNqcG5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgzMjAzOTgsImV4cCI6MjAxMzg5NjM5OH0.WMurcvg6hQnfMoKxDAbWj0IH8HSLC_bCiQG8iOBQnyQ'
  );

  username: string = '';
  displayCalendar: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.username = localStorage.getItem('username')|| ''
  }

  logout() {
    localStorage.removeItem('username');

    this.router.navigate(['/login']);
  }
}
