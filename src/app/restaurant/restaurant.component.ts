import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ApiService} from '../api.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ReviewList} from './model/Review';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {

  restaurantDetail: any = {
    'name': '',
    'ownerName': '',
    'rate': 0,
    'highestRatedReview': '',
    'highestRate': '',
    'lowestRatedReview': '',
    'lowestRate': '',
    'latestReview': '',
    'latestRate': '',
    'latestDate': ''
  };

  reviewForm: any = {
    'id': '',
    'restaurantId': '',
    'visitDate': '',
    'comment': '',
    'rate': 5,
  };

  alert: any = {
    'type': 'danger',
    'message': ''
  };

  success: any = {
    'type': 'success',
    'message': ''
  };


  public searchRestaurant: any = {
    page: 1,
    name: ''
  };

  public searchBy = 'Search By';

  public restaurantList;
  public reviewList;
  public restaurantPage = 0;
  public reviewPage = 0;
  public apiRequest = {};
  public restaurantName;
  public selectedRestaurantId;

  modalRef: BsModalRef;
  constructor(private api: ApiService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.doSearchRestaurant();
  }

  doSearchRestaurant() {
    const searchJson: any = {
      page: this.restaurantPage,
      isOwner: false,
    };
    searchJson[this.searchRestaurant.searchBy] = this.searchRestaurant.query;

    ['name', 'rate' ].forEach(x => {
      if (this.searchRestaurant[x]) {
        searchJson[x] = this.searchRestaurant[x];
      }
    });

    this.restaurantSearchList(searchJson);
  }

  restaurantSearchList(searchJson ?: any) {
    const icon = document.getElementById('search-icon');
    icon.className = 'fa fa-spinner fa-pulse';

    this.api.post('restaurant/list-restaurant', searchJson ? searchJson : this.searchRestaurant)
      .then((res: any) => {
        this.restaurantList = res.restaurants;
        icon.className = 'fa fa-search-plus';
      });
  }

  cancel() {
    this.searchBy = 'Search By';
    this.searchRestaurant.searchBy = 'search-by';
    this.searchRestaurant.query = '';
  }

  prevPage() {
    this.searchRestaurant.page -= 1;
    this.doSearchRestaurant();
  }

  nextPage() {
    this.searchRestaurant.page += 1;
    this.doSearchRestaurant();
  }

  detail(template: TemplateRef<any>, id) {
    this.api.post('restaurant/detail-restaurant', this.apiRequest = {id: id}).then((res: any) => {
      if (res.code === 100) {
        this.restaurantDetail = {
          name: res.restaurant.name,
          owner: res.restaurant.owner.firstName + '  ' + res.restaurant.owner.lastName,
          rate: res.restaurant.rate,
          highestRatedReview: res.restaurant.highestRatedReview,
          highestRate: res.restaurant.highestRate,
          lowestRatedReview: res.restaurant.lowestRatedReview,
          lowestRate: res.restaurant.lowestRate,
          latestReview: res.restaurant.latestReview,
          latestRate: res.restaurant.latestRate,
          latestDate: res.restaurant.latestDate,
        };
        this.getModal(template);
      } else {
        console.log(res.message);
      }
    }).catch((error: HttpErrorResponse) => {
      console.log(error.error);
    });
  }


  openModal(template: TemplateRef<any>) {
    this.restaurantDetail = {};
    this.alert.message = '';
    this.getModal(template);
  }

  private getModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

  FadeOutLink() {
    setTimeout( () => {
      this.success.message = '';
      this.alert.message = '';
    }, 2000);
  }

  openReviewCreateEditModal(template: TemplateRef<any>) {
    this.reviewForm = {};
    this.reviewForm.restaurantId = this.selectedRestaurantId;
    this.alert.message = '';
    this.getModal(template);
  }


  getReviews(page: any) {
    this.api.post('review/list', this.apiRequest = {page: page , restaurantId : this.selectedRestaurantId})
      .then((item: ReviewList) => this.reviewList = item.reviews);
  }

  prevPageDetails() {
    this.reviewPage -= 1;
    this.getReviews(this.reviewPage);
  }

  nextPageDetails() {
    this.reviewPage += 1;
    this.getReviews(this.reviewPage);
  }

  saveReview() {
    const opt = this.isEmpty(this.reviewForm.id) === true  ? 'create' : 'update';
    this.api.post('review/' + opt,
      this.reviewForm
    ).then((res: any) => {
      if (res.code === 100) {
        this.getReviews(0);
        this.doSearchRestaurant();
        this.modalService.hide(2);
      } else {
        this.alert.message = res.message;
      }
    }).catch((error: HttpErrorResponse) => {
      this.alert.message = error.error.message;
    });
  }

  isEmpty(str) {
    return (!str || 0 === str.length);
  }

  deleteReview(id) {
    this.api.post('review/delete', this.apiRequest = {id: id}).then((res: any) => {
      if (res.code === 100) {
        this.getReviews(0);
        this.doSearchRestaurant();
      } else {
        console.log(res.message);
      }
    }).catch((error: HttpErrorResponse) => {
      console.log(error.error);
    });
  }

  editReview(template: TemplateRef<any>, id) {
    this.api.post('review/detail', this.apiRequest = {id: id}).then((res: any) => {
      if (res.code === 100) {
        this.reviewForm = {
          id : res.review.id,
          restaurantId : res.review.restaurant.id,
          visitDate: res.review.visitDate,
          comment: res.review.comment,
          rate: res.review.rate
        };
        this.getModal(template);
      } else {
        console.log(res.message);
      }
    }).catch((error: HttpErrorResponse) => {
      console.log(error.error);
    });
  }

  openReviewPage(template: TemplateRef<any>, id , name) {
    this.restaurantName = name;
    this.selectedRestaurantId = id;
    this.getReviews(0);
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }










}
