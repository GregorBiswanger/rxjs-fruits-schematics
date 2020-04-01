import { ExerciseService } from '../../shared/exercise.service';
import { Component, OnInit } from '@angular/core';
import { <%= classify(name) %>Exercise } from './<%= dasherize(name) %>-exercise';

@Component({
  selector: 'app-<%= dasherize(name) %>',
  templateUrl: './<%= dasherize(name) %>.component.html',
  styleUrls: ['./<%= dasherize(name) %>.component.scss']
})
export class <%= classify(name) %>Component implements OnInit {
  exerciseTitle = '<%= dasherize(name) %>';
  <%= dasherize(name) %>Code = `
  of(1, 1, 2, 2, 2, 1, 2, 3, 4, 3, 2, 1).pipe(
    distinct()
  ).subscribe(x => console.log(x)); // 1, 2, 3, 4
  `;

  constructor(public exerciseService: ExerciseService) { }

  ngOnInit() {
    this.exerciseService.newExercise(new <%= classify(name) %>Exercise());
  }
}
