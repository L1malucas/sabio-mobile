import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-academico-abas-container',
  templateUrl: './academico-abas-container.component.html',
  styleUrls: ['./academico-abas-container.component.scss'],
})
export class AcademicoAbasContainerComponent implements OnInit {
  @Input() name: string;

  constructor() { }

  ngOnInit() {}

}
