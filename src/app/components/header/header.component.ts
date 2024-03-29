// header.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  bodyHeight: string = '500px';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.bodyHeight = this.arrumaHeight(event.urlAfterRedirects);
        console.log('Recarregando HeaderComponent');
        this.ngOnInit();
      }
    });    
  }
  
  private arrumaHeight(url: string): string {
    let headerHeight: string;
  
    if (url.includes('/ListaFilmes') || url.includes('/CadastroFilme') || url.includes('/ListaAutorizar') ) {
      headerHeight = '200px';
    } else {
      headerHeight = '100%'; 
    }
  
    document.documentElement.style.setProperty('--header-height', headerHeight);
  
    return headerHeight;
  }
  
  isCurrentPage(path: string): boolean {
    return this.router.url === path;
  }
}
