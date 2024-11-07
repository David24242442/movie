import { Component , OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { Navigation, Pagination,EffectCoverflow , Autoplay} from 'swiper/modules';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

  @ViewChild('swiperContainer') swiperContainer!: ElementRef;

    slides = [
      {
        imageUrl: 'assets/images/m5.png',
        title: 'Slide 1',
        description: 'Description for Slide 1',
      },
      {
        imageUrl: 'assets/images/m1.png',
        title: 'Slide 2',
        description: 'Description for Slide 2',
      },
      {
        imageUrl: 'assets/images/m4.png',
        title: 'Slide 3',
        description: 'Description for Slide 3',
      },
      {
        imageUrl: 'assets/images/m5.png',
        title: 'Slide 1',
        description: 'Description for Slide 1',
      },
      {
        imageUrl: 'assets/images/m1.png',
        title: 'Slide 2',
        description: 'Description for Slide 2',
      },
      {
        imageUrl: 'assets/images/m4.png',
        title: 'Slide 3',
        description: 'Description for Slide 3',
      },
      
    ];
    constructor() {}
    

    ngOnInit(): void {
      console.log('ngOnInit called');
    
    }


    ngAfterViewInit(): void {
      //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
      //Add 'implements AfterViewInit' to the class.
      new Swiper(this.swiperContainer.nativeElement, {
        modules: [Navigation, Pagination, EffectCoverflow, Autoplay],
        effect: 'coverflow',

        slidesPerView: 3,
        spaceBetween: 10,
        loop: true,

        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
          scale: 1.2,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },

        autoplay: {
          delay: 2000, // 3 seconds between slides
          disableOnInteraction: false,
          reverseDirection: true, // Keeps autoplay even after user interacts
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    }
}
