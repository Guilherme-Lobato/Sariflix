import { ActivatedRoute } from "@angular/router";
import { SharedService } from "../../service/shared.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Component, OnInit } from "@angular/core";
import { Observable, map } from "rxjs";

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  videoIdFromRouteParameter: string | null = null;
  videoEmbedUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.videoIdFromRouteParameter = this.route.snapshot.paramMap.get('videoId');
    this.sharedService.setSelectedVideoId(this.videoIdFromRouteParameter ?? '');
  }
  
  get getVideoEmbedUrl$(): Observable<SafeResourceUrl | null> {
    return this.sharedService.getSelectedVideoId().pipe(
      map(videoId => {
        if (videoId) {
          const videoUrl = `https://www.youtube.com/embed/${videoId}`;
          return this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
        } else {
          return null;
        }
      })
    );
  }
}
