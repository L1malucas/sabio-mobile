import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {Cub3DbProvider} from '@cub3/cub3-db/cub3-db';
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import { IonSlides } from '@ionic/angular';
import {StorageUtils} from '@cub3/utils/storage.utils';

@Component({
  selector: 'app-academico-horarios',
  templateUrl: './academico-horarios.page.html',
  styleUrls: ['./academico-horarios.page.scss'],
})
export class AcademicoHorariosPage implements OnInit {
  currentDate: Date = new Date();
  currentDay: number = this.currentDate.getDay();
  currentDayDate: number = this.currentDate.getDate();
  weekDays: any[] = [];
  diaAtual: any;
  turmas: any[] = [];
  filteredTurmas: any[] = [];
  filteredTurmasGroupedBySchool: any[] = [];
  animate: boolean = false;

  constructor(
    private cub3Db: Cub3DbProvider,
    private cub3Svc: Cub3SvcProvider,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ionViewWillEnter() {
    this.turmas = await this.cub3Svc.getTurmas();
    this.generateWeekDays();
    this.diaAtual = this.weekDays.find(day => day.date.getDate() === this.currentDayDate); // Select the current day automatically
    this.filterTurmas();
  }

  ngOnInit() {
    this.diaAtual = this.weekDays.find(day => day.date.getDate() === this.currentDayDate);
    this.filterTurmas();
  }

  generateWeekDays() {
    const startOfWeek = this.getStartOfWeek(this.currentDate);
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      this.weekDays.push({
        label: this.getDayLabel(i),
        date: date,
        hasEvent: this.checkIfDayHasEvent(this.getDayLabel(i))
      });
    }
  }

  getStartOfWeek(date: Date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day == 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(date.setDate(diff));
  }

  getDayLabel(index: number) {
    const days = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];
    return days[index];
  }

  checkIfDayHasEvent(dayLabel: string): boolean {
    const dayMap = {
      'DOM': 'Domingo',
      'SEG': 'Segunda',
      'TER': 'Terça',
      'QUA': 'Quarta',
      'QUI': 'Quinta',
      'SEX': 'Sexta',
      'SAB': 'Sábado'
    };
    const dayName = dayMap[dayLabel];
    return this.turmas.some(turma => turma.dias.includes(dayName));
  }

  selectDay(day: any) {
    this.diaAtual = day;
    this.animate = false; // Reset animation
    setTimeout(() => {
      this.animate = true; // Trigger animation
      this.filterTurmas();
    }, 0);
  }

  isSelected(day: any) {
    return this.diaAtual && this.diaAtual.date.getDate() === day.date.getDate();
  }

  filterTurmas() {
    if (!this.diaAtual) return;
    const dayMap = {
      'DOM': 'Domingo',
      'SEG': 'Segunda',
      'TER': 'Terça',
      'QUA': 'Quarta',
      'QUI': 'Quinta',
      'SEX': 'Sexta',
      'SAB': 'Sábado'
    };
    const selectedDay = dayMap[this.diaAtual.label];
    this.filteredTurmas = this.turmas.filter(turma => turma.dias.includes(selectedDay));
    this.filteredTurmas.sort((a, b) => {
      const [startA] = a.horario.split(' ');
      const [startB] = b.horario.split(' ');
      return this.convertTimeToMinutes(startA) - this.convertTimeToMinutes(startB);
    });
    this.groupTurmasBySchool();
  }

  convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  getHorarioDiscipinaInicio(horarios:any, tipo:string = 'inicio') {
    const diaId = this.diaAtual.date.getDay();  
  
    return (horarios.find(horario => horario.diaId === diaId) || {})[tipo];
  }
  groupTurmasBySchool() {
    const grouped = this.filteredTurmas.reduce((acc, turma) => {
      const school = turma.nomeEscola;
      if (!acc[school]) {
        acc[school] = [];
      }
      acc[school].push(turma);
      return acc;
    }, {});

    this.filteredTurmasGroupedBySchool = Object.keys(grouped).map(school => ({
      school,
      turmas: grouped[school]
    }));
  }
}
