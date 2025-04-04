import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { Navigation, Pagination, Mousewheel, Autoplay } from 'swiper/modules';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-mainhome',
  standalone: true,
  imports: [CommonModule, RouterModule, AvatarModule, RatingModule, FormsModule],
  templateUrl: './mainhome.component.html',
  styleUrls: ['./mainhome.component.css']
})
export class MainhomeComponent implements OnInit, AfterViewInit {
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

  movies = [
    { image: 'assets/images/m1.png', title: 'Movie 1' },
    { image: 'assets/images/m4.png', title: 'Movie 2' },
    { image: 'assets/images/m3.png', title: 'Movie 3' },
    { image: 'assets/images/m5.png', title: 'Movie 4' },
    { image: 'assets/images/m6.png', title: 'Movie 5' },
    { image: 'assets/images/m3.png', title: 'Movie 6' },
    { image: 'assets/images/m1.png', title: 'Movie 7' },
    { image: 'assets/images/m1.png', title: 'Movie 8' },
  ];

  constructor(private service: UserService) {}

  ngOnInit() {
    this.service.username$.subscribe((username) => {
      this.username = username || 'Guest';
    });

    const currentUsername: string | null = this.service.getUsername();
    if (currentUsername) {
      this.username = currentUsername;
    }
  }

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
