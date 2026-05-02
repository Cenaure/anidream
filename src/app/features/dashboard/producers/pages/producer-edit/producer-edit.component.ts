import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IProducer} from '../../_schemas/producer.schema';
import {form, FormField, required} from '@angular/forms/signals';
import {IUser} from '../../../users/_schemas/user.schema';
import {Route} from '../../../../../shared/utils/paths';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HlmButton} from '@spartan-ng/helm/button';
import {HlmCardFooter} from '@spartan-ng/helm/card';
import {HlmInput} from '@spartan-ng/helm/input';
import {HlmLabel} from '@spartan-ng/helm/label';
import {ProducersService} from '../../services/producers.service';

@Component({
  selector: 'app-producer-edit',
  imports: [
    FormsModule,
    HlmButton,
    HlmCardFooter,
    HlmInput,
    HlmLabel,
    ReactiveFormsModule,
    FormField
  ],
  templateUrl: './producer-edit.component.html',
})
export class ProducerEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute)
  private readonly producersService = inject(ProducersService)
  private readonly router = inject(Router)

  protected producer = signal<IProducer>({
    id: '',
    mal_id: 0,
    name: '',
    url: ''
  })

  ngOnInit() {
    this.route.data.subscribe(data => {
      if(data['producer']) {
        this.producer.set(data['producer'])
        this.producerFormModel.set({
          name: data['producer'].name,
          url: data['producer'].url
        })
      }
    })
  }

  //region: ---formDeclaration
  producerFormModel = signal({
    name: '',
    url: ''
  });


  producerEditForm = form(this.producerFormModel, schemaPath => {
    required(schemaPath.name, {message: "Name is required"})
  })
  //endregion: ---formDeclaration

  protected errorMessage = signal('');

  save() {
    if (this.producerEditForm().invalid()) return;

    const data = this.producerFormModel();
    const producer = {
      name: data.name,
      url: data.url
    } as IProducer;

    console.log(producer)
    this.producersService.updateProducer(this.producer()?.mal_id, producer).subscribe({
      next: () => this.router.navigateByUrl(Route.dashboardProducers),
      error: (err) => this.errorMessage.set(err.message ?? 'Something went wrong')
    });
  }
}
