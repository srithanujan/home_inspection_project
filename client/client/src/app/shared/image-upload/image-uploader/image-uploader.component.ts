import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { ImageService } from '../../services/image-upload/image.service';
import { InspectionUpdatesService } from '../../services/check-updates/services/inspection-updates.service';
import { ActivatedRoute } from '@angular/router';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [
    MatProgressBarModule,
    MatIconModule,
    CommonModule
    ],
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.scss'
})
export class ImageUploaderComponent {
  @Input() imageName: string = '';
  @Input() imageLoader: boolean = false
  image: File | null = null;
  imageDelete: any;
  isLoading: boolean = false;
  requestId: string = '';
  inspectionId: string = '';
  selectedFileName: string = '';



  images: any[] = [];
  loading = false;
  imageUpdate: any;

  constructor(
    private imageService: ImageService,
    private inspectionUpdatesService: InspectionUpdatesService,
    private changeDetector: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {
    this.route.queryParamMap.subscribe(params => {
      this.requestId = params.get('id') as string;
    });
  }

  ngOnInit(): void {
    this.getDeleteTrigger();
    this.fetchImages();
    this.getUpdatesTrigger();

  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.image = input.files[0];
      this.selectedFileName = this.image.name;
    }
  }

  submitImage() {
    this.isLoading = false;
    if (this.image) {
      const formData = new FormData();
      formData.append('image', this.image);
      formData.append('imageName', this.imageName);
      formData.append('inspectionId', this.requestId);

      this.imageService.addImage(formData).subscribe(
        (res) => {
          this.inspectionUpdatesService.updateImageData(res);
          if (res?.message === 200) {
            alert('Image added successfully!');
            this.isLoading = true;
            this.resetFileInput();
          }
        },
        (err) => {
          alert('Failed to upload image.');
          this.isLoading = false;
        }
      );
    }
  }

  resetFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
      this.isLoading = false;
    }
    this.image = null;
    this.selectedFileName = '';
  }


  getUpdatesTrigger() {
    this.inspectionUpdatesService.currentImageUpdate.subscribe(
      update => {
        this.imageUpdate = update;
        if(this.imageUpdate?.message === 200) {
          this.fetchImages();
        }
      },
      error => {
        console.error('Error fetching inspection update:', error);
      }
    );
  }

  fetchImages() {
    this.loading = true;
    this.imageService.fetchImages(this.requestId, this.imageName).subscribe(
      (res: any) => {
        this.images = res.images;
        this.loading = false;
      },
      (err) => {
        console.log(err);
        this.loading = false;
      }
    );
  }


  deleteImage(id: string) {
    this.imageService.deleteImage(id).subscribe(
      (res) => {
        if(res?.message === 200) {
          this.fetchImages();
        }
      },
      (err) => {
      }
    );
  }

  getDeleteTrigger() {
    this.inspectionUpdatesService.currentImageDelete.subscribe(
      update => {
        this.imageDelete = update;
        if (this.imageDelete === false) {
        }
      },
      error => {
        console.error('Error fetching inspection update:', error);
      }
    );
  }
}


