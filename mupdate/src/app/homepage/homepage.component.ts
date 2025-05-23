import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { Navigation, Pagination, Mousewheel, Autoplay } from 'swiper/modules';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule, AvatarModule, RatingModule, FormsModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, AfterViewInit {
  value!: number;
  username: string | null = null;

  @ViewChild('swiperContainer') swiperContainer!: ElementRef;

  slides = [
    { imageUrl: 'assets/images/m5.png', title: 'Slide 1', description: 'Description for Slide 1' },
    { imageUrl: 'assets/images/m1.png', title: 'Slide 2', description: 'Description for Slide 2' },
    { imageUrl: 'assets/images/m4.png', title: 'Slide 3', description: 'Description for Slide 3' },
    { imageUrl: 'assets/images/m5.png', title: 'Slide 4', description: 'Description for Slide 4' },
    { imageUrl: 'assets/images/m1.png', title: 'Slide 5', description: 'Description for Slide 5' },
    { imageUrl: 'assets/images/m4.png', title: 'Slide 6', description: 'Description for Slide 6' },
  ];

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    new Swiper(this.swiperContainer.nativeElement, {
      modules: [Navigation, Pagination, Mousewheel, Autoplay],
      slidesPerView: 3,
      spaceBetween: 10,
      loop: true,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
        reverseDirection: true,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        320: { slidesPerView: 1, spaceBetween: 10 },
        640: { slidesPerView: 2, spaceBetween: 15 },
        1024: { slidesPerView: 3, spaceBetween: 20 },
      }
    });
  }
}
